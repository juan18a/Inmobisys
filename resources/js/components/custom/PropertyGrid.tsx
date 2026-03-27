import type { PropertyData } from '../../types';

interface PropertyCardProps {
    property: PropertyData;
    visible: boolean;
}

export default function PropertyCard({ property, visible }: PropertyCardProps) {
    return (
        <div
            className="group relative bg-surface-container-lowest rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 property-item"
            style={{
                display: visible ? 'block' : 'none',
                opacity: visible ? 1 : 0,
                transform: visible ? 'scale(1)' : 'scale(0.95)',
            }}
        >
            <div
                className={`relative overflow-hidden`}
                style={{ height: property.imageHeight ?? '24rem' }}
            >
                <img
                    src={property.img}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 glass-effect bg-white/70 px-4 py-2 rounded-full">
                    <span className="font-headline font-bold text-secondary">{property.price}</span>
                </div>
            </div>
            <div className="p-8">
                <h3 className="font-headline text-xl font-bold text-secondary">{property.title}</h3>
                <p className="text-sm text-on-surface-variant mt-2">{property.location}</p>
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-outline-variant/10">
                    <span className="font-label text-[10px] tracking-widest text-secondary font-bold">
                        {property.beds} BEDS • {property.baths} BATHS • {property.sqft} SQFT
                    </span>
                    <span className="material-symbols-outlined text-secondary">arrow_outward</span>
                </div>
            </div>
        </div>
    );
}
