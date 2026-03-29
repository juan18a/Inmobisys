import { Head, useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { request } from '@/routes/password';

// ── Tipos de la API global de Turnstile (inyectada por el script de CF) ───────
declare global {
    interface Window {
        turnstile?: {
            render: (
                el: HTMLElement,
                opts: {
                    sitekey: string;
                    theme?: 'light' | 'dark' | 'auto';
                    callback?: (token: string) => void;
                    'expired-callback'?: () => void;
                    'error-callback'?: () => void;
                }
            ) => string;
            reset: (id: string) => void;
            remove: (id: string) => void;
        };
        onTurnstileLoad?: () => void;
    }
}

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;        // siempre false — registro deshabilitado
    turnstileSiteKey: string;
};

export default function Login({ status, canResetPassword, turnstileSiteKey }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetId     = useRef<string | null>(null);

    // Usamos useForm (no el componente <Form>) para poder manejar
    // el token de Turnstile como campo controlado en data.
    const { data, setData, post, processing, errors, reset } = useForm<{
        email: string;
        password: string;
        remember: boolean;
        'cf-turnstile-response': string;
    }>({
        email: '',
        password: '',
        remember: false,
        'cf-turnstile-response': '',
    });

    // ── Montar el widget de Turnstile ─────────────────────────────────────────
    useEffect(() => {
        function renderWidget() {
            if (! containerRef.current || ! window.turnstile) return;

            widgetId.current = window.turnstile.render(containerRef.current, {
                sitekey: turnstileSiteKey,
                theme: 'light',
                callback: (token: string) => {
                    setData('cf-turnstile-response', token);
                },
                'expired-callback': () => {
                    setData('cf-turnstile-response', '');
                },
                'error-callback': () => {
                    setData('cf-turnstile-response', '');
                },
            });
        }

        // Si Turnstile ya cargó (navegación SPA de regreso al login), renderizar directo
        if (window.turnstile) {
            renderWidget();
        } else {
            window.onTurnstileLoad = renderWidget;

            if (! document.getElementById('cf-turnstile-script')) {
                const script     = document.createElement('script');
                script.id        = 'cf-turnstile-script';
                script.src       = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit';
                script.async     = true;
                script.defer     = true;
                document.head.appendChild(script);
            }
        }

        return () => {
            if (widgetId.current && window.turnstile) {
                window.turnstile.remove(widgetId.current);
                widgetId.current = null;
            }
        };
    }, []);

    // ── Submit ────────────────────────────────────────────────────────────────
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => {
                reset('password');
                // Reset del widget si falla el login
                if (widgetId.current && window.turnstile) {
                    window.turnstile.reset(widgetId.current);
                    setData('cf-turnstile-response', '');
                }
            },
        });
    }

    return (
        <AuthLayout
            title="Iniciar sesión"
            description="Ingresa tus credenciales para acceder al panel"
        >
            <Head title="Iniciar sesión" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-6">

                    {/* Email */}
                    <div className="grid gap-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            placeholder="correo@ejemplo.com"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} />
                    </div>

                    {/* Contraseña */}
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Contraseña</Label>
                            {canResetPassword && (
                                <TextLink
                                    href={request()}
                                    className="ml-auto text-sm"
                                    tabIndex={5}
                                >
                                    ¿Olvidaste tu contraseña?
                                </TextLink>
                            )}
                        </div>
                        <PasswordInput
                            id="password"
                            name="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            placeholder="Contraseña"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} />
                    </div>

                    {/* Recordarme */}
                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            tabIndex={3}
                            checked={data.remember}
                            onCheckedChange={checked => setData('remember', !! checked)}
                        />
                        <Label htmlFor="remember">Mantener sesión iniciada</Label>
                    </div>

                    {/* ── Cloudflare Turnstile ─────────────────────────────── */}
                    <div>
                        <div ref={containerRef} />
                        <InputError
                            message={errors['cf-turnstile-response']}
                            className="mt-1"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="mt-2 w-full"
                        tabIndex={4}
                        disabled={processing || ! data['cf-turnstile-response']}
                    >
                        {processing && <Spinner />}
                        Iniciar sesión
                    </Button>
                </div>

                {/* Sin enlace de registro — está deshabilitado */}
            </form>

            {status && (
                <div className="mt-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
