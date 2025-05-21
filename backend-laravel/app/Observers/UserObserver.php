<?php

namespace App\Observers;

use App\Models\User;
use App\Models\Employee;

class UserObserver
{
    public function created(User $user)
    {
        if ($user->role === 'employee') {
            $this->createEmployee($user);
        }
    }

    public function updated(User $user)
    {
        if ($user->role === 'employee' && !$user->employee) {
            $this->createEmployee($user);
        } elseif ($user->role !== 'employee' && $user->employee) {
            $user->employee->delete();
        }
    }

    private function createEmployee(User $user)
    {
        Employee::create([
            'user_id' => $user->id,
            'matricule' => 'EMP' . str_pad($user->id, 5, '0', STR_PAD_LEFT),
            'date_embauche' => now(),
        ]);
    }
} 