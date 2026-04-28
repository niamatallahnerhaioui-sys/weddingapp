<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   // database/migrations/xxxx_create_wedding_data_tables.php
public function up()
{
    // جدول الميزانية
    Schema::create('budgets', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('category'); // Venue, Food, etc.
        $table->decimal('estimated_amount', 10, 2);
        $table->decimal('paid_amount', 10, 2)->default(0);
        $table->timestamps();
    });

    // جدول المهام
    Schema::create('checklists', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('task');
        $table->boolean('is_completed')->default(false);
        $table->date('due_date')->nullable();
        $table->timestamps();
    });
}
};
