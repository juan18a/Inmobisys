import { useState, useEffect } from 'react';

const COOKIE_KEY = 'cookie_consent';

type ConsentValue = 'accepted' | 'rejected' | null;

export default function CookieBanner() {
    const [consent, setConsent] = useState<ConsentValue | 'loading'>('loading');

    useEffect(() => {
        const stored = localStorage.getItem(COOKIE_KEY) as ConsentValue;
        setConsent(stored ?? null);
    }, []);

    if (consent === 'loading' || consent !== null) return null;

    function accept() {
        localStorage.setItem(COOKIE_KEY, 'accepted');
        setConsent('accepted');
    }

    function reject() {
        localStorage.setItem(COOKIE_KEY, 'rejected');
        setConsent('rejected');
    }

    return (
        <div
            role="dialog"
            aria-label="Aviso de cookies"
            className="fixed bottom-0 left-0 right-0 z-40"
        >
            {/* Sombra difusa pegada */}
            <div className="h-6 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />

            {/* Banner */}
            <div className="bg-white border-t border-neutral-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">

                        {/* Texto */}
                        <div className="flex items-start sm:items-center gap-2.5 flex-1 min-w-0">
                            <span className="material-symbols-outlined text-secondary text-[18px]">
                                cookie
                            </span>

                            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                                Usamos cookies propias para el funcionamiento del sitio.{' '}
                                <a
                                    href="/privacidad"
                                    className="text-secondary underline underline-offset-2 hover:text-secondary/80"
                                >
                                    Política de privacidad
                                </a>
                            </p>
                        </div>

                        {/* Botones */}
                        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 w-full sm:w-auto">
                            <button
                                onClick={reject}
                                className="flex-1 sm:flex-none px-4 py-2 text-xs sm:text-sm text-neutral-500 hover:text-neutral-800 border border-neutral-200 hover:border-neutral-400 rounded-full"
                            >
                                Rechazar
                            </button>

                            <button
                                onClick={accept}
                                className="flex-1 sm:flex-none px-5 py-2 text-xs sm:text-sm font-semibold bg-secondary text-white rounded-full hover:bg-secondary/90"
                            >
                                Aceptar
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}