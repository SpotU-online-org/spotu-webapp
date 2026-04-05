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
- Pioneros (primeros 100 users por `user_number`): gratis ilimitado
- 1ra publicación no-pionero: 30 días gratis con tarjeta requerida (trial Stripe), auto-cobro al vencer
- Publicaciones pausadas: sin cobro hasta activación manual

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
- **Email:** Resend — pendiente de implementar
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
│   │   └── confirm/          # "Revisa tu correo"
│   ├── dashboard/            # Panel del usuario (listings, billing, stats)
│   │   ├── page.tsx          # Server component, fetch listings
│   │   ├── DashboardListings.tsx  # Client — tabla con billing
│   │   └── BillingActions.tsx     # Client — botones por listing
│   ├── feed/                 # Feed público (filtros tipo + país dinámico)
│   ├── listing/[id]/         # Detalle + ViewTracker + botones contacto + FavoriteButton
│   ├── publish/              # Form multi-paso + toggle activa/pausa
│   ├── profile/[id]/         # Perfil público
│   ├── profile/edit/         # Editar perfil propio (avatar, datos)
│   ├── privacy/              # Política de privacidad (ES)
│   ├── terms/                # Términos de uso (ES)
│   └── api/stripe/
│       ├── checkout/route.ts # POST — crea Checkout Session con lógica completa
│       └── webhook/route.ts  # Stripe events handler
├── components/
│   ├── ui/                   # button.tsx, link-button.tsx, toast.tsx
│   ├── layout/               # Header, Footer, SpotULogo, AnimatedGrid,
│   │                         #   LanguageToggle, Providers, RevealOnScroll
│   └── listings/             # ListingCard, FavoriteButton
├── lib/
│   ├── supabase/             # client.ts, server.ts, middleware.ts
│   ├── stripe.ts             # getStripe(), STRIPE_PRICES, helpers precio
│   └── utils.ts              # cn()
├── types/                    # Profile, Listing, ClosedInteraction
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
└── 008_user_number.sql                 # ✅ ejecutada
```

## Auth
- Registro: multi-rol con checkboxes, `primaryRole = roles[0]`, se guarda en `options.data.role` / cookie `spotu_pending_role`
- `types[]` cookie `spotu_pending_types` para múltiples roles
- Callback `/auth/callback`: exchange code → UPDATE profiles SET type, types, setup_completed
- Protección en proxy.ts: `/dashboard`, `/publish`, `/settings`, `/profile/edit` requieren sesión
- Google OAuth: configurado en Supabase Dashboard

## Billing — Columnas en listings
```sql
billing_status  TEXT  -- 'trial'|'active'|'past_due'|'paused'|'cancelled'|'pioneer'
trial_ends_at   TIMESTAMPTZ
paid_until      TIMESTAMPTZ
stripe_checkout_session_id TEXT
is_boosted      BOOLEAN
boost_ends_at   TIMESTAMPTZ
```
```sql
-- En profiles:
stripe_customer_id TEXT
user_number        INTEGER  -- ≤ 100 = usuario pionero (gratis)
```

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
