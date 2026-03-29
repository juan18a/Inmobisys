<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),

            'name' => config('app.name'),

            // ── Auth: añadimos role al usuario ────────────────────────────────
            'auth' => [
                'user' => $request->user() ? [
                    'id'    => $request->user()->id,
                    'name'  => $request->user()->name,
                    'email' => $request->user()->email,
                    'role'  => $request->user()->role,  // 'admin' | 'seller'
                    'email_verified'    => $request->user()->hasVerifiedEmail(),
                    'email_verified_at' => $request->user()->email_verified_at,
                ] : null,
            ],

            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',

            // ── Flash messages globales ───────────────────────────────────────
            // Lazy para no evaluar la sesión en cada request innecesariamente
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
