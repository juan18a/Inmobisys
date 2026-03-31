Aquí tienes el contenido completo del **README.md** actualizado con las capturas de pantalla integradas y la nota sobre Laravel Herd en la sección de uso:

````markdown
# 🏢 Inmobisys

Sistema de gestión inmobiliaria desarrollado en Laravel que permite a los vendedores publicar propiedades en venta, con chat integrado vía N8N, envío de correos con Resend y protección anti-bots mediante Cloudflare Turnstile.

---
<img width="1280" height="720" alt="5" src="https://github.com/user-attachments/assets/d0c19463-bc15-4512-80be-88cb1e2dfad5" />
<img width="1280" height="720" alt="4" src="https://github.com/user-attachments/assets/3811d28c-a7d7-4a21-8877-6557769c2182" />
<img width="1280" height="720" alt="3" src="https://github.com/user-attachments/assets/897a7625-ec0b-4b73-ab69-edd0fb5ba6f3" />
<img width="1280" height="720" alt="2" src="https://github.com/user-attachments/assets/ee4f94df-a20a-4ab2-8e96-5fc9b47c2af7" />
<img width="1280" height="720" alt="1" src="https://github.com/user-attachments/assets/314f8dd5-3641-4b51-8507-cd088addb448" />



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


en el .env
ADMIN_EMAIL=tucorrreo
ADMIN_PASSWORD=tuclave


#php artisan db:seed --class=AdminSeeder
#php artisan db:seed --class=PropertySeeder

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

Este proyecto es de código abierto y está disponible bajo la [Licencia GPL-3.0](https://www.google.com/search?q=LICENSE).

-----

**Autor:** [Juan Díaz](https://github.com/juan18a)

```
```
