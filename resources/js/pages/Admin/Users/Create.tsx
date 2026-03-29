import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard',      href: route('dashboard') },
    { title: 'Vendedores',     href: route('admin.users.index') },
    { title: 'Nuevo vendedor', href: route('admin.users.create') },
];

export default function UsersCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('admin.users.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo Vendedor" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold font-headline text-secondary">Nuevo Vendedor</h1>
                    <p className="text-sm text-on-surface-variant opacity-70">
                        La cuenta se crea verificada. El vendedor puede crear y editar propiedades, pero no eliminarlas.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="max-w-lg bg-white dark:bg-neutral-900 rounded-xl border border-sidebar-border/70 shadow-sm p-6 space-y-5"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre completo</Label>
                        <Input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            required
                            autoFocus
                            placeholder="Juan Pérez"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            required
                            placeholder="vendedor@inmobiliaria.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <PasswordInput
                            id="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            required
                            placeholder="Mínimo 8 caracteres"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirmar contraseña</Label>
                        <PasswordInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={e => setData('password_confirmation', e.target.value)}
                            required
                            placeholder="Repite la contraseña"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <div className="flex items-center gap-4 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                        <Button type="submit" disabled={processing} className="gap-2">
                            {processing && <Spinner />}
                            Crear vendedor
                        </Button>
                        <a
                            href={route('admin.users.index')}
                            className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                        >
                            Cancelar
                        </a>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
