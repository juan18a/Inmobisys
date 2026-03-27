import type { PropertyData, PropertyCategory } from '../../../types';

const TYPE_TO_CATEGORY: Record<string, Exclude<PropertyCategory, 'all'>> = {
    house: 'pool',
    apartment: 'gym',
    office: 'gym',
    land: 'ocean-view',
    commercial: 'ocean-view',
};

const PLACEHOLDER_IMG =
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800';

export function mapProperty(raw: PropertyData): PropertyData {
    return {
        ...raw,
        title: raw.title,
        location: raw.state
            ? `${raw.address?.split(',')[0] ?? raw.title}, ${raw.state}`
            : (raw.address?.split(',')[0] ?? raw.title),
        price: (raw.formatted_price ?? String(raw.price ?? '')),
        beds: raw.bedrooms ?? 0,
        baths: raw.bathrooms ?? 0,
        sqft: raw.area_built
            ? Number(raw.area_built).toLocaleString()
            : (raw.area_total ? Number(raw.area_total).toLocaleString() : '—'),
        img: raw.cover_image_url ?? raw.images?.[0]?.url ?? PLACEHOLDER_IMG,
        category: TYPE_TO_CATEGORY[raw.type ?? 'house'] ?? 'pool',
    };
}

export function mapProperties(raws: PropertyData[]): PropertyData[] {
    return raws.map(mapProperty);
}