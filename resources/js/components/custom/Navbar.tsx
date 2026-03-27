import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import SearchNav from '../custom/SearchNav'

export default function Navbar({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {

    const [menuOpen, setMenuOpen] = useState(false);

    const { auth } = usePage().props;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-0">
            <nav className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-full mt-6 mx-auto max-w-5xl border border-white/20 dark:border-slate-700/30 shadow-2xl shadow-blue-900/10 flex flex-col px-6 py-3 w-full transition-all duration-300"
                style={{ borderRadius: menuOpen ? '1.5rem' : '9999px' }}
            >
                {/* Top row */}
                <div className="flex justify-between items-center w-full">
                    {/* Logo */}
                    <a className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-50 font-headline tracking-tighter shrink-0" href="#">
                        Ethereal Estate
                    </a>



                    {/* Desktop: search + links + actions */}
                    <div className="hidden md:flex items-center gap-6">



                        <SearchNav></SearchNav>



                        {/* Nav links */}
                        <div className="flex items-center gap-6 font-manrope font-semibold tracking-tight">
                            <a className="text-blue-900 dark:text-white border-b-2 border-blue-900 pb-1" href="#">Propiedades</a>
                            <a className="text-blue-800/60 dark:text-slate-400 hover:text-blue-900 transition-all duration-300" href="#">Sobre Nosotros</a>
                            <a className="text-blue-800/60 dark:text-slate-400 hover:text-blue-900 transition-all duration-300" href="#">Contacto</a>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">


                            <Link href={dashboard()} className="bg-secondary text-on-primary px-5 py-2 rounded-full font-headline font-bold text-sm hover:scale-95 active:scale-90 transition-transform">
                                Registro
                            </Link>
                            <Link href={login()} className="material-symbols-outlined text-secondary scale-95 active:scale-90 transition-transform p-2 rounded-full hover:bg-blue-50/50">
                                account_circle
                            </Link>
                        </div>
                    </div>

                    {/* Mobile: account + hamburger */}
                    <div className="flex md:hidden items-center gap-2">
                        <button className="material-symbols-outlined text-secondary p-2 rounded-full hover:bg-blue-50/50 active:scale-90 transition-transform">
                            account_circle
                        </button>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 rounded-full hover:bg-blue-50/50 active:scale-90 transition-transform text-blue-900 dark:text-white"
                            aria-label="Toggle menu"
                        >
                            <span className="material-symbols-outlined text-secondary">
                                {menuOpen ? 'close' : 'menu'}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="flex md:hidden flex-col gap-4 pt-4 pb-2 border-t border-blue-900/10 dark:border-slate-700/30 mt-3">
                        {/* Mobile search */}
                        <div className="flex items-center bg-surface-container-low rounded-full px-4 py-2 gap-2 border border-outline-variant/20">
                            <span className="material-symbols-outlined text-secondary text-sm">search</span>
                            <input
                                className="bg-transparent border-none focus:ring-0 text-sm font-label w-full text-on-surface outline-none"
                                placeholder="Search architecture..."
                                type="text"
                            />
                        </div>

                        {/* Mobile nav links */}
                        <div className="flex flex-col gap-1 font-manrope font-semibold tracking-tight">
                            <a className="text-blue-900 dark:text-white px-2 py-2 rounded-xl hover:bg-blue-50/50 transition-colors" href="#">Properties</a>
                            <a className="text-blue-800/60 dark:text-slate-400 px-2 py-2 rounded-xl hover:bg-blue-50/50 hover:text-blue-900 transition-colors" href="#">About Us</a>
                            <a className="text-blue-800/60 dark:text-slate-400 px-2 py-2 rounded-xl hover:bg-blue-50/50 hover:text-blue-900 transition-colors" href="#">Contact</a>
                        </div>

                        {/* Mobile CTA */}
                        <button className="w-full bg-secondary text-on-primary px-6 py-2.5 rounded-full font-headline font-bold text-sm hover:scale-95 active:scale-90 transition-transform">
                            List Property
                        </button>
                    </div>
                )}
            </nav>
        </header >
    );
}