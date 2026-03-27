// resources/js/pages/Properties/Create.jsx
import { Head, useForm } from '@inertiajs/react';
import PropertyForm from '@/components/PropertyForm';



export default function PropertyCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        type: 'house',
        operation: 'sale',
        price: '',
        currency: 'USD',
        address: '',
        city: '',
        state: '',
        country: 'MX',
        zip_code: '',
        bedrooms: 0,
        bathrooms: 0,
        parking_spots: 0,
        area_total: '',
        area_built: '',
        year_built: '',
        features: [],
        status: 'available',
        is_featured: false,
        images: [],
        cover_index: 0,
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('properties.store'), {
            forceFormData: true, // Necesario para enviar archivos
        });
    }

    return (
        <>
            <Head title="Nueva propiedad" />
            <div className="min-h-screen bg-gray-50">
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <nav className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                        <a href={route('properties.index')} className="hover:text-indigo-600 transition-colors">Propiedades</a>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">Nueva propiedad</span>
                    </nav>
                    <h1 className="text-2xl font-bold text-gray-900">Nueva propiedad</h1>
                </div>

                <div className="max-w-4xl mx-auto px-6 py-8">
                    <PropertyForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        onSubmit={handleSubmit}
                        processing={processing}
                    />
                </div>
            </div>
        </>
    );
}
