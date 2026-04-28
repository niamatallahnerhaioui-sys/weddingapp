<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('salles', function (Blueprint $table) {
           $table->id();
           $table->foreignId('prestataire_id')->constrained()->onDelete('cascade');
           $table->string('nom');
           $table->text('adresse');
           $table->string('ville');
           $table->integer('capacite_min');
           $table->integer('capacite_max');
           $table->decimal('prix_journee', 10, 2);
           $table->decimal('prix_soiree', 10, 2);
           $table->string('photo_principale')->nullable(); // Upload
           $table->boolean('disponible')->default(true);
           $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salles');
    }
};
