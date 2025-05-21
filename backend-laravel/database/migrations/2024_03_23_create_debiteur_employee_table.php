<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('debiteur_employee', function (Blueprint $table) {
            $table->id();
            $table->string('debiteur_cin');
            $table->unsignedBigInteger('employee_id');
            $table->date('date_attribution');
            $table->string('statut')->default('en_cours'); // en_cours, termine, annule
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('debiteur_cin')
                  ->references('cin')
                  ->on('debiteurs')
                  ->onDelete('cascade');
                  
            $table->foreign('employee_id')
                  ->references('id')
                  ->on('employees')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('debiteur_employee');
    }
}; 