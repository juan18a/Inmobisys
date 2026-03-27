import React, { ReactNode } from "react";
import { InertiaLink } from "@inertiajs/react"; // si usas Inertia
// import { Link } from "react-router-dom"; // si usas React Router

interface Props {
    href: string;
    children: ReactNode;
    className?: string;
    target?: "_blank" | "_self";
}

export const AppLink: React.FC<Props> = ({
    href,
    children,
    className = "",
    target = "_self",
}) => {
    return (
        <InertiaLink
            href={href}
            target={target}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-300 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
        >
            {children}
        </InertiaLink>
    );
};