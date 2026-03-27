// resources/js/pages/Properties/Edit.jsx
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import PropertyForm from '@/components/PropertyForm';


export default function PropertyEdit({ property }) {
    const [existingImages, setExistingImages] = useState(property.images ?? []);

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: property.title,
        description: property.description,
        type: property.type,
        operation: property.operation,
        price: property.price,
        currency: property.currency,
        address: property.address,
        city: property.city,
        state: property.state ?? '',
        country: property.country,
        zip_code: property.zip_code ?? '',
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        parking_spots: property.parking_spots,
        area_total: property.area_total ?? '',
        area_built: property.area_built ?? '',
        year_built: property.year_built ?? '',
        features: property.features ?? [],
        status: property.status,
        is_featured: property.is_featured,
        images: [],
        delete_images: [],
        cover_image_id: null,
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('properties.update', property.slug ?? property.id), {
            forceFormData: true,
        });
    }

    function removeExistingImage(imgId) {
        setExistingImages(prev => prev.filter(i => i.id !== imgId));
        setData('delete_images', [...(data.delete_images ?? []), imgId]);
    }

    function setCover(imgId) {
        setData('cover_image_id', imgId);
        setExistingImages(prev => prev.map(i => ({ ...i, is_cover: i.id === imgId })));
    }

    return (
        <>
            <Head title={`Editar · ${property.title}`} />
            <div className="min-h-screen bg-gray-50">
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <nav className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                        <a href={route('properties.index')} className="hover:text-indigo-600">Propiedades</a>
                        <span>/</span>
                        <span className="text-gray-900 font-medium line-clamp-1">{property.title}</span>
                        <span>/</span>
                        <span className="text-gray-900">Editar</span>
                    </nav>
                    <h1 className="text-2xl font-bold text-gray-900">Editar propiedad</h1>
                </div>

                <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
                    {/* Existing images manager */}
                    {existingImages.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-base font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                                Imágenes actuales
                            </h2>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                {existingImages.map(img => (
                                    <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                                        <img src={img.url} alt="" className="w-full h-full object-cover" />

                                        {/* Cover badge */}
                                        {img.is_cover && (
                                            <span className="absolute bottom-1 left-1 text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded font-semibold">
                                                Portada
                                            </span>
                                        )}

                                        {/* Overlay actions */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            {!img.is_cover && (
                                                <button
                                                    type="button"
                                                    title="Usar como portada"
                                                    onClick={() => setCover(img.id)}
                                                    className="bg-white text-indigo-700 rounded-full p-1.5 hover:bg-indigo-50 transition"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                                                    </svg>
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                title="Eliminar imagen"
                                                onClick={() => removeExistingImage(img.id)}
                                                className="bg-white text-red-600 rounded-full p-1.5 hover:bg-red-50 transition"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 mt-3">Pasa el cursor sobre una imagen para opciones. Las eliminaciones se aplican al guardar.</p>
                        </div>
                    )}

                    <PropertyForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        onSubmit={handleSubmit}
                        processing={processing}
                        isEdit
                    />
                </div>
            </div>
        </>
    );
}
