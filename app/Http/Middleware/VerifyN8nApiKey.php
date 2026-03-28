<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Verifies that requests to /api/properties come from N8N
 * by checking the X-N8N-API-Key header against the value
 * stored in config/services.php  (key: n8n.api_key)
 * which reads from the N8N_API_KEY environment variable.
 *
 * Add to app/Http/Kernel.php under $routeMiddleware:
 *   'n8n.key' => \App\Http\Middleware\VerifyN8nApiKey::class,
 *
 * Then protect the route in web.php / api.php:
 *   Route::middleware('n8n.key')->get('/api/properties', ...);
 */
class VerifyN8nApiKey
{
    public function handle(Request $request, Closure $next): Response
    {
        $expected = config('services.n8n.key');

        // If no key is configured, fail closed (never allow open access)
        if (empty($expected)) {
            return response()->json(
                ['error' => 'API key not configured on server.'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }

        $provided = $request->header('X-API-KEY');

        // Timing-safe comparison to prevent timing attacks
        if (!$provided || !hash_equals($expected, $provided)) {
            return response()->json(
                ['error' => 'Unauthorized.'],
                Response::HTTP_UNAUTHORIZED
            );
        }

        return $next($request);
    }
}