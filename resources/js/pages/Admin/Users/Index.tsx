import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard',  href: route('dashboard') },
    { title: 'Vendedores', href: route('admin.users.index') },
];

interface Seller {
    id: number;
    name: string;
    email: string;
    created_at: string;
    email_verified_at: string | null;
}

export default function UsersIndex({ sellers }: { sellers: Seller[] }) {
    const { flash } = usePage().props as any;

    function handleDelete(seller: Seller) {
        if (! confirm(`¿Eliminar al vendedor "${seller.name}"?\nEsta acción no se puede deshacer.`)) return;
        router.delete(route('admin.users.destroy', seller.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vendedores" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold font-headline text-secondary">Vendedores</h1>
                        <p className="text-sm text-on-surface-variant opacity-70">
                            {sellers.length} vendedor{sellers.length !== 1 ? 'es' : ''} registrados
                        </p>
                    </div>
                    <Link
                        href={route('admin.users.create')}
                        className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-6 py-2.5 rounded-lg transition-all shadow-sm active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[20px]">person_add</span>
                        Nuevo vendedor
                    </Link>
                </div>

                {/* Flash */}
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-5 py-3 text-sm font-medium flex items-center gap-3 shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        {flash.success}
                    </div>
                )}

                {/* Tabla / vacío */}
                {sellers.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-300">
                        <span className="material-symbols-outlined text-6xl text-neutral-300 mb-4">group_off</span>
                        <p className="font-headline text-xl text-neutral-400 font-bold">No hay vendedores registrados</p>
                        <p className="text-sm text-neutral-400 mt-1">Crea el primero con el botón de arriba.</p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-sidebar-border/70 shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-700">
                                <tr>
                                    <th className="text-left px-6 py-3 font-semibold text-neutral-600 dark:text-neutral-300">Nombre</th>
                                    <th className="text-left px-6 py-3 font-semibold text-neutral-600 dark:text-neutral-300">Correo</th>
                                    <th className="text-left px-6 py-3 font-semibold text-neutral-600 dark:text-neutral-300 hidden sm:table-cell">Estado</th>
                                    <th className="text-left px-6 py-3 font-semibold text-neutral-600 dark:text-neutral-300 hidden md:table-cell">Creado</th>
                                    <th className="px-6 py-3 w-12" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {sellers.map(seller => (
                                    <tr key={seller.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100">{seller.name}</td>
                                        <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">{seller.email}</td>
                                        <td className="px-6 py-4 hidden sm:table-cell">
                                            {seller.email_verified_at ? (
                                                <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                                                    <span className="material-symbols-outlined text-[13px]">verified</span>
                                                    Verificado
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                                                    Pendiente
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400 hidden md:table-cell">
                                            {new Date(seller.created_at).toLocaleDateString('es-MX', {
                                                year: 'numeric', month: 'short', day: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(seller)}
                                                className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 p-1.5 rounded-lg transition-colors"
                                                title="Eliminar vendedor"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
