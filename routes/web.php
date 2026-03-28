<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\PropertyController;

// ─── Public ──────────────────────────────────────────────────────────────────

Route::get('/', [PropertyController::class, 'landing'])->name('home');

// ─── Admin (authenticated) ────────────────────────────────────────────────────

Route::middleware(['auth'])->group(function () {
    Route::inertia('panel-de-control', 'dashboard')->name('dashboard');
});

// ─── Properties (public browse + admin CRUD) ─────────────────────────────────

Route::get('/properties', [PropertyController::class, 'index'])->name('properties.index');

Route::middleware(['auth'])->group(function () {
    Route::get('/properties/create',             [PropertyController::class, 'create'])->name('properties.create');
    Route::post('/properties',                   [PropertyController::class, 'store'])->name('properties.store');
    Route::get('/properties/{property}/edit',    [PropertyController::class, 'edit'])->name('properties.edit');
    Route::match(['put', 'patch'], '/properties/{property}', [PropertyController::class, 'update'])->name('properties.update');
    Route::delete('/properties/{property}',      [PropertyController::class, 'destroy'])->name('properties.destroy');

    Route::delete(
        'properties/{property}/images/{image}',
        [PropertyController::class, 'destroyImage']
    )->name('properties.images.destroy');
});

Route::get('/properties/{property}', [PropertyController::class, 'show'])->name('properties.show');

// ─── N8N Chat Agent API ───────────────────────────────────────────────────────
//
// Protected by the X-N8N-API-Key header (VerifyN8nApiKey middleware).
// N8N sends GET /api/properties?type=&operation=&city=&min_price=&max_price=&bedrooms=
// and receives JSON back (PropertyController::apiIndex).
//
// Register the middleware alias in app/Http/Kernel.php:
//   'n8n.key' => \App\Http\Middleware\VerifyN8nApiKey::class,
//
// Add to config/services.php:
//   'n8n' => ['key' => env('N8N_API_KEY')],
//
// Add to .env:
//   N8N_API_KEY=your-long-random-secret-here
//   LARAVEL_APP_URL=https://yourdomain.com          # used by N8N workflow
//   VITE_N8N_WEBHOOK_URL=https://your-n8n.com/webhook/ethereal-chat  # used by React

Route::middleware('n8n.key')->group(function () {
    Route::get('/api/properties', [PropertyController::class, 'apiIndex'])->name('api.properties.index');
});

// ─── Settings ─────────────────────────────────────────────────────────────────

require __DIR__.'/settings.php';