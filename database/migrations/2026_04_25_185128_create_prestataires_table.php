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
        Schema::create('prestataires', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('nom_commercial');
            $table->enum('type_service', ['salle', 'traiteur', 'photographe', 'dj', 'negafa']);
            $table->text('description')->nullable();
            $table->string('telephone');
            $table->string('ville');
            $table->boolean('statut_verifie')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prestataires');
    }
};
