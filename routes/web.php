<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\Admin\UserController;

// ─── Pública ──────────────────────────────────────────────────────────────────

Route::get('/', [PropertyController::class, 'landing'])->name('home');

// ─── Bloquear registro público ────────────────────────────────────────────────
// Fortify registra sus rutas automáticamente según config/fortify.php.
// Estas rutas adicionales tapan cualquier GET/POST a /register que
// pudiera colarse aunque se elimine Features::registration() del config.

Route::get('/register',  fn () => abort(404))->name('register');
Route::post('/register', fn () => abort(404));

// ─── Dashboard ────────────────────────────────────────────────────────────────

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('panel-de-control', 'dashboard')->name('dashboard');
});

// ─── Gestión de vendedores (solo admin) ───────────────────────────────────────

Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/usuarios',           [UserController::class, 'index'])->name('users.index');
        Route::get('/usuarios/nuevo',     [UserController::class, 'create'])->name('users.create');
        Route::post('/usuarios',          [UserController::class, 'store'])->name('users.store');
        Route::delete('/usuarios/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    });

// ─── Propiedades ──────────────────────────────────────────────────────────────

Route::get('/properties', [PropertyController::class, 'index'])->name('properties.index');

// Crear y editar: admin y seller (cualquier autenticado)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/properties/create',          [PropertyController::class, 'create'])->name('properties.create');
    Route::post('/properties',                [PropertyController::class, 'store'])->name('properties.store');
    Route::get('/properties/{property}/edit', [PropertyController::class, 'edit'])->name('properties.edit');
    Route::match(['put', 'patch'], '/properties/{property}', [PropertyController::class, 'update'])->name('properties.update');
});

// Eliminar: solo admin — doble protección (ruta + controller)
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::delete('/properties/{property}',                [PropertyController::class, 'destroy'])->name('properties.destroy');
    Route::delete('properties/{property}/images/{image}', [PropertyController::class, 'destroyImage'])->name('properties.images.destroy');
});

Route::get('/properties/{property}', [PropertyController::class, 'show'])->name('properties.show');

// ─── Chat Proxy ───────────────────────────────────────────────────────────────

Route::post('/chat', [App\Http\Controllers\ChatProxyController::class, 'send'])->name('chat.send');

// ─── API para N8N ─────────────────────────────────────────────────────────────

Route::middleware('n8n.key')->group(function () {
    Route::get('/api/properties', [PropertyController::class, 'apiIndex'])->name('api.properties.index');
});

// ─── Settings ─────────────────────────────────────────────────────────────────

require __DIR__.'/settings.php';
