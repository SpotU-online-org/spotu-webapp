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
RESEND_API_KEY=
CRON_SECRET=          # secreto arbitrario para proteger el endpoint del cron
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
| `009_listing_tags.sql` | ✅ ejecutada |
| `010_total_listings_created.sql` | ✅ ejecutada |
| `011_fix_user_numbers.sql` | ✅ ejecutada |
| `012_fix_billing_status_constraint.sql` | ✅ ejecutada |

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx                  # Landing (HomeClient.tsx)
│   ├── layout.tsx                # Root layout (Providers)
│   ├── not-found.tsx             # Página 404 personalizada
│   ├── auth/                     # login, register, callback, confirm, setup
│   ├── dashboard/                # Panel usuario (listings, billing, stats)
│   │   ├── page.tsx              # Server component: profile + listings
│   │   ├── DashboardListings.tsx # Client — tabla con filtros
│   │   ├── BillingActions.tsx    # Client — estado billing + botones
│   │   ├── ListingActions.tsx    # Client — menú kebab (editar/pausar/activar/borrar)
│   │   ├── ListingModal.tsx      # Client — modal detalle
│   │   ├── PioneerBanner.tsx     # Client — banner pioneros con countdown
│   │   └── PortalButton.tsx      # Client — Stripe Customer Portal
│   ├── favorites/                # Publicaciones guardadas (auth-guarded)
│   ├── feed/                     # Feed público con filtros + búsqueda keyword
│   ├── listing/[id]/             # Detalle + ViewTracker + contacto + favorito
│   ├── publish/                  # Selector de tipo (multi-rol) + form multi-paso
│   ├── profile/[id]/             # Perfil público
│   ├── profile/edit/             # Editar perfil propio
│   ├── privacy/                  # Política de privacidad (ES)
│   ├── terms/                    # Términos de uso (ES)
│   └── api/
│       ├── stripe/
│       │   ├── checkout/         # POST → pioneer / boost / trial / inmediato
│       │   ├── webhook/          # 4 eventos Stripe
│       │   └── portal/           # POST → Stripe Customer Portal
│       ├── email/welcome/        # POST → correo de bienvenida
│       └── cron/expire-pioneers/ # GET → cron diario, pausa pioneros expirados
├── components/
│   ├── ui/                       # button, link-button, toast
│   ├── layout/                   # Header, Footer, SpotULogo, AnimatedGrid,
│   │                             #   LanguageToggle, Providers, RevealOnScroll
│   └── listings/                 # ListingCard (con avatar), FavoriteButton
├── lib/
│   ├── supabase/                 # client.ts, server.ts, middleware.ts
│   ├── stripe.ts                 # getStripe(), STRIPE_PRICES, helpers de precio
│   ├── resend.ts                 # getResend() singleton, FROM_EMAIL
│   ├── emails/                   # welcome.ts, pioneer-expired.ts
│   └── utils.ts                  # cn()
├── types/                        # Profile, Listing, ClosedInteraction
├── hooks/                        # custom hooks
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

## Plan de monetización y suscripciones

### Tarifas base

| Tipo de usuario | Suscripción mensual | Boost semanal |
|---|---|---|
| Espacios publicitarios / Anunciantes | $4.99 USD/mes | $2.99 USD/sem |
| Agencias de marketing | $9.99 USD/mes | $4.99 USD/sem |

El Boost posiciona la publicación en primer lugar en el feed y búsqueda durante 7 días (pago único, no recurrente).

---

### Usuarios pioneros (primeros 100 registrados — `user_number ≤ 100`)

**Durante el primer año** desde su fecha de registro:
- Todas sus publicaciones activas son **completamente gratuitas**
- `billing_status = "pioneer"` en cada listing
- No se solicita método de pago
- Dashboard muestra badge "Pionero SpotU" con contador regresivo de días restantes

**Cuando vence el año gratuito:**
- Un cron job diario (`/api/cron/expire-pioneers`, 6:00 AM UTC) detecta pioneros expirados
- Pausa automáticamente **todas sus publicaciones activas** (`billing_status: "cancelled"`, `status: "paused"`)
- Envía email informando que el año gratuito concluyó y que deben reactivar sus publicaciones
- Al reactivar desde el dashboard, entran al flujo normal (checkout Stripe, cobro inmediato)
- Se envía email de aviso 7 días antes del vencimiento *(pendiente — Resend)*

**Excepción de prueba:** la cuenta `spotu.online@gmail.com` (administrador) tiene `user_number = 9999` y no recibe trato de pionero, permitiendo pruebas del flujo de pago.

---

### Usuarios normales (registrados en posición > 100)

#### Primera publicación
1. Usuario crea listing y elige "Publicar activa"
2. Sistema dirige al checkout de Stripe
3. Stripe crea una **suscripción con 30 días de trial** (contados desde la fecha de creación del listing)
4. Se solicita tarjeta en el checkout — **no se cobra nada en este momento**
5. Al vencer el trial (día 30): Stripe cobra automáticamente y continúa cobrando cada mes
6. Si el usuario **desactiva el listing antes del día 30**: se cancela la suscripción y **no se realiza ningún cobro**
7. Si el usuario reactiva el listing pasados los 30 días: entra al flujo de 2ª+ publicación (cobro inmediato)

#### Segunda publicación y siguientes
1. Usuario crea listing y elige "Publicar activa"
2. Sistema dirige al checkout de Stripe (se muestra aviso de cargo inmediato)
3. Stripe crea una **suscripción inmediata** — cobra desde el primer día
4. El monto del primer cobro es prorrateado al ciclo mensual en curso del cliente en Stripe
5. Renovación automática mensual

#### Publicación creada como pausada (cualquier usuario no pionero)
- No se inicia checkout ni suscripción al crear
- El listing queda con `status: "paused"`, `billing_status: "pending_payment"`
- Al activar desde el dashboard: entra al flujo correspondiente (ver arriba)
- **El trial de 30 días se calcula desde la fecha de creación del listing**, no desde la activación
  - Ejemplo: si creas un listing pausado y lo activas 15 días después, solo tienes 15 días de trial restantes
  - Si lo activas pasados los 30 días: cobro inmediato (flujo de 2ª+ publicación)

---

### Renovación automática

- Stripe maneja la renovación sin intervención del usuario
- Webhook `invoice.payment_succeeded` → actualiza `paid_until` en Supabase
- Webhook `invoice.payment_failed` → `billing_status = "past_due"`, Stripe envía emails de dunning automáticamente
- Dashboard muestra aviso cuando quedan ≤ 7 días para renovar

---

### Cancelación y reactivación

| Acción | Resultado |
|---|---|
| Desactivar listing | Cancela suscripción Stripe al final del período pagado |
| Reactivar listing pausado (dentro de trial) | Continúa el trial con días restantes |
| Reactivar listing pausado (fuera de trial) | Cobra inmediatamente |
| Reactivar listing cancelado | Cobra inmediatamente |
| Pago fallido | `billing_status = past_due`, Stripe hace dunning automático |

---

### Emails automáticos (Resend)

| Email | Estado |
|---|---|
| Bienvenida al registrarse | ✅ implementado |
| Aviso de expiración año pionero (al vencer) | ✅ implementado (cron diario) |
| Confirmación de listing activo + fecha de primer cobro | pendiente |
| 7 días antes de que venza el trial de 30 días | pendiente |
| 7 días antes de renovación mensual | pendiente |
| 7 días antes de que venza el año gratuito de pionero | pendiente |
| Pago fallido (complementario al dunning de Stripe) | pendiente |

---

### Portal de suscripciones (Stripe Customer Portal)

Disponible en el dashboard para usuarios que hayan realizado al menos un pago. Permite:
- Ver todas las suscripciones activas
- Actualizar método de pago
- Cancelar suscripciones individualmente

## Progreso

### ✅ Completado

- Setup (Next.js 16, TailwindCSS 4, shadcn/ui, TypeScript strict)
- Branding: Electric Indigo + Coral, logos .webp, tema soft slate
- Landing page editorial con animaciones, i18n ES/EN, scroll reveals
- Autenticación: registro multi-rol, login, Google OAuth, email confirm
- Protección de rutas (proxy.ts)
- Feed público con filtros (tipo, país dinámico) + búsqueda por keyword (título, descripción, tags)
- CRUD publicaciones: form multi-paso, múltiples países (hasta 10), imágenes, tags (max 5)
- Toggle activa/pausa al publicar; selector de tipo para usuarios multi-rol (con precio por tipo)
- Dashboard: tabla de publicaciones con filtros (título, estado, tipo), stats (vistas + contactos)
- Dashboard billing: estado correcto por publicación, columna "Vence/Renueva" contextual, banner Boost
- Detalle de publicación: ViewTracker, contacto WhatsApp/email, favoritos
- Perfil público (`/profile/[id]`) y edición propia (lista completa de ~100 países)
- Multi-rol en dashboard: badges con todos los tipos del usuario
- Favoritos (tabla con RLS, botón toggle)
- Stripe live: checkout, suscripciones con trial, boosts, webhooks, lógica pionero/trial/prorrateo
- Anti-fraude: `total_listings_created` con trigger para evitar re-grant del trial al borrar listing
- Billing bypass fix: "Activar" en menú de listing pasa por checkout API (no Supabase directo)
- Portal de suscripciones Stripe (PortalButton en dashboard para usuarios con stripe_customer_id)
- PioneerBanner con countdown regresivo de días restantes del año gratuito
- Emails Resend: bienvenida al registrarse (email/password y Google OAuth) + aviso de expiración de año pionero
- Cron job diario (Vercel Cron): auto-pausa listings de pioneros expirados y envía email
- Boost habilitado para usuarios pioneros (suscripción gratis, boost de pago)
- Fix constraint `billing_status`: agrega `pending_payment` y `pioneer` (migración 012)
- Selector de código de país para WhatsApp en formulario de publicación
- Avatar del autor en cards del feed (join con `profiles`)
- Página 404 personalizada (`/not-found.tsx`)
- Páginas legales: `/privacy` y `/terms` en español
- Deploy en Vercel + dominio `spotu.online`

### 🚧 Pendiente (Fase 2)

- [ ] Búsqueda semántica con IA (Claude API)
- [ ] Notificaciones por email restantes — trial por vencer, renovación, pionero expirando 7d antes
- [ ] Contratos digitales con firma simple
- [ ] Analytics básico (gráficas de vistas/contactos en el tiempo)
- [ ] Interacciones cerradas (migración 002 lista, UI pendiente)
- [ ] Número de WhatsApp real para SpotU (actualmente placeholder)
- [ ] Cron para auto-pausar listings con `billing_status = "trial"` y `trial_ends_at` vencido
- [ ] Cron para resetear `is_boosted` cuando `boost_ends_at` vence

## Documentos del negocio

Los documentos de negocio (pitch, estudio de mercado, modelo de negocio, guía del sitio, branding) están en la carpeta [`docs/`](docs/README.md).

## Autor

**Cesar Emilio Castaño Marin** — Fundador de SpotU
