const FEATURES = [
    'Exclusively Architect-Vetted Listings',
    'Concierge Investment Strategy',
    'Global High-Net-Worth Network',
];


export default function SignatureSection() {
    return (
        <section className="bg-surface-container-low py-32 px-10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20 items-center">
                {/* Image Side */}
                <div className="w-full md:w-1/2 relative">
                    <div className="aspect-square bg-primary-container rounded-3xl overflow-hidden relative">
                        <img
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvUTGXXVsXrbJcV_3sSjxWu-rT9l5N3WooMm_-YBeEPF8MEsRtW65FxO449rPzNMUcmevH0PlarPgLH8faQ5P7ZH9jgZw96Equ-JTVVnUXpd1C2B258fGWaKkknHAOoVszPpPDYwohylhin8Y_NGT51n3hnJ3coYLacigBMGy0Pc3tUamm1rJNuH0hZzxieHOO07R9uRW2iBm88DfqJ0Y_3dxAkoBGa_VdhYgiiV-ODYAsJlTpDuAF67nrVAY3iQ4HvlLYLat6-0A"
                            alt="High-end real estate office interior"
                        />
                        <div className="absolute inset-0 bg-secondary/10" />
                    </div>

                    {/* Floating Badge */}
                    <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white p-8 rounded-3xl shadow-xl flex flex-col justify-center border border-outline-variant/5">
                        <span className="text-5xl font-headline font-black text-secondary">24+</span>
                        <p className="text-sm font-label tracking-widest mt-2 uppercase">
                            Years of Architectural Excellence
                        </p>
                    </div>
                </div>

                {/* Text Side */}
                <div className="w-full md:w-1/2 space-y-8">
                    <span className="font-label text-secondary tracking-[0.2em] uppercase text-xs font-bold">
                        Why Ethereal
                    </span>
                    <h2 className="font-headline text-5xl font-bold leading-tight">
                        We curate spaces that inspire.
                    </h2>
                    <p className="text-on-surface-variant leading-relaxed text-lg">
                        Beyond transactions, we focus on the cultural and architectural significance of every
                        listing. Our "Architectural Lens" ensures that every home we represent is a testament to
                        quality, design, and vision.
                    </p>

                    <ul className="space-y-4">
                        {FEATURES.map((feature) => (
                            <li key={feature} className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-secondary">check_circle</span>
                                <span className="font-headline font-semibold">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}