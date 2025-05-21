<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class EmployeeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function profile(Request $request)
    {
        try {
            $user = $request->user();
            $employee = $user->employee;

            if (!$employee) {
                return response()->json([
                    'message' => 'Profil employé non trouvé'
                ], 404);
            }

            return response()->json([
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at,
                'employee' => $employee
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur profile(): ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de la récupération du profil'
            ], 500);
        }
    }

    public function update(Request $request)
    {
        try {
            $user = $request->user();
            
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . $user->id,
                // Ajoutez d'autres règles de validation si nécessaire
            ]);

            $user->update($validated);

            return response()->json([
                'message' => 'Profil mis à jour avec succès',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la mise à jour du profil',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function debiteurs(Request $request)
    {
        try {
            $user = $request->user();
            $employee = $user->employee;

            if (!$employee) {
                return response()->json([
                    'message' => 'Profil employé non trouvé'
                ], 404);
            }

            // Récupérer les débiteurs avec leurs informations de pivot
            $debiteurs = DB::table('debiteurs')
                ->join('debiteur_employee', 'debiteurs.cin', '=', 'debiteur_employee.debiteur_cin')
                ->where('debiteur_employee.employee_id', $employee->id)
                ->select(
                    'debiteurs.cin',
                    'debiteurs.nom',
                    'debiteurs.prenom',
                    'debiteurs.montant_credit',
                    'debiteur_employee.date_attribution',
                    'debiteur_employee.statut',
                    'debiteur_employee.notes'
                )
                ->get();

            return response()->json([
                'success' => true,
                'debiteurs' => $debiteurs
            ]);

        } catch (\Exception $e) {
            \Log::error('Erreur dans debiteurs(): ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des débiteurs',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 