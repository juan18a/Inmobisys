<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            // ── NUEVO: vendedor propietario ────────────────────────────────────
            $table->foreignId('user_id')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->enum('type', ['house', 'apartment', 'office', 'land', 'commercial'])->default('house');
            $table->enum('operation', ['sale', 'rent'])->default('sale');
            $table->decimal('price', 12, 2);
            $table->string('currency', 3)->default('USD');
            $table->string('address');
            $table->string('city');
            $table->string('state')->nullable();
            $table->string('country')->default('MX');
            $table->string('zip_code', 10)->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->unsignedInteger('bedrooms')->default(0);
            $table->unsignedInteger('bathrooms')->default(0);
            $table->unsignedInteger('parking_spots')->default(0);
            $table->decimal('area_total', 10, 2)->nullable()->comment('Total area in m²');
            $table->decimal('area_built', 10, 2)->nullable()->comment('Built area in m²');
            $table->unsignedInteger('year_built')->nullable();
            $table->json('features')->nullable()->comment('Extra features like pool, gym, etc.');
            $table->enum('status', ['available', 'sold', 'rented', 'reserved'])->default('available');
            $table->boolean('is_featured')->default(false);
            $table->string('cover_image')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
