<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('upload_documents', function (Blueprint $table) {
            $table->id();

            $table->string('file_name');
            $table->string('file_path');
            $table->string('mime_type')->nullable();
            $table->longText('extracted_text')->nullable();

            $table->string('provider_file_id')->nullable();
            $table->string('provider_store_id')->nullable();

            $table->json('metadata')->nullable();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('upload_documents');
    }
};
