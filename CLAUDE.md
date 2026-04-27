# SpotU — Marketplace de Publicidad

## Contexto
Marketplace de 3 lados (intermediario puro) que conecta:
1. **Anunciantes** ↔ **Espacios publicitarios** (físicos y digitales)
2. **Agencias de marketing** ↔ **Anunciantes**
3. **Agencias de marketing** ↔ **Espacios publicitarios**

**Dinámica:** Espacios y agencias publican (obligatorio). Anunciantes buscan y contactan directo; opcionalmente publican solicitudes de cotización.

**Alcance V1:** publicar, buscar, contactar (WhatsApp/correo directo), búsqueda con IA (Claude API), contratos digitales, interacciones cerradas, stats básicas (vistas + clics en contactar). NO analytics de marketing, NO gestión de campañas, NO mensajería interna.

**Monetización:**
- Espacios / Anunciantes: $4.99 USD/mes por publicación activa, Boost $2.99 USD/semana
- Agencias: $9.99 USD/mes por publicación activa, Boost $4.99 USD/semana
- Pioneros (primeros 250 users por `user_number`, definido en `PIONEER_THRESHOLD` en `src/lib/stripe.ts`): **1 año gratis** desde `profiles.created_at`; al vencer el año se cobran tarifas normales por publicaciones activas
- 1ra publicación no-pionero: 30 días gratis (trial) con tarjeta requerida, auto-cobro al vencer; trial calculado desde `listings.created_at`
- 2da+ publicación no-pionero: cobro inmediato (prorrateado por Stripe)
- Publicaciones pausadas: sin cobro hasta activación manual; trial de 30d corre desde creación, no desde activación
- `spotu.online@gmail.com`: `user_number = 9999` para pruebas (no recibe trato pionero)

Mercados objetivo: Colombia, norte de México (Monterrey, Chihuahua) y Florida (USA).

**Dominio:** `spotu.online` (comprado en Hostinger, 3 años)
**Correo público:** `admin@spotu.online` (mailbox Hostinger)
**Gmail base:** `spotu.online@gmail.com` (cuenta raíz de Supabase/Vercel/GitHub)
**WhatsApp SpotU:** placeholder `+1 000 000 0000` — reemplazar cuando se tenga número real

## Stack
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript strict
- **Styling:** TailwindCSS 4 + shadcn/ui (base-nova, usa `@base-ui/react`)
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **IA:** Claude API (búsqueda semántica, matching) — Fase 2
- **Pagos:** Stripe live (USD), API version `2026-03-25.dahlia`
- **Email:** Resend (`resend` package instalado). Emails implementados: bienvenida (auth callback) + expiración año pionero (cron). Pendiente: trial por vencer, renovación, pionero expirando 7d antes.
- **Deploy:** Vercel (producción activa en spotu.online)
- **Package manager:** pnpm

## Notas técnicas importantes

### shadcn/ui v4 + @base-ui/react
- Button NO soporta `asChild`. Usar `LinkButton` (`src/components/ui/link-button.tsx`) para links con estilo de botón.
- `linkButtonVariants` exportado para usar en Server Components (CVA sin "use client").

### Next.js 16
- `middleware.ts` renombrado a `proxy.ts` con `export function proxy()` (nueva convención).

### i18n
- React Context: `I18nProvider` + `useI18n()` en `src/components/layout/LanguageToggle.tsx`
- Wrapper: `src/components/layout/Providers.tsx` inyecta providers en layout.
- Traducciones ES/EN inline en el mismo archivo.

### Stripe
- Lazy singleton: `getStripe()` en `src/lib/stripe.ts` — nunca instanciar Stripe directamente.
- Helpers de precio: `getMonthlyPriceId(listingType)`, `getBoostPriceId(listingType)` — elegir precio correcto por tipo.
- Webhook en `src/app/api/stripe/webhook/route.ts` — maneja 4 eventos.
- Checkout en `src/app/api/stripe/checkout/route.ts` — lógica pionero / trial / inmediato.

### Interacciones cerradas (closed interactions)
- Migración: `supabase/migrations/002_closed_interactions.sql` ✅ ejecutada
- Flujo: provider solicita → client confirma/rechaza → incrementa `confirmed_interactions_count` en profile
- RLS: confirmadas son públicas, provider crea, client responde
- Expiran en 30 días si no hay respuesta

## Estructura del Proyecto
```
src/
├── app/
│   ├── page.tsx              # Landing (delega a HomeClient.tsx)
│   ├── layout.tsx            # Root layout (Providers wrapper)
│   ├── auth/
│   │   ├── layout.tsx        # Auth layout (minimal, sin Header/Footer)
│   │   ├── register/         # Registro multi-rol con checkboxes
│   │   ├── login/            # Login email + Google
│   │   ├── callback/         # OAuth + email confirm code exchange
│   │   ├── confirm/          # "Revisa tu correo"
│   │   └── setup/            # Selección de rol post-Google OAuth (usuario nuevo sin role en cookie)
│   ├── dashboard/            # Panel del usuario (listings, billing, stats)
│   │   ├── page.tsx               # Server component: profile (types[], user_number, stripe_customer_id)
│   │   ├── DashboardListings.tsx  # Client — tabla con filtros (título, estado, tipo), boost banner
│   │   ├── BillingActions.tsx     # Client — estado billing + botones por listing (precio por tipo)
│   │   ├── ListingActions.tsx     # Client — menú (editar/pausar/activar/borrar), con validación billing
│   │   ├── ListingModal.tsx       # Client — modal detalle de publicación
│   │   ├── PioneerBanner.tsx      # Client — banner + countdown pioneros
│   │   └── PortalButton.tsx       # Client — abre Stripe Customer Portal
│   ├── favorites/            # Publicaciones guardadas (auth-guarded)
│   ├── feed/                 # Feed público (búsqueda keyword + filtros tipo + país)
│   ├── listing/[id]/         # Detalle + ViewTracker + botones contacto + FavoriteButton
│   ├── publish/
│   │   ├── page.tsx               # Server: si multi-rol → PublishTypeSelector, si mono-rol → PublishForm
│   │   ├── PublishTypeSelector.tsx # Client — elige tipo (space_owner/agency/advertiser) con precio
│   │   └── PublishForm.tsx        # Client — form multi-paso + tags + toggle activa/pausa
│   ├── profile/[id]/         # Perfil público
│   ├── profile/edit/         # Editar perfil propio (avatar, datos, país — lista completa ~100)
│   ├── privacy/              # Política de privacidad (ES)
│   ├── terms/                # Términos de uso (ES)
│   ├── not-found.tsx         # Página 404 personalizada
│   └── api/
│       ├── stripe/
│       │   ├── checkout/route.ts # POST — pioneer→skip / boost→one-time / trial / inmediato
│       │   ├── webhook/route.ts  # 4 eventos Stripe
│       │   └── portal/route.ts   # POST — Stripe Customer Portal
│       ├── email/welcome/route.ts # POST — envía correo de bienvenida (usado por /auth/setup)
│       └── cron/expire-pioneers/route.ts # GET — cron diario, pausa pioneros expirados
├── components/
│   ├── ui/                   # button.tsx, link-button.tsx, toast.tsx
│   ├── layout/               # Header, Footer, SpotULogo, AnimatedGrid,
│   │                         #   LanguageToggle, Providers, RevealOnScroll
│   └── listings/             # ListingCard (con avatar autor), FavoriteButton
├── lib/
│   ├── supabase/             # client.ts, server.ts, middleware.ts
│   ├── stripe.ts             # getStripe(), STRIPE_PRICES, helpers precio
│   ├── resend.ts             # getResend() singleton, FROM_EMAIL
│   ├── emails/
│   │   ├── welcome.ts        # HTML correo de bienvenida
│   │   └── pioneer-expired.ts # HTML correo expiración año pionero
│   └── utils.ts              # cn()
├── types/                    # Profile, Listing, ClosedInteraction
├── hooks/                    # Custom React hooks
└── constants/                # USER_ROLES, SPACE_CATEGORIES, AGENCY_SERVICES,
                              #   ALL_COUNTRIES (~100), MARKETS, PRICE_PERIODS
supabase/migrations/
├── 001_initial_schema.sql              # ✅ ejecutada
├── 002_closed_interactions.sql         # ✅ ejecutada
├── 003_multi_role_setup.sql            # ✅ ejecutada
├── 004_increment_contacts_avatars.sql  # ✅ ejecutada
├── 005_favorites_audience_fields.sql   # ✅ ejecutada
├── 006_location_countries.sql          # ✅ ejecutada
├── 007_billing.sql                     # ✅ ejecutada
├── 008_user_number.sql                 # ✅ ejecutada
├── 009_listing_tags.sql                # ✅ ejecutada — tags TEXT[] + GIN index
├── 010_total_listings_created.sql      # ✅ ejecutada — total_listings_created + AFTER INSERT trigger
├── 011_fix_user_numbers.sql            # ✅ ejecutada — renumera user_number eliminando gaps
└── 012_fix_billing_status_constraint.sql # ✅ ejecutada — agrega 'pending_payment' y 'pioneer' al CHECK constraint
```

## Auth
- Registro: multi-rol con checkboxes, `primaryRole = roles[0]`, se guarda en `options.data.role` / cookie `spotu_pending_role`
- `types[]` cookie `spotu_pending_types` para múltiples roles
- Callback `/auth/callback`: exchange code → UPDATE profiles SET type, types, setup_completed → envía welcome email si es usuario nuevo
- Google OAuth nuevo usuario sin role en cookie → redirige a `/auth/setup` → al completar setup envía welcome email vía `/api/email/welcome`
- Protección en proxy.ts: `/dashboard`, `/publish`, `/settings`, `/profile/edit` requieren sesión
- Google OAuth: configurado en Supabase Dashboard + Google Cloud Console (OAuth consent screen verificado en spotu.online)
- Correos transaccionales (confirm, reset password): vía SMTP de Resend configurado en Supabase → Authentication → SMTP Settings

## Billing — Columnas en listings
```sql
billing_status  TEXT  -- 'pending_payment'|'trial'|'active'|'past_due'|'paused'|'cancelled'|'pioneer'
trial_ends_at   TIMESTAMPTZ
paid_until      TIMESTAMPTZ
stripe_checkout_session_id TEXT
is_boosted      BOOLEAN
boost_ends_at   TIMESTAMPTZ
tags            TEXT[]  -- max 5, GIN index para búsqueda por keyword
```
```sql
-- En profiles:
stripe_customer_id       TEXT
user_number              INTEGER  -- ≤ PIONEER_THRESHOLD (250) = usuario pionero (gratis 1 año desde created_at)
total_listings_created   INTEGER  -- contador incremental (nunca decrece), evita re-grant del trial
```

### Lógica anti-fraude del trial
- `total_listings_created` se incrementa con un AFTER INSERT trigger en listings
- Nunca se decrementa (ni al borrar listings)
- El checkout API usa `total_listings_created ≤ 1` para determinar si aplica el trial de 30 días
- Esto evita que el usuario borre su 1ra publicación y vuelva a recibir 30 días gratis

### Flujo de publicación con Stripe
- Todo listing se crea con `status: "paused"` y `billing_status: "pending_payment"`
- Si el usuario elige "Publicar activa" → form redirige inmediatamente a Stripe checkout
- Webhook `checkout.session.completed` activa el listing (`status: "active"`) y setea el billing_status correcto
- Si el usuario elige "Guardar en pausa" → va al dashboard; activa luego desde el menú ⋯

### Flujo billing checkout (`/api/stripe/checkout`)
1. **Pioneer** (`user_number ≤ PIONEER_THRESHOLD` AND `created_at + 365 días > now()`): retorna `{ pioneer: true }`, marca listing con `billing_status: "pioneer"` y `status: "active"`, sin Stripe
2. **Boost** (`mode: "boost"`): one-time payment con `getBoostPriceId(listingType)`
3. **Suscripción, primera vez** (`total_listings_created ≤ 1`): trial_period_days = días restantes de los 30 desde `listing.created_at`, `payment_method_collection: "always"`; webhook detecta trial y setea `billing_status: "trial"` + `trial_ends_at`
4. **Suscripción, 2da+**: cobro inmediato, sin trial; webhook setea `billing_status: "active"` + `paid_until`

### UX de activación en el dashboard
- **Columna Facturación**: solo informativa — muestra estado del billing y botón Boost si aplica. NO tiene botón "Activar"
- **Menú ⋯ (kebab)**: único punto para pausar/activar la visibilidad de la publicación
  - `pioneer`, `active`, `trial` → togglear status directamente (sin Stripe)
  - `pending_payment`, `cancelled`, `paused` (billing) → redirige a Stripe checkout
- Pausar/activar en medio de un mes no afecta la suscripción de Stripe (sigue corriendo)

### Cron jobs (Vercel Cron — `vercel.json`)
- `/api/cron/expire-pioneers` — corre diario a las 6:00 AM UTC. Pausa listings de pioneros con año vencido y envía email.
- Endpoint protegido con `Authorization: Bearer CRON_SECRET` (env var requerida en Vercel y local).
- Pendiente: cron para auto-pausar listings con `billing_status = "trial"` y `trial_ends_at` vencido.

## Convenciones de Código

### General
- TypeScript estricto (`strict: true`)
- Español para contenido de usuario, inglés para código
- Named exports (no default exports excepto pages)
- Actualizar CLAUDE.md y README.md al final de cada sesión con cambios significativos

### Naming
- Componentes: `PascalCase.tsx` | Hooks: `use-kebab-case.ts` | Utils: `kebab-case.ts`
- Types: `PascalCase` | Variables/funciones: `camelCase` | Constantes: `SCREAMING_SNAKE_CASE` | DB columns: `snake_case`

### Componentes
- Props como `type` con sufijo `Props`
- `cn()` para clases condicionales
- Server Components por default

### Supabase
- `createServerClient` en Server Components, `createBrowserClient` en Client
- RLS en TODAS las tablas

### Formularios
- Zod + React Hook Form + Server Actions

### Git
- Commits en inglés, conventional commits (`feat:`, `fix:`, `chore:`, `docs:`)
- Auto-commit después de cada cambio con mensaje descriptivo

## Comandos
- `pnpm dev` / `pnpm build` / `pnpm lint`

## Reglas
- Mobile-first siempre
- No dependencias sin justificación
- No `any` en TypeScript
- Loading, error y empty states en toda página
- Variables de entorno en `.env.local`
- Imágenes con `next/image`
- Cobros en USD, Stripe como método principal

## Design
- Theme: soft slate (bg `oklch(0.965 0.004 264)`) uniforme en todo el sitio — NO oscuro, NO blanco puro
- Header: sticky, `bg-background/80 backdrop-blur-xl`, border sutil, h-18 (72px), logo 224×64px
- Hero: AnimatedGrid con gradient orbs suaves (primary/coral/emerald), dot grid con opacidad baja
- Animaciones: `fade-in-up`, `float`, `float-slow`, `gradient-shift`, hover transitions en cards/icons
- Secciones alternas: `bg-card/60` para contraste sutil entre secciones
- CTA final: gradient `from-primary via-primary to-indigo` con texto blanco
- Colores: Primary (Electric Indigo #4F46E5), Accent (Coral #F97316), Emerald
- Logos: `.webp` en `/public/logos/` (full, horizontal, icon)
- Contrastes: `text-foreground` para títulos, `text-muted-foreground` para descripciones, `text-primary` para acciones
