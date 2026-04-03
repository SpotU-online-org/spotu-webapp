# SpotU — Marketplace de Publicidad

## Contexto
Marketplace de 3 lados (intermediario puro) que conecta:
1. **Anunciantes** ↔ **Espacios publicitarios** (físicos y digitales)
2. **Agencias de marketing** ↔ **Anunciantes**
3. **Agencias de marketing** ↔ **Espacios publicitarios**

**Dinámica:** Espacios y agencias publican (obligatorio). Anunciantes buscan y contactan directo; opcionalmente publican solicitudes de cotización.

**Alcance V1:** publicar, buscar, contactar (WhatsApp/correo directo), búsqueda con IA (Claude API), contratos digitales, interacciones cerradas, stats básicas (vistas + clics en contactar). NO analytics de marketing, NO gestión de campañas, NO mensajería interna.

**Monetización:** Primera publicación gratis 30 días, después $4.99 USD/mes por publicación. Boost: $2.99 USD/semana.

Mercados objetivo: Colombia, norte de México (Monterrey, Chihuahua) y Florida (USA).

## Stack
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript strict
- **Styling:** TailwindCSS 4 + shadcn/ui (base-nova, usa `@base-ui/react`)
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **IA:** Claude API (búsqueda semántica, matching) — Fase 2
- **Pagos:** Stripe (USD)
- **Email:** Resend
- **Deploy:** Vercel
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

### Interacciones cerradas (closed interactions)
- Migración: `supabase/migrations/002_closed_interactions.sql`
- Flujo: provider solicita → client confirma/rechaza → incrementa `confirmed_interactions_count` en profile
- RLS: confirmadas son públicas, provider crea, client responde
- Expiran en 30 días si no hay respuesta

## Estructura del Proyecto
```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing page ("use client", dark hero + light sections)
│   └── layout.tsx          # Root layout (Providers wrapper)
├── components/
│   ├── ui/                 # shadcn/ui (button, link-button)
│   ├── layout/             # Header, Footer, SpotULogo, AnimatedGrid, LanguageToggle, Providers
│   └── listings/           # (pendiente)
├── lib/
│   ├── supabase/           # client.ts, server.ts, middleware.ts
│   └── utils/              # cn()
├── types/                  # Profile, Listing, ClosedInteraction, etc.
└── constants/              # USER_ROLES, SPACE_CATEGORIES, etc.
supabase/migrations/
├── 001_initial_schema.sql  # profiles, listings, views, contacts, favorites (YA EJECUTADA)
└── 002_closed_interactions.sql  # closed_interactions + trigger (PENDIENTE de ejecutar en Supabase)
```

## Convenciones de Código

### General
- TypeScript estricto (`strict: true`)
- Español para contenido de usuario, inglés para código
- Named exports (no default exports excepto pages)

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
- Header: sticky, `bg-background/80 backdrop-blur-xl`, border sutil
- Hero: AnimatedGrid con gradient orbs suaves (primary/coral/emerald), dot grid con opacidad baja
- Animaciones: `fade-in-up`, `float`, `float-slow`, `gradient-shift`, hover transitions en cards/icons
- Secciones alternas: `bg-card/60` para contraste sutil entre secciones
- CTA final: gradient `from-primary via-primary to-indigo` con texto blanco
- Colores: Primary (Electric Indigo #4F46E5), Accent (Coral #F97316), Emerald
- Logos: `.webp` en `/public/logos/` (full, horizontal, icon)
- Contrastes: `text-foreground` para títulos, `text-muted-foreground` para descripciones, `text-primary` para acciones
