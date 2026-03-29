<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Gestión de vendedores. Solo accesible con middleware 'role:admin'.
 */
class UserController extends Controller
{
    public function index(): Response
    {
        $sellers = User::where('role', 'seller')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'created_at', 'email_verified_at']);

        return Inertia::render('Admin/Users/Index', [
            'sellers' => $sellers,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Users/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        User::create([
            'name'              => $validated['name'],
            'email'             => $validated['email'],
            'password'          => Hash::make($validated['password']),
            'role'              => 'seller',
            'email_verified_at' => now(), // creado ya verificado por el admin
        ]);

        return to_route('admin.users.index')
            ->with('success', "Vendedor «{$validated['name']}» creado correctamente.");
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->isAdmin()) {
            abort(403, 'No puedes eliminar una cuenta de administrador.');
        }

        $name = $user->name;
        $user->delete();

        return to_route('admin.users.index')
            ->with('success', "Vendedor «{$name}» eliminado.");
    }
}
