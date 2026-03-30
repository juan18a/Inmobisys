import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, Home, UsersRound } from 'lucide-react';
import AppLogo from '@/components/app-logo';
//import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

/*
const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];
*/

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const isAdmin = auth?.user?.role === 'admin';

    // Los items base que todos los usuarios autenticados ven
    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Propiedades',
            href: route('properties.index'),
            icon: Home,
        },
        // Solo el admin ve el enlace de Usuarios
        ...(isAdmin ? [{
            title: 'Vendedores',
            href: route('admin.users.index'),
            icon: UsersRound,
        }] : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>


            <SidebarFooter>
                {/*
                <NavFooter items={footerNavItems} className="mt-auto" />
                 */}
                <NavUser />
            </SidebarFooter>

        </Sidebar>
    );
}
