import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import PropertyCard from '@/components/custom/PropertyCard';
import { mapProperties } from '@/components/custom/utils/propertyMapper';
import type { BreadcrumbItem, PaginatedProperties, PropertyData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard',              href: route('dashboard') },
    { title: 'Gestión de Propiedades', href: route('properties.index') },
];

const TYPE_LABELS = {
    house: 'Casa', apartment: 'Apartamento', office: 'Oficina',
    land: 'Terreno', commercial: 'Comercial',
};

interface Props {
    properties: PaginatedProperties;
    filters: { search?: string; type?: string; operation?: string; status?: string };
}

export default function PropertiesIndex({ properties, filters }: Props) {
    const { flash, auth } = usePage().props as any;
    const isAdmin = auth?.user?.role === 'admin';

    const [search,    setSearch]    = useState(filters.search    ?? '');
    const [type,      setType]      = useState(filters.type      ?? '');
    const [operation, setOperation] = useState(filters.operation ?? '');
    const [status,    setStatus]    = useState(filters.status    ?? '');

    const mappedProperties: PropertyData[] = mapProperties(properties.data);

    function applyFilters(overrides = {}) {
        router.get(
            route('properties.index'),
            { search, type, operation, status, ...overrides },
            { preserveState: true, replace: true }
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Propiedades" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold font-headline text-secondary">
                            Gestión de Propiedades
                        </h1>
                        <p className="text-sm text-on-surface-variant opacity-70">
                            {properties.total} propiedad{properties.total !== 1 ? 'es' : ''} registradas
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Solo admin ve el acceso a vendedores */}
                        {isAdmin && (
                            <Link
                                href={route('admin.users.index')}
                                className="inline-flex items-center justify-center gap-2 border border-secondary text-secondary hover:bg-secondary/10 font-bold px-5 py-2.5 rounded-lg transition-all"
                            >
                                <span className="material-symbols-outlined text-[20px]">group</span>
                                Vendedores
                            </Link>
                        )}
                        <Link
                            href={route('properties.create')}
                            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-6 py-2.5 rounded-lg transition-all shadow-sm active:scale-95"
                        >
                            <span className="material-symbols-outlined text-[20px]">add_circle</span>
                            Nueva propiedad
                        </Link>
                    </div>
                </div>

                {/* Flash */}
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-5 py-3 text-sm font-medium flex items-center gap-3 shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        {flash.success}
                    </div>
                )}

                {/* Filtros */}
                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-sidebar-border/70 p-4 flex flex-wrap gap-4 shadow-sm sticky top-0 z-10">
                    <div className="flex-1 min-w-[240px] relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-neutral-400 text-[18px]">search</span>
                        <input
                            type="text"
                            placeholder="Buscar propiedad..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && applyFilters()}
                            className="w-full bg-neutral-50 dark:bg-neutral-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    <select
                        value={type}
                        onChange={e => { setType(e.target.value); applyFilters({ type: e.target.value }); }}
                        className="bg-neutral-50 dark:bg-neutral-800 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 min-w-[140px]"
                    >
                        <option value="">Todos los tipos</option>
                        {Object.entries(TYPE_LABELS).map(([v, l]) => (
                            <option key={v} value={v}>{l}</option>
                        ))}
                    </select>

                    <button
                        onClick={() => applyFilters()}
                        className="bg-secondary text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-secondary/90 transition-colors"
                    >
                        Filtrar
                    </button>
                </div>

                {/* Grid */}
                {mappedProperties.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-300">
                        <span className="material-symbols-outlined text-6xl text-neutral-300 mb-4">location_off</span>
                        <p className="font-headline text-xl text-neutral-400 font-bold">No se encontraron propiedades</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {mappedProperties.map(property => (
                            <PropertyCard
                                key={property.id}
                                property={property}
                                visible={true}
                                //isAdmin={isAdmin}
                            />
                        ))}
                    </div>
                )}

                {/* Paginación */}
                {properties.last_page > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-auto border-t border-neutral-100">
                        <p className="text-sm text-neutral-500">
                            Mostrando{' '}
                            <span className="font-bold text-secondary">{properties.from}–{properties.to}</span>{' '}
                            de{' '}
                            <span className="font-bold text-secondary">{properties.total}</span> propiedades
                        </p>
                        <div className="flex flex-wrap gap-1 justify-center">
                            {properties.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url ?? '#'}
                                    preserveState
                                    className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                                        link.active
                                            ? 'bg-primary text-white shadow-md'
                                            : link.url
                                                ? 'bg-white dark:bg-neutral-900 text-secondary hover:bg-neutral-100 border border-neutral-200'
                                                : 'text-neutral-300 cursor-not-allowed border border-neutral-100'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
