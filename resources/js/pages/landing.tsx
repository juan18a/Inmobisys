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
    filters = {},
}: {
    properties: PaginatedProperties;
    filters?: { search?: string };
}) {
    return (
        <>
            <Head title="Landing" />
            <header>
                <Navbar />
            </header>

            <Hero />

            {properties && (
                // routeName="home" hace que Gallery y su SearchNav
                // busquen dentro del landing (/) sin salir a /properties
                <PropertyGallery
                    properties={properties}
                    filters={filters}
                    routeName="home"
                />
            )}

            <SignatureSection />

            <ChatWidget />
            <Footer />

            <CookieBanner />
        </>
    );
}