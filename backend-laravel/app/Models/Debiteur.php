<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Debiteur extends Model
{
    use HasFactory;

    protected $fillable = [
        'cin',
        'nom',
        'prenom',
        'telephone',
        'adresse',
        'montant_credit'
    ];

    protected $primaryKey = 'cin';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $casts = [
        'montant_credit' => 'decimal:2'
    ];

    public function employees()
    {
        return $this->belongsToMany(Employee::class, 'debiteur_employee', 'debiteur_cin', 'employee_id')
                    ->withPivot(['date_attribution', 'statut', 'notes'])
                    ->withTimestamps();
    }
} 