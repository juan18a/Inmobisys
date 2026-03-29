import Navbar from '@/components/custom/Navbar';
import Hero from '@/components/custom/Hero';
import SignatureSection from '@/components/custom/SignatureSection';
import Footer from '@/components/custom/Footer';
import ChatWidget from '@/components/custom/ChatWidget';
import PropertyGallery from '@/pages/Properties/Gallery';
import CookieBanner from '@/components/custom/CookieBanner';
import type { PaginatedProperties } from '@/types';
import { Head } from '@inertiajs/react';

export default function Landing({
    properties,
}: {
    properties: PaginatedProperties;
}) {
    return (
        <>
            <Head title="Landing" />
            <header>
                <Navbar />
            </header>

            <Hero />

            {properties && (
                <PropertyGallery properties={properties} />
            )}

            <SignatureSection />

            <ChatWidget />
            <Footer />

            {/* Banner de cookies — se renderiza encima de todo */}
            <CookieBanner />
        </>
    );
}
