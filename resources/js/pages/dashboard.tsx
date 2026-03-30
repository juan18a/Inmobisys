import { Head, Link } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

export default function Dashboard() {
    const { auth } = usePage().props as any;
    const isAdmin = auth?.user?.role === 'admin';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Link
                        href={route('properties.index')}
                        className="group relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-neutral-900 p-6 flex flex-col justify-between hover:border-primary transition-colors shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                <span className="material-symbols-outlined text-3xl">real_estate_agent</span>
                            </div>
                            <span className="material-symbols-outlined text-neutral-400 group-hover:text-primary transition-colors">arrow_forward</span>
                        </div>
                        <div>
                            <h3 className="font-headline text-xl font-bold">Gestión de Propiedades</h3>
                            <p className="text-sm text-neutral-500">Administra tus listados, edita y añade nuevas propiedades.</p>
                        </div>
                    </Link>

                    {isAdmin && (
                        <Link
                            href={route('admin.users.index')}
                            className="group relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-neutral-900 p-6 flex flex-col justify-between hover:border-primary transition-colors shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                    <span className="material-symbols-outlined text-3xl">supervised_user_circle</span>
                                </div>
                                <span className="material-symbols-outlined text-neutral-400 group-hover:text-primary transition-colors">arrow_forward</span>
                            </div>
                            <div>
                                <h3 className="font-headline text-xl font-bold">Gestión de vendedores</h3>
                                <p className="text-sm text-neutral-500">Administra tus vendedores para que ellos creen sus propiedades.</p>
                            </div>
                        </Link>
                    )}

                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>

                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}