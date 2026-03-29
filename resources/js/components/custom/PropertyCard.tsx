import { Link, router, usePage } from '@inertiajs/react';
import type { PropertyData } from '../../types';

interface PropertyCardProps {
    property: PropertyData;
    visible: boolean;
}

export default function PropertyCard({ property, visible }: PropertyCardProps) {
    // Obtenemos el usuario del estado compartido de Inertia
    const { auth } = usePage().props as any;
    const isAdmin = auth?.user.role === 'admin';

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('¿Estás seguro de que deseas eliminar esta propiedad? Esta acción no se puede deshacer.')) {
            router.delete(route('properties.destroy', property.slug ?? property.id), {
                preserveScroll: true,
            });
        }
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            className="group relative bg-surface-container-lowest rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 property-item flex flex-col h-full border border-outline-variant/5 shadow-sm hover:shadow-xl"
            style={{
                display: visible ? 'flex' : 'none',
                opacity: visible ? 1 : 0,
                transform: visible ? 'scale(1)' : 'scale(0.95)',
            }}
        >
            <div
                className="relative overflow-hidden w-full"
                style={{ height: property.imageHeight ?? '22rem' }}
            >
                <img
                    src={property.img}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Botón de precio flotante */}
                <div className="absolute top-4 left-4 glass-effect bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 shadow-lg">
                    <span className="font-headline font-bold text-secondary text-sm">{property.price}</span>
                </div>

                {/* Acciones de administración (solo visibles si estás logueado) */}
                {isAdmin && (


                    <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <Link
                            href={route('properties.edit', property.slug ?? property.id)}
                            onClick={handleEdit}
                            className="bg-white/90 p-2.5 rounded-full shadow-lg hover:bg-white text-blue-600 transition-all hover:scale-110 flex items-center justify-center border border-blue-100"
                            title="Editar propiedad"
                        >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="bg-white/90 p-2.5 rounded-full shadow-lg hover:bg-white text-red-600 transition-all hover:scale-110 flex items-center justify-center border border-red-100"
                            title="Eliminar propiedad"
                        >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="p-7 flex flex-col flex-1 bg-white">
                <Link
                    href={route('properties.show', property.slug ?? property.id)}
                    className="block group-hover:text-primary transition-colors"
                >
                    <h3 className="font-headline text-xl font-bold text-secondary line-clamp-1 leading-tight mb-2">
                        {property.title}
                    </h3>
                </Link>

                <p className="text-sm text-on-surface-variant/70 line-clamp-1 mb-6 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] opacity-60">location_on</span>
                    {property.location}
                </p>

                <div className="flex justify-between items-center mt-auto pt-6 border-t border-outline-variant/10">
                    <div className="flex gap-4">
                        <span className="font-label text-[10px] tracking-[0.15em] text-secondary/60 font-bold uppercase flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px]">bed</span>
                            {property.beds}
                        </span>
                        <span className="font-label text-[10px] tracking-[0.15em] text-secondary/60 font-bold uppercase flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px]">bathtub</span>
                            {property.baths}
                        </span>
                        <span className="font-label text-[10px] tracking-[0.15em] text-secondary/60 font-bold uppercase flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px]">square_foot</span>
                            {property.sqft}
                        </span>
                    </div>

                    <Link
                        href={route('properties.show', property.slug ?? property.id)}
                        className="text-secondary hover:text-primary transition-all hover:translate-x-1"
                    >
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}