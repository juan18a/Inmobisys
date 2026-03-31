Aquí tienes el contenido completo del **README.md** actualizado con las capturas de pantalla integradas y la nota sobre Laravel Herd en la sección de uso:

````markdown
# 🏢 Inmobisys

Sistema de gestión inmobiliaria desarrollado en Laravel que permite a los vendedores publicar propiedades en venta, con chat integrado vía N8N, envío de correos con Resend y protección anti-bots mediante Cloudflare Turnstile.

## 🏢 Tabla de Contenidos

<img width="1280" height="720" alt="5" src="https://github.com/user-attachments/assets/5a4f8805-cd06-4fc7-9096-43746cdd594b" />
<img width="1280" height="720" alt="4" src="https://github.com/user-attachments/assets/a3c512f9-5544-4ff9-bce4-ae18f8a7add0" />
<img width="1280" height="720" alt="3" src="https://github.com/user-attachments/assets/57315a0f-0dd2-4c38-964f-b9ac767979f6" />
<img width="1280" height="720" alt="2" src="https://github.com/user-attachments/assets/ed8a1a74-fa56-4cda-98be-2077df2d54d5" />
<img width="1280" height="720" alt="1" src="https://github.com/user-attachments/assets/bc67ad32-3bda-46b2-b5b1-d7950c0c75af" />


---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Demo](#-demo)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Seeders](#-seeders)
- [Uso](#-uso)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## ✨ Características

- 🏠 **Gestión de Propiedades**: Los vendedores pueden publicar, editar y administrar propiedades en venta.
- 💬 **Chat Integrado**: Sistema de chat conectado con N8N para automatización de respuestas.
- 📧 **Notificaciones por Email**: Envío de correos mediante Resend.
- 🤖 **Protección Anti-Bots**: Implementación de Cloudflare Turnstile en el login.
- 👥 **Sistema de Roles**: Administradores y vendedores con diferentes permisos.

![Interfaz de Chat y Propiedades](2.jpg)
*Asistente virtual y vista de catálogo principal.*

---

## 🌐 Demo

Puedes ver una demostración del proyecto desplegado en:

**URL**: [http://inmobisys-backend-i7zxm6-d44831-144-225-147-37.traefik.me](http://inmobisys-backend-i7zxm6-d44831-144-225-147-37.traefik.me)

**Credenciales de prueba**:
- Email: `admin@tuinmobiliaria.com`
- Contraseña: `CambiaMeAhora2024!`

![Pantalla de Login](1.png)
*Acceso seguro al panel administrativo.*

---

## 📦 Requisitos Previos

Antes de instalar el proyecto, asegúrate de tener instalado:

- **PHP** >= 8.1
- **Composer** >= 2.0
- **Node.js** >= 16.x y **npm** >= 8.x
- **SQLite** (o tu base de datos preferida)
- **Git**

---

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone [https://github.com/juan18a/Inmobisys.git](https://github.com/juan18a/Inmobisys.git)
cd Inmobisys
````

### 2\. Instalar dependencias

```bash
composer install
npm install
```

### 3\. Configuración inicial

```bash
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
```

-----

## 🎯 Uso

### Iniciar el servidor de desarrollo

```bash
php artisan serve
```

El sitio estará disponible en: `http://localhost:8000` (puedes usar **Laravel Herd** para que te ayude con un dominio para su instalación de Laravel; consulte la [documentación de Herd](https://herd.laravel.com)).

*Panel de control de Inmobisys.*

### Gestión y Visualización

El sistema permite una administración fluida de los listados y una visualización detallada para el cliente final.

*Módulo de administración de listados.*

*Vista detallada de una propiedad con sus amenidades.*

-----

## 🛠️ Tecnologías

### Backend

  - **Laravel 11.x**
  - **SQLite**
  - **Resend** (Email)

### Frontend

  - **Blade** & **Vite**
  - **Tailwind CSS**

### Integraciones

  - **N8N** (Workflows y Chat)
  - **Cloudflare Turnstile** (Seguridad)

-----

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](https://www.google.com/search?q=LICENSE).

-----

**Autor:** [Juan Díaz](https://github.com/juan18a)

```
```
