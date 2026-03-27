// resources/js/components/PropertyForm.jsx
import { useRef, useState } from 'react';

const FEATURES_LIST = [
    'Alberca', 'Jardín', 'Terraza', 'Gimnasio', 'Seguridad 24h',
    'Elevador', 'Bodega', 'Cuarto de servicio', 'Roof garden',
    'Vista al mar', 'Amueblado', 'Gas natural', 'Paneles solares',
];

export default function PropertyForm({ data, setData, errors, onSubmit, processing, isEdit = false }) {
    const fileInputRef    = useRef(null);
    const [previews, setPreviews] = useState([]);

    function handleImageChange(e) {
        const files = Array.from(e.target.files);
        setData('images', files);

        const newPreviews = files.map(f => ({
            url:  URL.createObjectURL(f),
            name: f.name,
        }));
        setPreviews(newPreviews);
    }

    function toggleFeature(feature) {
        const current = data.features ?? [];
        setData(
            'features',
            current.includes(feature)
                ? current.filter(f => f !== feature)
                : [...current, feature]
        );
    }

    return (
        <form onSubmit={onSubmit} encType="multipart/form-data" className="space-y-8">

            {/* ── Basic info ──────────────────────────────────────────────── */}
            <Section title="Información básica">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Título *" error={errors.title} className="md:col-span-2">
                        <input
                            type="text"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            placeholder="Ej. Casa en Lomas con jardín y alberca"
                            className={inputCls(errors.title)}
                        />
                    </Field>

                    <Field label="Tipo de propiedad *" error={errors.type}>
                        <select value={data.type} onChange={e => setData('type', e.target.value)} className={inputCls(errors.type)}>
                            <option value="house">Casa</option>
                            <option value="apartment">Apartamento</option>
                            <option value="office">Oficina</option>
                            <option value="land">Terreno</option>
                            <option value="commercial">Comercial</option>
                        </select>
                    </Field>

                    <Field label="Operación *" error={errors.operation}>
                        <select value={data.operation} onChange={e => setData('operation', e.target.value)} className={inputCls(errors.operation)}>
                            <option value="sale">Venta</option>
                            <option value="rent">Renta</option>
                        </select>
                    </Field>

                    <Field label="Precio *" error={errors.price}>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={data.price}
                            onChange={e => setData('price', e.target.value)}
                            placeholder="0.00"
                            className={inputCls(errors.price)}
                        />
                    </Field>

                    <Field label="Moneda" error={errors.currency}>
                        <select value={data.currency} onChange={e => setData('currency', e.target.value)} className={inputCls(errors.currency)}>
                            <option value="USD">USD – Dólares</option>
                            <option value="MXN">MXN – Pesos mexicanos</option>
                            <option value="EUR">EUR – Euros</option>
                        </select>
                    </Field>

                    <Field label="Estado de la propiedad" error={errors.status}>
                        <select value={data.status} onChange={e => setData('status', e.target.value)} className={inputCls(errors.status)}>
                            <option value="available">Disponible</option>
                            <option value="reserved">Reservada</option>
                            <option value="sold">Vendida</option>
                            <option value="rented">Rentada</option>
                        </select>
                    </Field>

                    <Field label="Descripción *" error={errors.description} className="md:col-span-2">
                        <textarea
                            rows={4}
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            placeholder="Describe la propiedad con detalle..."
                            className={inputCls(errors.description)}
                        />
                    </Field>

                    <div className="md:col-span-2 flex items-center gap-3">
                        <input
                            id="is_featured"
                            type="checkbox"
                            checked={data.is_featured}
                            onChange={e => setData('is_featured', e.target.checked)}
                            className="w-4 h-4 text-indigo-600 rounded"
                        />
                        <label htmlFor="is_featured" className="text-sm text-gray-700 font-medium">
                            Marcar como propiedad destacada
                        </label>
                    </div>
                </div>
            </Section>

            {/* ── Location ────────────────────────────────────────────────── */}
            <Section title="Ubicación">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Dirección *" error={errors.address} className="md:col-span-2">
                        <input
                            type="text"
                            value={data.address}
                            onChange={e => setData('address', e.target.value)}
                            placeholder="Calle, número, colonia"
                            className={inputCls(errors.address)}
                        />
                    </Field>
                    <Field label="Ciudad *" error={errors.city}>
                        <input type="text" value={data.city} onChange={e => setData('city', e.target.value)} className={inputCls(errors.city)} />
                    </Field>
                    <Field label="Estado / Provincia" error={errors.state}>
                        <input type="text" value={data.state} onChange={e => setData('state', e.target.value)} className={inputCls(errors.state)} />
                    </Field>
                    <Field label="País" error={errors.country}>
                        <input type="text" value={data.country} onChange={e => setData('country', e.target.value)} className={inputCls(errors.country)} />
                    </Field>
                    <Field label="Código postal" error={errors.zip_code}>
                        <input type="text" value={data.zip_code} onChange={e => setData('zip_code', e.target.value)} className={inputCls(errors.zip_code)} />
                    </Field>
                </div>
            </Section>

            {/* ── Details ─────────────────────────────────────────────────── */}
            <Section title="Características">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <Field label="Recámaras" error={errors.bedrooms}>
                        <input type="number" min="0" value={data.bedrooms} onChange={e => setData('bedrooms', e.target.value)} className={inputCls(errors.bedrooms)} />
                    </Field>
                    <Field label="Baños" error={errors.bathrooms}>
                        <input type="number" min="0" value={data.bathrooms} onChange={e => setData('bathrooms', e.target.value)} className={inputCls(errors.bathrooms)} />
                    </Field>
                    <Field label="Cajones de parking" error={errors.parking_spots}>
                        <input type="number" min="0" value={data.parking_spots} onChange={e => setData('parking_spots', e.target.value)} className={inputCls(errors.parking_spots)} />
                    </Field>
                    <Field label="Año de construcción" error={errors.year_built}>
                        <input type="number" min="1800" value={data.year_built} onChange={e => setData('year_built', e.target.value)} className={inputCls(errors.year_built)} />
                    </Field>
                    <Field label="Área total (m²)" error={errors.area_total}>
                        <input type="number" min="0" step="0.01" value={data.area_total} onChange={e => setData('area_total', e.target.value)} className={inputCls(errors.area_total)} />
                    </Field>
                    <Field label="Área construida (m²)" error={errors.area_built}>
                        <input type="number" min="0" step="0.01" value={data.area_built} onChange={e => setData('area_built', e.target.value)} className={inputCls(errors.area_built)} />
                    </Field>
                </div>

                {/* Features checkboxes */}
                <div className="mt-5">
                    <p className="text-sm font-medium text-gray-700 mb-2">Amenidades</p>
                    <div className="flex flex-wrap gap-2">
                        {FEATURES_LIST.map(feature => {
                            const active = (data.features ?? []).includes(feature);
                            return (
                                <button
                                    type="button"
                                    key={feature}
                                    onClick={() => toggleFeature(feature)}
                                    className={`text-sm px-3 py-1.5 rounded-full border font-medium transition-colors ${
                                        active
                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                            : 'text-gray-600 border-gray-300 hover:border-indigo-400'
                                    }`}
                                >
                                    {feature}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </Section>

            {/* ── Images ──────────────────────────────────────────────────── */}
            <Section title="Imágenes">
                <div
                    onClick={() => fileInputRef.current.click()}
                    className="border-2 border-dashed border-gray-300 hover:border-indigo-400 rounded-xl p-8 text-center cursor-pointer transition-colors"
                >
                    <svg className="w-10 h-10 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-600">Haz clic para seleccionar imágenes</p>
                    <p className="text-xs text-gray-400 mt-1">JPEG, PNG o WebP · Máx. 5 MB por imagen · Hasta 20 imágenes</p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </div>
                {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}

                {previews.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {previews.map((p, i) => (
                            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                                <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                                {i === 0 && (
                                    <span className="absolute bottom-1 left-1 text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded font-semibold">
                                        Portada
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </Section>

            {/* ── Submit ──────────────────────────────────────────────────── */}
            <div className="flex items-center justify-end gap-3 pt-2">
                <a href={route('properties.index')} className="text-sm text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    Cancelar
                </a>
                <button
                    type="submit"
                    disabled={processing}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
                >
                    {processing ? 'Guardando...' : (isEdit ? 'Actualizar propiedad' : 'Crear propiedad')}
                </button>
            </div>
        </form>
    );
}

// ── Small helpers ────────────────────────────────────────────────────────────

function Section({ title, children }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">{title}</h2>
            {children}
        </div>
    );
}

function Field({ label, error, children, className = '' }) {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <label className="text-sm font-medium text-gray-700">{label}</label>
            {children}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

function inputCls(error) {
    return `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
        error ? 'border-red-400 bg-red-50' : 'border-gray-300'
    }`;
}
