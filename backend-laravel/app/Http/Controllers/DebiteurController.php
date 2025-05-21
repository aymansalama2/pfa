<?php

namespace App\Http\Controllers;

use App\Models\Debiteur;
use Illuminate\Http\Request;
use League\Csv\Reader;
use App\Models\Employee;

class DebiteurController extends Controller
{
    // ... existing code ...

public function import(Request $request)
{
    $request->validate([
        'file' => 'required|file|mimes:csv,txt|max:10240',
        'employee_ids' => 'required|array',
        'employee_ids.*' => 'required|exists:employees,id'
    ]);

    try {
        $csv = Reader::createFromPath($request->file('file')->getPathname());
        $csv->setHeaderOffset(0);
        $records = $csv->getRecords();
        
        $importCount = 0;
        $skippedCount = 0;
        $debiteurs = [];
        
        foreach ($records as $record) {
            // Nettoyer et valider le montant_credit
            $montantCredit = isset($record['montant_credit']) ? 
                str_replace([' ', ','], ['', '.'], trim($record['montant_credit'])) : 
                0;
            
            // Convertir en float ou mettre à 0 si invalide
            $montantCredit = is_numeric($montantCredit) ? (float)$montantCredit : 0;

            // Vérifier si le débiteur existe déjà et s'il est déjà attribué
            $existingDebiteur = Debiteur::with('employees')
                ->where('cin', trim($record['cin']))
                ->first();
            
            if ($existingDebiteur && $existingDebiteur->employees->isNotEmpty()) {
                $skippedCount++;
                continue;
            }

            // Créer ou mettre à jour le débiteur
            $debiteur = Debiteur::updateOrCreate(
                ['cin' => trim($record['cin'])],
                [
                    'nom' => trim($record['nom']),
                    'prenom' => trim($record['prenom']),
                    'telephone' => isset($record['telephone']) ? trim($record['telephone']) : null,
                    'adresse' => isset($record['adresse']) ? trim($record['adresse']) : null,
                    'montant_credit' => $montantCredit
                ]
            );

            if (!$existingDebiteur) {
                $importCount++;
            }
            
            $debiteurs[] = [
                'debiteur' => $debiteur,
                'montant' => $montantCredit
            ];
        }

        // Si aucun nouveau débiteur à attribuer
        if (empty($debiteurs)) {
            return response()->json([
                'message' => "Import terminé. Aucun nouveau débiteur à attribuer. $skippedCount débiteurs déjà attribués.",
                'attributions' => []
            ]);
        }

        // Préparer les employés et leurs attributions
        $employees = Employee::whereIn('id', $request->employee_ids)->get();
        $attributions = $this->distributeDebiteurs($debiteurs, $employees);
        
        // Effectuer les attributions en base de données
        foreach ($attributions as $attribution) {
            if (!empty($attribution['debiteurs'])) {
                foreach ($attribution['debiteurs'] as $debiteur) {
                    $attribution['employee']->debiteurs()->attach($debiteur['debiteur']->cin, [
                        'date_attribution' => now(),
                        'statut' => 'en_cours',
                        'notes' => 'Attribution automatique lors de l\'import'
                    ]);
                }
            }
        }

        return response()->json([
            'message' => "Import et attribution réussis. $importCount débiteurs répartis.",
            'attributions' => array_map(function($attr) {
                return [
                    'employee_name' => $attr['employee']->user->name,
                    'debiteurs_count' => count($attr['debiteurs']),
                    'total_credit' => $attr['total_credit']
                ];
            }, $attributions)
        ]);

    } catch (\Exception $e) {
        \Log::error('Erreur import débiteurs: ' . $e->getMessage());
        \Log::error($e->getTraceAsString());
        
        return response()->json([
            'message' => 'Erreur lors de l\'import: ' . $e->getMessage(),
            'details' => $e->getTraceAsString()
        ], 500);
    }
}

private function distributeDebiteurs($debiteurs, $employees)
{
    // Initialiser les attributions
    $attributions = [];
    foreach ($employees as $employee) {
        $attributions[$employee->id] = [
            'employee' => $employee,
            'debiteurs' => [],
            'total_credit' => 0,
            'count' => 0
        ];
    }

    // Calculer le nombre de débiteurs par employé
    $debiteurCount = count($debiteurs);
    $employeeCount = count($employees);
    $baseDebiteurPerEmployee = floor($debiteurCount / $employeeCount);
    $remainingDebiteurs = $debiteurCount % $employeeCount;

    // Trier les débiteurs par montant de crédit décroissant
    usort($debiteurs, function($a, $b) {
        return $b['montant'] - $a['montant'];
    });

    // Distribution des débiteurs
    $currentEmployeeIndex = 0;
    foreach ($debiteurs as $debiteur) {
        $currentEmployee = $employees[$currentEmployeeIndex];
        $currentAttribution = &$attributions[$currentEmployee->id];

        // Vérifier si l'employé actuel peut recevoir plus de débiteurs
        $maxDebiteurs = $baseDebiteurPerEmployee + ($remainingDebiteurs > 0 ? 1 : 0);
        
        if ($currentAttribution['count'] >= $maxDebiteurs) {
            // Passer à l'employé suivant
            $currentEmployeeIndex = ($currentEmployeeIndex + 1) % $employeeCount;
            $remainingDebiteurs = max(0, $remainingDebiteurs - 1);
            $currentEmployee = $employees[$currentEmployeeIndex];
            $currentAttribution = &$attributions[$currentEmployee->id];
        }

        // Attribuer le débiteur
        $currentAttribution['debiteurs'][] = $debiteur;
        $currentAttribution['total_credit'] += floatval($debiteur['montant']);
        $currentAttribution['count']++;

        // Passer à l'employé suivant pour la prochaine attribution
        $currentEmployeeIndex = ($currentEmployeeIndex + 1) % $employeeCount;
    }

    // Équilibrage final des montants
    $this->balanceDistribution($attributions);

    return $attributions;
}

private function balanceDistribution(&$attributions)
{
    $totalMontants = array_sum(array_map(function($attr) {
        return $attr['total_credit'];
    }, $attributions));
    
    $employeeCount = count($attributions);
    $targetMontantPerEmployee = $totalMontants / $employeeCount;

    // Trier les attributions par montant total
    uasort($attributions, function($a, $b) {
        return $b['total_credit'] - $a['total_credit'];
    });

    // Essayer d'équilibrer les montants
    $iterations = 0;
    $maxIterations = 100;

    while ($iterations < $maxIterations) {
        $modified = false;
        $maxDiff = 0;

        $employeeIds = array_keys($attributions);
        for ($i = 0; $i < count($employeeIds) - 1; $i++) {
            for ($j = $i + 1; $j < count($employeeIds); $j++) {
                $emp1Id = $employeeIds[$i];
                $emp2Id = $employeeIds[$j];

                $diff = abs($attributions[$emp1Id]['total_credit'] - $attributions[$emp2Id]['total_credit']);
                if ($diff > $maxDiff) {
                    $maxDiff = $diff;
                }

                if ($diff > 1000) {
                    $this->trySwapDebiteurs($attributions[$emp1Id], $attributions[$emp2Id]);
                    $modified = true;
                }
            }
        }

        if (!$modified || $maxDiff < 1000) {
            break;
        }

        $iterations++;
    }
}

private function trySwapDebiteurs(&$attribution1, &$attribution2)
{
    $diff = $attribution1['total_credit'] - $attribution2['total_credit'];
    if (abs($diff) < 100) return false;

    foreach ($attribution1['debiteurs'] as $i => $deb1) {
        foreach ($attribution2['debiteurs'] as $j => $deb2) {
            $newDiff = abs(
                ($attribution1['total_credit'] - $deb1['montant'] + $deb2['montant']) -
                ($attribution2['total_credit'] - $deb2['montant'] + $deb1['montant'])
            );
            
            if ($newDiff < abs($diff)) {
                // Échanger les débiteurs
                $temp = $attribution1['debiteurs'][$i];
                $attribution1['debiteurs'][$i] = $attribution2['debiteurs'][$j];
                $attribution2['debiteurs'][$j] = $temp;

                // Mettre à jour les totaux
                $attribution1['total_credit'] = $attribution1['total_credit'] - $deb1['montant'] + $deb2['montant'];
                $attribution2['total_credit'] = $attribution2['total_credit'] - $deb2['montant'] + $deb1['montant'];

                return true;
            }
        }
    }

    return false;
}

// ... existing code ...

    public function index()
    {
        return Debiteur::all();
    }

    public function assignToEmployee(Request $request)
    {
        $request->validate([
            'debiteur_cins' => 'required|array',
            'debiteur_cins.*' => 'required|exists:debiteurs,cin',
            'employee_id' => 'required|exists:employees,id',
            'notes' => 'nullable|string'
        ]);

        try {
            $employee = Employee::findOrFail($request->employee_id);
            
            foreach ($request->debiteur_cins as $cin) {
                $employee->debiteurs()->attach($cin, [
                    'date_attribution' => now(),
                    'statut' => 'en_cours',
                    'notes' => $request->notes
                ]);
            }

            return response()->json([
                'message' => 'Débiteurs assignés avec succès',
                'count' => count($request->debiteur_cins)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de l\'attribution: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getEmployeeDebiteurs($employee_id)
    {
        $employee = Employee::findOrFail($employee_id);
        return $employee->debiteurs()->with('pivot')->get();
    }

    public function update(Request $request, $cin)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string',
            'montant_credit' => 'required|numeric|min:0'
        ]);

        try {
            $debiteur = Debiteur::findOrFail($cin);
            $debiteur->update([
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'telephone' => $request->telephone,
                'adresse' => $request->adresse,
                'montant_credit' => $request->montant_credit
            ]);

            return response()->json([
                'message' => 'Débiteur mis à jour avec succès',
                'debiteur' => $debiteur
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la mise à jour du débiteur: ' . $e->getMessage()
            ], 500);
        }
    }
} 