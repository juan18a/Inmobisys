const FOOTER_LINKS = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Settings', href: '#' },
    { label: 'Global Offices', href: '#' },
];


export default function Footer() {



    return (
        <footer className="bg-slate-100 dark:bg-slate-900 w-full pt-20 pb-10 px-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 max-w-7xl mx-auto font-inter text-sm tracking-wide text-blue-900 dark:text-blue-100">
                {/* Brand */}
                <div className="flex flex-col items-center md:items-start gap-4">
                    <span className="text-lg font-black text-blue-900 dark:text-blue-50">
                        Ethereal Estate
                    </span>
                    <p className="opacity-80">© 2024 Ethereal Estate. The Architectural Lens.</p>
                </div>

                {/* Links */}
                <div className="flex flex-wrap justify-center gap-8">
                    {FOOTER_LINKS.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-blue-800/70 hover:text-blue-900 hover:underline decoration-2 underline-offset-4 transition-opacity opacity-80 hover:opacity-100"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Icons */}
                <div className="flex gap-4">
                    <span className="material-symbols-outlined text-xl cursor-pointer hover:scale-110 transition-transform">
                        language
                    </span>
                    <span className="material-symbols-outlined text-xl cursor-pointer hover:scale-110 transition-transform">
                        share
                    </span>
                </div>
            </div>
        </footer>
    );
}