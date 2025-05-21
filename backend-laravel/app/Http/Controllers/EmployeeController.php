<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees = Employee::with(['user', 'debiteurs'])->get()->map(function ($employee) {
            return [
                'id' => $employee->id,
                'matricule' => $employee->matricule,
                'name' => $employee->user->name,
                'email' => $employee->user->email,
                'departement' => $employee->departement,
                'poste' => $employee->poste,
                'date_embauche' => $employee->date_embauche,
                'salaire' => $employee->salaire,
                'telephone' => $employee->telephone,
                'adresse' => $employee->adresse,
                'debiteurs' => $employee->debiteurs->map(function ($debiteur) {
                    return [
                        'cin' => $debiteur->cin,
                        'nom' => $debiteur->nom,
                        'prenom' => $debiteur->prenom,
                        'statut' => $debiteur->pivot->statut,
                        'date_attribution' => $debiteur->pivot->date_attribution,
                        'notes' => $debiteur->pivot->notes,
                        'created_at' => $debiteur->pivot->created_at,
                        'updated_at' => $debiteur->pivot->updated_at
                    ];
                })
            ];
        });

        return response()->json($employees);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'matricule' => 'required|string',
            'name' => 'required|string',
            'email' => 'required|email',
            'departement' => 'nullable|string',
            'poste' => 'nullable|string',
            'date_embauche' => 'required|date',
            'salaire' => 'nullable|numeric',
            'telephone' => 'nullable|string',
            'adresse' => 'nullable|string'
        ]);

        try {
            $employee = Employee::findOrFail($id);
            
            // Mise à jour des données de l'employé
            $employee->update([
                'matricule' => $request->matricule,
                'departement' => $request->departement,
                'poste' => $request->poste,
                'date_embauche' => $request->date_embauche,
                'salaire' => $request->salaire,
                'telephone' => $request->telephone,
                'adresse' => $request->adresse
            ]);

            // Mise à jour des données de l'utilisateur associé
            $employee->user->update([
                'name' => $request->name,
                'email' => $request->email
            ]);

            return response()->json([
                'message' => 'Employé mis à jour avec succès',
                'employee' => [
                    'id' => $employee->id,
                    'matricule' => $employee->matricule,
                    'name' => $employee->user->name,
                    'email' => $employee->user->email,
                    'departement' => $employee->departement,
                    'poste' => $employee->poste,
                    'date_embauche' => $employee->date_embauche,
                    'salaire' => $employee->salaire,
                    'telephone' => $employee->telephone,
                    'adresse' => $employee->adresse
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la mise à jour: ' . $e->getMessage()
            ], 500);
        }
    }
} 