import { useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';

interface SearchNavProps {
    /** Ruta a la que se envía la búsqueda. Por defecto: properties.index */
    routeName?: string;
    /** Valor inicial (para rellenar desde los filtros del servidor) */
    initialValue?: string;
    /** Placeholder del input */
    placeholder?: string;
}

export default function SearchNav({
    routeName = 'properties.index',
    initialValue = '',
    placeholder = 'Search architecture...',
}: SearchNavProps) {
    const [value, setValue] = useState(initialValue);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Dispara la búsqueda con debounce de 350 ms para no saturar requests
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            router.get(
                route(routeName),
                // Si el campo está vacío mandamos undefined para limpiar el param de la URL
                { search: value || undefined },
                {
                    preserveState: true,
                    replace: true,
                    only: ['properties', 'filters'],
                }
            );
        }, 350);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [value]);

    return (
        <div className="flex items-center bg-surface-container-low rounded-full px-4 py-1.5 gap-2 border border-outline-variant/10">
            <span className="material-symbols-outlined text-secondary text-sm">search</span>
            <input
                className="bg-transparent border-none focus:ring-0 text-sm font-label w-48 text-on-surface outline-none"
                placeholder={placeholder}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            {/* Botón de limpieza — aparece solo cuando hay texto */}
            {value && (
                <button
                    onClick={() => setValue('')}
                    className="text-secondary/50 hover:text-secondary transition-colors"
                    aria-label="Limpiar búsqueda"
                >
                    <span className="material-symbols-outlined text-sm">close</span>
                </button>
            )}
        </div>
    );
}