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
    Schema::table('properties', function (Blueprint $table) {
        // MariaDB necesita que las columnas sean de tipo TEXT o VARCHAR
        // Si ya existen en tu tabla, solo añade el índice
        $table->fullText(['title', 'description', 'address', 'city', 'state', 'country']);
    });
}

public function down(): void
{
    Schema::table('properties', function (Blueprint $table) {
        $table->dropFullText(['title', 'description', 'address', 'city', 'state', 'country']);
    });
}
};
