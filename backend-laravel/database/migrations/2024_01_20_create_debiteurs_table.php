<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('debiteurs', function (Blueprint $table) {
            $table->id();
            $table->string('cin')->unique(); // CIN comme clé primaire
            $table->string('nom');
            $table->string('prenom');
            $table->string('telephone')->nullable();
            $table->text('adresse')->nullable();
            $table->decimal('montant_credit', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('debiteurs');
    }
}; 