import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import Navbar from '@/components/custom/Navbar';
import Hero from '@/components/custom/Hero';
//import PropertyGrid from '@/components/custom/PropertyGrid';
import SignatureSection from '@/components/custom/SignatureSection';
import Footer from '@/components/custom/Footer';
import ChatWidget from '@/components/custom/ChatWidget';
import PropertyGallery from '@/pages/Properties/Gallery';
import type { PaginatedProperties } from '@/types';



export default function Landing({
    canRegister = true,
    properties,
}: {
    canRegister?: boolean;
    properties: PaginatedProperties;
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Landing" />
            <header>
                <Navbar />
            </header>

            <Hero />

            {/* Galería de propiedades */}
            {properties && (
                <PropertyGallery properties={properties} />
            )}

            <SignatureSection />



            <ChatWidget />
            <Footer />
        </>
    );
}