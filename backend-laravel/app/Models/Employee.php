<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'matricule',
        'departement',
        'poste',
        'date_embauche',
        'salaire',
        'telephone',
        'adresse'
    ];

    protected $casts = [
        'date_embauche' => 'date',
        'salaire' => 'decimal:2'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function debiteurs()
    {
        return $this->belongsToMany(Debiteur::class, 'debiteur_employee', 'employee_id', 'debiteur_cin')
                    ->withPivot(['date_attribution', 'statut', 'notes'])
                    ->withTimestamps();
    }
} 