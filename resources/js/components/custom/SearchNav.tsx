import { useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';

interface SearchNavProps {
    routeName?: string;
    initialValue?: string;
    placeholder?: string;
}

export default function SearchNav({
    routeName = 'properties.index',
    initialValue = '',
    placeholder = 'Search architecture...',
}: SearchNavProps) {
    const [value, setValue] = useState(initialValue);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Evita que el efecto dispare en el montaje inicial aunque value esté vacío.
    // Sin esto, al montar el componente en el landing se haría router.get()
    // a properties.index causando la redirección.
    const isMounted = useRef(false);

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            router.get(
                route(routeName),
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