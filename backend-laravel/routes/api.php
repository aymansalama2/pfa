<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DebiteurController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\Api\EmployeeController as ApiEmployeeController;
use Illuminate\Support\Facades\DB;

// Route de test
Route::get('/test', function() {
    return response()->json(['message' => 'API is working']);
});

// Route d'inscription
Route::post('/signup', [AuthController::class, 'signup']);

// Route de connexion
Route::post('/signin', [AuthController::class, 'signin']);

// Routes protégées par authentification
Route::middleware(['auth:sanctum'])->group(function () {
    // Routes avec rate limiting standard
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    
    // Routes de débiteurs avec rate limiting plus élevé
    Route::middleware(['throttle:debiteurs'])->group(function () {
        Route::post('/debiteurs/import', [DebiteurController::class, 'import']);
        Route::get('/debiteurs', [DebiteurController::class, 'index']);
        Route::post('/debiteurs/assign', [DebiteurController::class, 'assignToEmployee']);
        Route::get('/employees/{employee_id}/debiteurs', [DebiteurController::class, 'getEmployeeDebiteurs']);
        Route::put('/debiteurs/{cin}', [DebiteurController::class, 'update']);
    });

    // Autres routes
    Route::get('/employees', [EmployeeController::class, 'index']);
    Route::put('/employees/{id}', [EmployeeController::class, 'update']);
    Route::get('/employee/profile', [ApiEmployeeController::class, 'profile']);
    Route::put('/employee/profile', [ApiEmployeeController::class, 'update']);

    // New route for debiteurs
    Route::get('/employee/debiteurs', [ApiEmployeeController::class, 'debiteurs']);
});
