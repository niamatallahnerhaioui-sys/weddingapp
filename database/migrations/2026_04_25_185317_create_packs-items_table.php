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
        Schema::create('packs_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pack_id')->constrained()->onDelete('cascade');
            $table->string('type_prestataire');
            $table->foreignId('prestataire_id')->nullable()->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
{
    Schema::table('packs_items', function (Blueprint $table) {
        // كنحيدو الارتباط أولاً
        $table->dropForeign(['pack_id']); 
    });
    // عاد كنمسحو الجدول
    Schema::dropIfExists('packs_items');
}
};
