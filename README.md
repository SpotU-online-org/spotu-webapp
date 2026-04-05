# SpotU — Tu spot publicitario ideal

Marketplace de 3 lados que conecta **anunciantes**, **espacios publicitarios** (físicos y digitales) y **agencias de marketing**.

**Dominio:** `spotu.online` · **Correo:** `admin@spotu.online` · **Deploy:** Vercel (producción activa)

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 16, React 19, TypeScript strict |
| Styling | TailwindCSS 4 + shadcn/ui (base-nova / @base-ui/react) |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| Pagos | Stripe (live) |
| Email | Resend |
| Deploy | Vercel |
| Package manager | pnpm |
| IA (Fase 2) | Claude API (búsqueda semántica) |

## Comandos

```bash
pnpm install      # instalar dependencias
pnpm dev          # servidor de desarrollo
pnpm build        # build de producción
pnpm lint         # lint
```

## Variables de entorno (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_LISTING_MONTHLY=
STRIPE_PRICE_LISTING_BOOST=
STRIPE_PRICE_AGENCY_MONTHLY=
STRIPE_PRICE_AGENCY_BOOST=
```

## Migraciones Supabase

Ejecutar en orden en **Supabase Dashboard → SQL Editor**:

| Archivo | Estado |
|---------|--------|
| `001_initial_schema.sql` | ✅ ejecutada |
| `002_closed_interactions.sql` | ✅ ejecutada |
| `003_multi_role_setup.sql` | ✅ ejecutada |
| `004_increment_contacts_avatars.sql` | ✅ ejecutada |
| `005_favorites_audience_fields.sql` | ✅ ejecutada |
| `006_location_countries.sql` | ✅ ejecutada |
| `007_billing.sql` | ✅ ejecutada |
| `008_user_number.sql` | ✅ ejecutada |

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx                  # Landing (HomeClient.tsx)
│   ├── layout.tsx                # Root layout (Providers)
│   ├── auth/                     # login, register, callback, confirm
│   ├── dashboard/                # Panel usuario (listings, billing, stats)
│   ├── feed/                     # Feed público con filtros
│   ├── listing/[id]/             # Detalle + ViewTracker + contacto
│   ├── publish/                  # Form multi-paso por tipo de usuario
│   ├── profile/[id]/             # Perfil público
│   ├── profile/edit/             # Editar perfil propio
│   ├── privacy/                  # Política de privacidad
│   └── terms/                    # Términos de uso
│   └── api/stripe/
│       ├── checkout/             # POST → crea Checkout Session
│       └── webhook/              # Stripe events handler
├── components/
│   ├── ui/                       # button, link-button, toast
│   ├── layout/                   # Header, Footer, SpotULogo, AnimatedGrid,
│   │                             #   LanguageToggle, Providers, RevealOnScroll
│   └── listings/                 # ListingCard, FavoriteButton
├── lib/
│   ├── supabase/                 # client.ts, server.ts, middleware.ts
│   ├── stripe.ts                 # getStripe(), STRIPE_PRICES, helpers de precio
│   └── utils.ts                  # cn()
├── types/                        # Profile, Listing, ClosedInteraction
└── constants/                    # USER_ROLES, SPACE_CATEGORIES, ALL_COUNTRIES…
```

## Configuración Supabase (producción)

- **Site URL:** `https://spotu.online`
- **Redirect URLs:** `https://spotu.online/auth/callback`
- **Storage bucket:** `listing-images` (público)
- **Google OAuth:** habilitado

## Configuración Stripe (live)

- **4 precios creados:** listing_monthly ($4.99), listing_boost ($2.99), agency_monthly ($9.99), agency_boost ($4.99)
- **Webhook endpoint:** `https://spotu.online/api/stripe/webhook`
- **Eventos escuchados:** `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.deleted`
- **API version:** `2026-03-25.dahlia`

## Monetización

| Tipo de usuario | Suscripción | Boost |
|---|---|---|
| Espacios / Anunciantes | $4.99 USD/mes | $2.99 USD/sem |
| Agencias | $9.99 USD/mes | $4.99 USD/sem |
| Pioneros (primeros 100) | Gratis ilimitado | — |

- 1ra publicación: 30 días gratis, tarjeta requerida para auto-cobro
- Publicaciones pausadas: sin cobro hasta activación
- Renovación automática mensual por suscripción

## Progreso

### ✅ Completado

- Setup (Next.js 16, TailwindCSS 4, shadcn/ui, TypeScript strict)
- Branding: Electric Indigo + Coral, logos .webp, tema soft slate
- Landing page editorial con animaciones, i18n ES/EN, scroll reveals
- Autenticación: registro multi-rol, login, Google OAuth, email confirm
- Protección de rutas (proxy.ts)
- Feed público con filtros (tipo, país dinámico)
- CRUD publicaciones: form multi-paso, múltiples países (hasta 10), imágenes
- Toggle activa/pausa al publicar
- Dashboard: listado de publicaciones, stats (vistas + contactos), billing
- Detalle de publicación: ViewTracker, contacto WhatsApp/email, favoritos
- Perfil público (`/profile/[id]`) y edición propia
- Favoritos (tabla con RLS, botón toggle)
- Stripe live: checkout, suscripciones, boosts, webhooks, lógica pionero/trial/prorrateo
- Billing dashboard: BillingActions por publicación (estado, precio correcto por tipo)
- Páginas legales: `/privacy` y `/terms` en español
- Deploy en Vercel + dominio `spotu.online`

### 🚧 Pendiente (Fase 2)

- [ ] Búsqueda semántica con IA (Claude API)
- [ ] Notificaciones por email (Resend) — bienvenida, contacto recibido, trial por vencer
- [ ] Contratos digitales con firma simple
- [ ] Portal de facturación Stripe (ver/cancelar suscripciones desde el dashboard)
- [ ] Analytics básico (gráficas de vistas/contactos en el tiempo)
- [ ] Interacciones cerradas (migración 002 lista)

## Autor

**Cesar Emilio Castaño Marin** — Fundador de SpotU
