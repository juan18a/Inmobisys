<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Actions\Fortify\UpdateUserPassword;
use App\Actions\Fortify\UpdateUserProfileInformation;
use App\Http\Middleware\ValidateTurnstile;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Laravel\Fortify\Actions\AttemptToAuthenticate;
use Laravel\Fortify\Actions\EnsureLoginIsNotThrottled;
use Laravel\Fortify\Actions\PrepareAuthenticatedSession;
use Laravel\Fortify\Actions\RedirectIfTwoFactorAuthenticatable;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        Fortify::createUsersUsing(CreateNewUser::class);
        Fortify::updateUserProfileInformationUsing(UpdateUserProfileInformation::class);
        Fortify::updateUserPasswordsUsing(UpdateUserPassword::class);
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);

        // ── Rate limiting en login ─────────────────────────────────────────────
        RateLimiter::for('login', function (Request $request) {
            $key = strtolower($request->input(Fortify::username())) . '|' . $request->ip();
            return Limit::perMinute(5)->by($key);
        });

        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        // ── Pipeline de autenticación con Turnstile ────────────────────────────
        // Fortify ejecuta este pipeline en orden al recibir POST /login.
        // ValidateTurnstile va primero: si falla, corta el pipeline y regresa
        // al login con un error antes de intentar siquiera la contraseña.
        Fortify::authenticateThrough(function (Request $request) {
            return array_filter([
                ValidateTurnstile::class,           // 1. Verificar captcha
                EnsureLoginIsNotThrottled::class,   // 2. Rate limiting
                RedirectIfTwoFactorAuthenticatable::class, // 3. 2FA si está activo
                AttemptToAuthenticate::class,       // 4. Verificar credenciales
                PrepareAuthenticatedSession::class, // 5. Iniciar sesión
            ]);
        });

        // ── Vista de login: pasa la site key de Turnstile ─────────────────────
        Fortify::loginView(function () {
            return inertia('auth/login', [
                'canResetPassword' => \Illuminate\Support\Facades\Route::has('password.request'),
                'canRegister'      => false, // registro deshabilitado
                'status'           => session('status'),
                'turnstileSiteKey' => config('services.turnstile.site_key'),
            ]);
        });

        // Sin vista de registro — web.php devuelve 404 en esas rutas
    }
}
