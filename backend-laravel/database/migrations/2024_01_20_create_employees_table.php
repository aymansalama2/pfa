<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('matricule')->unique();
            $table->string('departement')->nullable();
            $table->string('poste')->nullable();
            $table->date('date_embauche')->nullable();
            $table->decimal('salaire', 10, 2)->nullable();
            $table->string('telephone')->nullable();
            $table->text('adresse')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('employees');
    }
}; 