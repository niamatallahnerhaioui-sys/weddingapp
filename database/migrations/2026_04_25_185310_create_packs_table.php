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
    Schema::create('packs', function (Blueprint $table) {
        $table->id();
        $table->string('nom'); 
        $table->text('description');
        $table->integer('reduction_pct');
        $table->decimal('prix_estime', 12, 2);
        $table->enum('type', ['essentiel', 'confort', 'premium']); // هاد السطر اللي كان ناقص
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packs');
    }
};
