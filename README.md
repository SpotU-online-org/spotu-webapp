# SpotU — Tu spot publicitario ideal

Marketplace de publicidad que conecta **anunciantes**, **espacios publicitarios** (físicos y digitales) y **agencias de marketing** en una sola plataforma.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | TailwindCSS 4 + shadcn/ui |
| Backend | Supabase (PostgreSQL, Auth, Storage, Edge Functions) |
| IA (V1) | Claude API (búsqueda semántica) |
| Pagos | Stripe |
| Email | Resend |
| Deploy | Vercel |
| Package manager | pnpm |

## Inicio rápido

```bash
# Instalar dependencias
pnpm install

# Servidor de desarrollo
pnpm dev

# Build de producción
pnpm build

# Lint
pnpm lint
```

## Estructura del proyecto

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Autenticación
│   ├── (dashboard)/        # Panel de usuario
│   └── (public)/           # Páginas públicas
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── forms/              # Formularios
│   ├── layout/             # Header, Footer, Logo
│   └── listings/           # Cards, detalles, filtros
├── lib/
│   ├── supabase/           # Cliente y helpers
│   ├── utils/              # Utilidades (cn)
│   └── validations/        # Schemas Zod
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript types
└── constants/              # Constantes y config
```

## Mercados objetivo

Colombia, norte de México (Monterrey, Chihuahua) y Florida (USA).

## Progreso

### ✅ Completado
- Setup del proyecto (Next.js 16, TailwindCSS 4, shadcn/ui)
- Branding: colores (Electric Indigo + Coral), tipografía (Inter), logos webp
- Landing page con animaciones, i18n ES/EN, scroll reveals
- Supabase: cliente browser/server, middleware de sesiones
- DB schema: profiles, listings, views, contacts, favorites (migración 001 ejecutada)
- DB schema: closed_interactions (migración 002 lista para ejecutar)
- RLS policies en todas las tablas + storage bucket
- TypeScript types: Profile, Listing, ClosedInteraction
- **Autenticación:** registro 2 pasos (selección de rol + form), login, Google OAuth, callback, email confirm
- Protección de rutas en proxy.ts
- **CRUD publicaciones:** formulario multi-paso por tipo (espacio/agencia/anunciante), feed, detalle, dashboard
- Stats básicas: contador de vistas (ViewTracker), contactos por click

### 🚧 Pendiente
- [ ] Perfil de usuario (editar info, foto)
- [ ] Edición de publicaciones
- [ ] Subida de imágenes a Supabase Storage
- [ ] Búsqueda con filtros (ciudad, precio, tipo)
- [ ] Favoritos
- [ ] Notificaciones por email (Resend)
- [ ] Pagos (Stripe)
- [ ] Búsqueda con IA (Claude API) — Fase 2
- [ ] Contratos digitales — Fase 2

### ⚙️ Configuración pendiente (para que funcione en prod)

Ver la sección de Setup más abajo.

## Setup

### Variables de entorno (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Supabase — checklist de configuración

1. **Migraciones SQL** — ejecutar en el SQL Editor del Dashboard:
   - `supabase/migrations/001_initial_schema.sql` ✅ (ya ejecutada)
   - `supabase/migrations/002_closed_interactions.sql` ⬜ (pendiente)

2. **Google OAuth:**
   - Dashboard → Authentication → Providers → Google → Enable
   - Crear OAuth App en [Google Cloud Console](https://console.cloud.google.com)
   - Redirect URI: `https://<tu-proyecto>.supabase.co/auth/v1/callback`
   - Copiar Client ID y Secret a Supabase

3. **URL Configuration** (Authentication → URL Configuration):
   - Site URL: `http://localhost:3000` (dev) / tu dominio (prod)
   - Redirect URLs: `http://localhost:3000/auth/callback`

4. **Storage bucket** `listing-images`:
   - Dashboard → Storage → New bucket → `listing-images` → Public
   - Policy: usuarios autenticados pueden subir; todos pueden leer

5. **Email templates** (Authentication → Email Templates):
   - Personalizar con branding SpotU (opcional para MVP)

## Estructura del proyecto (actualizada)

```
src/
├── app/
│   ├── page.tsx              # Landing
│   ├── auth/                 # Login, register, callback, confirm
│   ├── dashboard/            # Panel del usuario
│   ├── feed/                 # Feed de publicaciones
│   ├── listing/[id]/         # Detalle de publicación
│   └── publish/              # Crear publicación
├── components/
│   ├── ui/                   # Button, LinkButton
│   ├── layout/               # Header, Footer, Logo, AnimatedGrid, Providers
│   └── listings/             # ListingCard
├── lib/supabase/             # client.ts, server.ts, middleware.ts
├── types/                    # Profile, Listing, ClosedInteraction
└── constants/                # Roles, categorías, servicios
supabase/migrations/
├── 001_initial_schema.sql    # ✅ ejecutada
└── 002_closed_interactions.sql  # ⬜ pendiente
```

## Autor

**Cesar Emilio Castaño Marin** — Fundador de SpotU
