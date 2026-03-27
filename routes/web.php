<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\PropertyController;

//Route::get('/landing, [PropertyController::class, 'landing'])->name('landing');
/*
Route::inertia('/', 'landing', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');
*/

Route::get('/', [PropertyController::class, 'landing'])->name('home');





Route::middleware(['auth'])->group(function () {
    Route::inertia('panel-de-control', 'dashboard')->name('dashboard');    
});


// Rutas de propiedades
Route::get('/properties', [PropertyController::class, 'index'])->name('properties.index');

Route::middleware(['auth'])->group(function () {
    // Rutas de gestión (privadas)
    Route::get('/properties/create', [PropertyController::class, 'create'])->name('properties.create');
    Route::post('/properties', [PropertyController::class, 'store'])->name('properties.store');
    Route::get('/properties/{property}/edit', [PropertyController::class, 'edit'])->name('properties.edit');
    Route::match(['put', 'patch'], '/properties/{property}', [PropertyController::class, 'update'])->name('properties.update');
    Route::delete('/properties/{property}', [PropertyController::class, 'destroy'])->name('properties.destroy');

    // Eliminar una imagen individual
    Route::delete(
        'properties/{property}/images/{image}',
        [PropertyController::class, 'destroyImage']
    )->name('properties.images.destroy');
});

Route::get('/properties/{property}', [PropertyController::class, 'show'])->name('properties.show');

require __DIR__.'/settings.php';
