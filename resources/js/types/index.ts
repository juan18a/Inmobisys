export type * from './auth';
export type * from './navigation';
export type * from './ui';

export interface Slide {
    src: string;
    alt: string;
}

// ─── Property ────────────────────────────────────────────────────────────────

export type PropertyCategory = 'pool' | 'gym' | 'ocean-view' | 'all';
export type PropertyType = 'house' | 'apartment' | 'office' | 'land' | 'commercial';
export type PropertyOperation = 'sale' | 'rent';
export type PropertyStatus = 'available' | 'sold' | 'rented' | 'reserved';

export interface PropertyImage {
    id: number;
    url: string;
    is_cover: boolean;
}

export interface PropertyData {
    // Campos del backend
    id?: number;
    slug?: string;
    description?: string;
    type?: PropertyType;
    operation?: PropertyOperation;
    price?: number | string;
    formatted_price?: string;
    currency?: string;
    address?: string;
    state?: string;
    country?: string;
    zip_code?: string;
    bedrooms?: number;
    bathrooms?: number;
    parking_spots?: number;
    area_total?: number | null;
    area_built?: number | null;
    year_built?: number | null;
    features?: string[];
    status?: PropertyStatus;
    is_featured?: boolean;
    cover_image_url?: string | null;
    images?: PropertyImage[];
    created_at?: string;

    // Campos originales del frontend
    title: string;
    location: string;
    price_label?: string;
    beds: number;
    baths: number;
    sqft: string;
    img: string;
    category: Exclude<PropertyCategory, 'all'>;
    imageHeight?: string;
}

export interface FilterOption {
    label: string;
    value: PropertyCategory;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedProperties {
    data: PropertyData[];
    total: number;
    current_page: number;
    from: number;
    to: number;
    last_page: number;
    links: PaginationLink[];
}

// ─── Chat ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
}

export interface NavLink {
    label: string;
    href: string;
    active?: boolean;
}

export interface Feature {
    label: string;
}