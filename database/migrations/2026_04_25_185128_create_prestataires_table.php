<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
 public function up()
{
   Schema::create('prestataires', function (Blueprint $table) {
        $table->id(); // هاد id هو prestataire_id
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        $table->string('type'); // مثلاً: Traiteur, Salle, Photographe
        $table->string('nom'); // اسم العلامة التجارية أو المحل
        $table->text('description')->nullable();
        $table->string('ville');
        $table->string('telephone');
        $table->boolean('statut_verifi')->default(false);
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
