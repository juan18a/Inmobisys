<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        // ── Sincronizar contraseña del Admin desde el .env ────────────────────
        if ($adminPassword = env('ADMIN_PASSWORD')) {
            try {
                if (\Illuminate\Support\Facades\Schema::hasTable('users')) {
                    $admin = \App\Models\User::where('role', 'admin')->first();

                    if ($admin && !\Illuminate\Support\Facades\Hash::check($adminPassword, $admin->password)) {
                        $admin->update(['password' => \Illuminate\Support\Facades\Hash::make($adminPassword)]);
                    }
                }
            } catch (\Exception $e) {
                // Silenciar errores durante el boot (ej: migraciones no ejecutadas)
            }
        }
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
