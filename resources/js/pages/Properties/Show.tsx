import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const TYPE_LABELS = {
    house: 'Casa', apartment: 'Apartamento', office: 'Oficina',
    land: 'Terreno', commercial: 'Comercial',
};
const STATUS_COLORS = {
    available: 'bg-emerald-100 text-emerald-800',
    sold:      'bg-slate-100 text-slate-700',
    rented:    'bg-blue-100 text-blue-700',
    reserved:  'bg-amber-100 text-amber-700',
};
const STATUS_LABELS = {
    available: 'Disponible', sold: 'Vendido', rented: 'Rentado', reserved: 'Reservado',
};

export default function PropertyShow({ property }) {
    const { auth } = usePage().props as any;
    const [activeImg, setActiveImg] = useState(property.cover_image_url ?? property.images?.[0]?.url);

    const isLogged = !! auth?.user;
    const isAdmin  = auth?.user?.role === 'admin';

    // ── NUEVO: seller solo puede editar sus propias propiedades ───────────────
    const canEdit   = isAdmin || (isLogged && auth.user?.id === property.user_id);
    const canDelete = isAdmin;

    function handleDelete() {
        if (! confirm('¿Eliminar esta propiedad? Esta acción no se puede deshacer.')) return;
        router.delete(route('properties.destroy', property.slug ?? property.id));
    }

    return (
        <>
            <Head title={property.title} />
            <div className="min-h-screen bg-gray-50">

                {/* Topbar */}
                <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div>
                        <nav className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                            <Link href={route('properties.index')} className="hover:text-indigo-600">
                                Propiedades
                            </Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium line-clamp-1">{property.title}</span>
                        </nav>
                        <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        {isLogged ? (
                            <>
                                {/* Editar: admin o dueño de la propiedad */}
                                {canEdit && (
                                    <Link
                                        href={route('properties.edit', property.slug ?? property.id)}
                                        className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                                    >
                                        Editar
                                    </Link>
                                )}

                                {/* Eliminar: solo admin */}
                                {canDelete && (
                                    <button
                                        onClick={handleDelete}
                                        className="inline-flex items-center gap-1.5 border border-red-300 text-red-600 hover:bg-red-50 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                                    >
                                        Eliminar
                                    </button>
                                )}
                            </>
                        ) : (
                            <Link
                                href={route('login')}
                                className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                            >
                                Iniciar sesión
                            </Link>
                        )}
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Imágenes */}
                    <div className="lg:col-span-2 space-y-3">
                        <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                            {activeImg ? (
                                <img src={activeImg} alt={property.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    Sin imagen
                                </div>
                            )}
                        </div>

                        {property.images?.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {property.images.map(img => (
                                    <button
                                        key={img.id}
                                        onClick={() => setActiveImg(img.url)}
                                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                                            activeImg === img.url ? 'border-indigo-500' : 'border-transparent'
                                        }`}
                                    >
                                        <img src={img.url} className="w-full h-full object-cover" alt="" />
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <h2 className="font-semibold text-gray-900 mb-2">Descripción</h2>
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                {property.description}
                            </p>
                        </div>

                        {property.features?.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h2 className="font-semibold text-gray-900 mb-3">Amenidades</h2>
                                <div className="flex flex-wrap gap-2">
                                    {property.features.map(f => (
                                        <span key={f} className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-full font-medium">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[property.status]}`}>
                                    {STATUS_LABELS[property.status]}
                                </span>
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                                    {TYPE_LABELS[property.type]}
                                </span>
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                                    {property.operation === 'sale' ? 'Venta' : 'Renta'}
                                </span>
                            </div>

                            <p className="text-3xl font-bold text-indigo-600">{property.formatted_price}</p>

                            <div className="text-sm text-gray-600 flex items-start gap-1.5">
                                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                {property.address}, {property.city}{property.state ? `, ${property.state}` : ''}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <h2 className="font-semibold text-gray-900 mb-3 text-sm">Detalles</h2>
                            <div className="grid grid-cols-2 gap-y-3 text-sm">
                                <Stat label="Recámaras"        value={property.bedrooms      ?? '—'} />
                                <Stat label="Baños"            value={property.bathrooms     ?? '—'} />
                                <Stat label="Estacionamiento"  value={property.parking_spots ?? '—'} />
                                <Stat label="Área total"       value={property.area_total    ? `${property.area_total} m²`  : '—'} />
                                <Stat label="Área construida"  value={property.area_built    ? `${property.area_built} m²`  : '—'} />
                                <Stat label="Año"              value={property.year_built    ?? '—'} />
                            </div>
                        </div>

                        <p className="text-xs text-gray-400 text-center">
                            Publicada el {property.created_at}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

function Stat({ label, value }: { label: string; value: string | number }) {
    return (
        <div>
            <p className="text-xs text-gray-400">{label}</p>
            <p className="font-semibold text-gray-800">{value}</p>
        </div>
    );
}
