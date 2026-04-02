# SpotU — Marketplace de Publicidad

## Contexto
Marketplace de 3 lados (intermediario puro) que conecta:
1. **Anunciantes** ↔ **Espacios publicitarios** (físicos y digitales)
2. **Agencias de marketing** ↔ **Anunciantes** (agencias ofrecen servicios, empresas contratan)
3. **Agencias de marketing** ↔ **Espacios publicitarios** (agencias gestionan espacios para sus clientes)

**Alcance V1:** publicar, buscar, contactar (WhatsApp/correo directo), contratos digitales, stats básicas (vistas + clics en contactar). NO analytics de marketing, NO gestión de campañas, NO mensajería interna.

Mercados objetivo: Colombia, norte de México (Monterrey, Chihuahua) y Florida (USA).

## Stack
- **Frontend:** Next.js 14+ (App Router), React 18+, TypeScript
- **Styling:** TailwindCSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Pagos:** Stripe (USD)
- **Email:** Resend
- **Deploy:** Vercel
- **Package manager:** pnpm

## Estructura del Proyecto
```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Autenticación
│   ├── (dashboard)/        # Panel de usuario
│   ├── (public)/           # Páginas públicas (feed, search, listing)
│   └── api/                # Route handlers
├── components/
│   ├── ui/                 # shadcn/ui
│   ├── forms/              # Formularios (publicación, perfil)
│   ├── layout/             # Header, Footer, Sidebar
│   └── listings/           # Cards, detalles, filtros
├── lib/
│   ├── supabase/           # Cliente y helpers
│   ├── utils/              # Utilidades
│   └── validations/        # Schemas de Zod
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript types/interfaces
└── constants/              # Constantes y configuración
```

## Convenciones de Código

### General
- TypeScript estricto (`strict: true`)
- Español para contenido de usuario, inglés para código
- Functional components con arrow functions
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
- Tipado con `supabase gen types`

### Formularios
- Zod + React Hook Form + Server Actions

### Git
- Commits en inglés, descriptivos, conventional commits (`feat:`, `fix:`, `chore:`, `docs:`)

## Comandos
- `pnpm dev` / `pnpm build` / `pnpm lint`
- `pnpm db:generate` / `pnpm db:migrate`

## Reglas
- Mobile-first siempre
- No dependencias sin justificación
- No `any` en TypeScript
- Loading, error y empty states en toda página
- Variables de entorno en `.env.local`
- Manejo de errores en toda query a Supabase
- Imágenes con `next/image`
- Cobros en USD, Stripe como método principal
