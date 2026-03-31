import { useState, useEffect, useCallback } from 'react';

const slides = [
    {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2crcsESJGs8Q0lkGl2-Kw2O8rgKtvboPnxCeuRv9CMLdzyRiQ4CE3hPfFi__H9D3QZlNta_FvwEHTNBm6BbZK-LEUUQg31Fl2YnMl-RplaBwhvlUAa0zMna6zs02Y2o92qmfG_ae62BSTutix_d4SWgontJWUkC4vhZm9UbMjbORQLVXa1mKSX2ruwNhaz8FgC8joMem94Uzn8MsP4GtyZRchfIC8e-Cnt2q7FjvIuKtBUXWZ8LfuoSLete-TnEPSD73EnhEAdA0',
        alt: 'Modern architectural villa',
    },
    {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDc6WOi1bTzJlv97vK1aT8EoiP0374MMLbz1ecSeitwXQOb3Oi_Z5CD2ibv8NpC9ts-s3JW8Vto_PCDCKwRn9GThMHPDpXr2QtoB7ZZVPfF67zsrKAm8FOye6uDYkxK_3hf7RpbvMIWDV68E01uDzjsqNmwjgSTw0clK5kt1df2OJ0UJfigcDd2QtvoU3p0bOfZoA_Y90dgfFO0D_r9kzdler8SBzAepfSOu7PzuQGPZRQx9utKuwcOHvcpCCY65f8SxVtPQ9AmM6A',
        alt: 'Brutalist concrete masterpiece',
    },
    {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmsbr507l00yoBQVwK8TYeQ8AwUoao5Yi4X2UpIoxQ7DV9yOuMB99JHmGdOBI4oULqiLdlS9Hbgs0qdWauzl8NcXGrHvb0yOoxkmub0_wYBaY9OodHDyZ3224vHbdcNhRW89Hgi4ZQdCAZghtw4LuKzqW3_weUhq4hV_-eNE2edAzkbExqOTLbOjA8NK3gp3PHzhxuPnZ8m89dZZXJAGR4NrKu4qxvVKtttXL5p1vQ3yGXrDdIoE4-jpoeHvkHcHTIC6WgUs1f1uk',
        alt: 'Minimalist glass residence',
    },
];

//comentario 2

export default function HeroSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [kenBurnsKey, setKenBurnsKey] = useState(0);

    const showSlide = useCallback((index: number) => {
        setCurrentIndex((index + slides.length) % slides.length);
        setKenBurnsKey((k) => k + 1);
    }, []);

    const nextSlide = useCallback(() => showSlide(currentIndex + 1), [currentIndex, showSlide]);
    const prevSlide = useCallback(() => showSlide(currentIndex - 1), [currentIndex, showSlide]);

    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [nextSlide]);

    return (
        <section className="relative h-[921px] w-full overflow-hidden bg-primary">
            {/* Slides */}
            <div className="absolute inset-0 z-0">
                {slides.map((slide, i) => (
                    <div
                        key={i}
                        className={`absolute inset-0 transition-opacity duration-1000 ${i === currentIndex ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <img
                            src={slide.src}
                            alt={slide.alt}
                            key={i === currentIndex ? kenBurnsKey : undefined}
                            className={`w-full h-full object-cover opacity-90 ${i === currentIndex ? 'animate-ken-burns' : ''
                                }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-transparent" />
                    </div>
                ))}
            </div>

            {/* Hero Content */}
            <div className="relative z-10 h-full flex flex-col justify-center px-10 md:px-24 max-w-7xl mx-auto">
                <h1 className="font-headline text-5xl md:text-8xl font-extrabold text-on-secondary leading-tight tracking-tighter max-w-4xl">
                    Defining the
                    <br />
                    Boundless Space.
                </h1>
                <p className="font-body text-xl text-on-secondary/80 mt-6 max-w-xl leading-relaxed">
                    A curated collection of architectural masterpieces designed for those who seek the
                    extraordinary. Experience the intersection of light and steel.
                </p>

                <div className="mt-12 flex items-center gap-6">
                    <button className="bg-secondary text-on-primary px-10 py-4 rounded-xl font-headline font-bold text-lg hover:scale-95 transition-all">
                        Explore Portfolio
                    </button>

                    {/* Dots */}
                    <div className="flex gap-2">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                aria-label={`Slide ${i + 1}`}
                                onClick={() => showSlide(i)}
                                className={`w-12 h-1 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-on-secondary' : 'bg-on-secondary/30'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute bottom-12 right-12 z-20 flex gap-4">
                <button
                    onClick={prevSlide}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/20 hover:bg-primary/40 backdrop-blur-md text-on-secondary border border-primary/30 transition-all"
                >
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                    onClick={nextSlide}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/20 hover:bg-primary/40 backdrop-blur-md text-on-secondary border border-primary/30 transition-all"
                >
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>
        </section>
    );
}