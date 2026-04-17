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
    Schema::create('tickets', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->cascadeOnDelete();
        $table->string('subject');
        $table->text('description')->nullable();

        // الحقول اللي راح يملأها الـ AI
        $table->string('department')->nullable(); // support, billing...
        $table->string('priority')->nullable();   // low, medium, high...
        $table->string('sentiment')->nullable();  // positive, negative...

        $table->string('status')->default('open'); // open, closed

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
