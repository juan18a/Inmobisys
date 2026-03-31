import { useState } from 'react';
import { router } from '@inertiajs/react';
import PropertyCard from '../../components/custom/PropertyCard';
import SearchNav from '../../components/custom/SearchNav';
import { mapProperties } from '../../components/custom/utils/propertyMapper';

import type {
    PropertyData,
    PropertyCategory,
    FilterOption,
    PaginatedProperties,
} from '../../types';

const FILTER_OPTIONS: FilterOption[] = [
    { label: 'ALL', value: 'all' },
    { label: 'POOL', value: 'pool' },
    { label: 'GYM', value: 'gym' },
    { label: 'OCEAN VIEW', value: 'ocean-view' },
];

interface Props {
    properties: PaginatedProperties;
    filters?: {
        search?: string;
        type?: string;
        operation?: string;
        status?: string;
    };
    routeName?: string;
}

export default function PropertyGallery({ properties, filters = {}, routeName }: Props) {
    const [activeFilter, setActiveFilter] = useState<PropertyCategory>('all');
    const [loading, setLoading] = useState(false);

    const mappedProperties: PropertyData[] = mapProperties(properties.data);

    const isVisible = (category: string) =>
        activeFilter === 'all' || category === activeFilter;

    const handleLoadMore = () => {
        if (properties.current_page >= properties.last_page || loading) return;

        setLoading(true);

        const url = routeName ? route(routeName) : window.location.pathname;

        router.get(
            url,
            { ...filters, page: properties.current_page + 1 },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['properties'],
                merge: true,
                onFinish: () => setLoading(false),
            }
        );
    };

    const allLoaded = properties.current_page >= properties.last_page;

    return (
        <section className="py-24 px-10 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                {/* Título + contador */}
                <div>
                    <span className="font-label text-secondary tracking-[0.2em] uppercase text-xs font-bold">
                        The Collection
                    </span>
                    <h2 className="font-headline text-4xl font-bold mt-4">Signature Residences</h2>
                    <p className="text-sm text-on-surface-variant mt-1 opacity-60">
                        {properties.total} propiedad{properties.total !== 1 ? 'es' : ''}
                    </p>
                </div>

                {/* Controles: buscador + filtros de categoría */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
                    {/* SearchNav solo activo en la Gallery pública (/properties),
                        no en el landing (donde no hay routeName) */}
                    {/*   {routeName && (
                        <SearchNav
                            routeName={routeName}
                            initialValue={filters.search ?? ''}
                            placeholder="Search properties..."
                        /> 


                        
                    )} */}

                    {/* Filtros de categoría (client-side) */}
                    <div className="flex gap-3 flex-wrap">
                        {FILTER_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setActiveFilter(opt.value)}
                                className={`px-6 py-2 rounded-full font-label text-xs font-bold transition-colors ${activeFilter === opt.value
                                    ? 'bg-secondary text-on-primary'
                                    : 'bg-secondary-container text-secondary hover:bg-surface-container-highest'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid de propiedades */}
            {mappedProperties.length === 0 ? (
                <div className="text-center py-32 text-on-surface-variant opacity-50">
                    <span className="material-symbols-outlined text-6xl mb-4 block">search_off</span>
                    <p className="font-headline text-xl">No hay propiedades disponibles</p>
                    <p className="text-sm mt-2">
                        {filters.search
                            ? `Sin resultados para "${filters.search}". Intenta con otro término.`
                            : 'Ajusta los filtros o agrega nuevas propiedades.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mappedProperties.map((property, i) => (
                        <PropertyCard
                            key={property.id ?? `${property.title}-${i}`}
                            property={property}
                            visible={isVisible(property.category)}
                        />
                    ))}
                </div>
            )}

            {/* Paginación / Load more */}
            {!allLoaded ? (
                <div className="mt-20 flex justify-center">
                    <button
                        onClick={handleLoadMore}
                        disabled={loading}
                        className={`group flex items-center gap-3 bg-white border border-secondary text-secondary px-12 py-5 rounded-full font-headline font-bold hover:bg-secondary hover:text-on-primary transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {loading ? 'Loading...' : 'Show More Properties'}
                        {!loading && (
                            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">
                                add
                            </span>
                        )}
                    </button>
                </div>
            ) : (
                <div className="mt-20 flex justify-center">
                    <div className="flex items-center gap-3 opacity-50 cursor-not-allowed bg-white border border-secondary text-secondary px-12 py-5 rounded-full font-headline font-bold">
                        All Properties Loaded
                        <span className="material-symbols-outlined">check</span>
                    </div>
                </div>
            )}
        </section>
    );
}