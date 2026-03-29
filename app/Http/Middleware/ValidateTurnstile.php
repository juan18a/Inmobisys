<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\Response;

/**
 * Valida el token de Cloudflare Turnstile en el POST /login.
 *
 * Solo actúa en POST. Si el token está ausente o es inválido,
 * regresa al login con un error visible sin revelar credenciales.
 *
 * Requiere en .env:
 *   TURNSTILE_SITE_KEY=...     → para el widget en el frontend
 *   TURNSTILE_SECRET_KEY=...   → para esta validación server-side
 */
class ValidateTurnstile
{
    public function handle(Request $request, Closure $next): Response
    {
        // Solo interceptar POST (el GET del formulario pasa libre)
        if (! $request->isMethod('POST')) {
            return $next($request);
        }

        $token = $request->input('cf-turnstile-response');

        if (! $token) {
            return back()
                ->withInput($request->except('password', 'cf-turnstile-response'))
                ->withErrors(['cf-turnstile-response' => 'Por favor completa la verificación de seguridad.']);
        }

        $result = Http::asForm()->post(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            [
                'secret'   => config('services.turnstile.secret_key'),
                'response' => $token,
                'remoteip' => $request->ip(),
            ]
        );

        if (! $result->successful() || ! $result->json('success')) {
            return back()
                ->withInput($request->except('password', 'cf-turnstile-response'))
                ->withErrors(['cf-turnstile-response' => 'Verificación fallida. Inténtalo de nuevo.']);
        }

        return $next($request);
    }
}
