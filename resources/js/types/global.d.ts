declare global {
    var route: ((
        name?: import('ziggy-js').RouteName,
        params?: import('ziggy-js').RouteParams<import('ziggy-js').RouteName>,
        absolute?: boolean,
        config?: import('ziggy-js').Config,
    ) => string) & {
        current: (
            name?: import('ziggy-js').RouteName,
            params?: import('ziggy-js').RouteParams<import('ziggy-js').RouteName>,
            config?: import('ziggy-js').Config
        ) => boolean;
    };
}

declare module '@inertiajs/core' {
    interface PageProps extends Record<string, unknown> {
        name: string;
        auth: import('@/types/auth').Auth;
        sidebarOpen: boolean;
        flash: {
            success: string | null;
            error: string | null;
        };
    }
}

export {};
