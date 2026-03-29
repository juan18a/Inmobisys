<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Crea o actualiza el usuario administrador.
 *
 * Variables requeridas en .env:
 *   ADMIN_NAME="Nombre Admin"
 *   ADMIN_EMAIL=admin@tudominio.com
 *   ADMIN_PASSWORD=ContraseñaSegura!
 *
 * En deploy:
 *   php artisan migrate --force
 *   php artisan db:seed --class=AdminSeeder --force
 */
class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@inmobiliaria.com');

        User::updateOrCreate(
            ['email' => $email],
            [
                'name'              => env('ADMIN_NAME', 'Administrador'),
                'password'          => Hash::make(env('ADMIN_PASSWORD', 'change-me-NOW!')),
                'role'              => 'admin',
                'email_verified_at' => now(),
            ]
        );

        $this->command->info("✅ Admin listo: {$email}");
    }
}
