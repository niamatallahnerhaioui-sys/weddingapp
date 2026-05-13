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
        Schema::create('formules', function (Blueprint $table) {
            $table->id();
            // الربط مع جدول الممونين (prestataires)
            $table->foreignId('prestataire_id')->constrained('prestataires')->onDelete('cascade');
            $table->string('nom');
            $table->text('description');
            $table->decimal('prix_par_personne', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formules');
    }
};