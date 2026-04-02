# SpotU — Marketplace de Publicidad

## Contexto
Marketplace de 3 lados que conecta:
1. **Anunciantes** ↔ **Espacios publicitarios** (físicos y digitales)
2. **Agencias de marketing** ↔ **Anunciantes** (agencias ofrecen servicios, empresas contratan)
3. **Agencias de marketing** ↔ **Espacios publicitarios** (agencias gestionan espacios para sus clientes)

Mercados objetivo inicial: Colombia, norte de México (Monterrey, Chihuahua) y Florida (USA).

## Stack Tecnológico
- **Frontend:** Next.js 14+ (App Router), React 18+, TypeScript
- **Styling:** TailwindCSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime, Edge Functions)
- **IA:** Claude API (búsqueda semántica, matching)
- **Pagos:** Stripe (cobros en USD)
- **Email:** Resend
- **Deploy:** Vercel
- **Package manager:** pnpm

## Estructura del Proyecto
```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Rutas de autenticación
│   ├── (dashboard)/        # Panel de usuario autenticado
│   ├── (public)/           # Páginas públicas (feed, search, listing)
│   └── api/                # Route handlers
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── forms/              # Formularios (publicación, perfil)
│   ├── layout/             # Header, Footer, Sidebar
│   ├── listings/           # Cards, detalles, filtros
│   └── agency/             # Perfil, dashboard, propuestas de agencia
├── lib/
│   ├── supabase/           # Cliente y helpers de Supabase
│   ├── ai/                 # Integración con Claude API
│   ├── utils/              # Utilidades generales
│   └── validations/        # Schemas de Zod
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript types/interfaces
└── constants/              # Constantes y configuración
```

## Convenciones de Código

### General
- TypeScript estricto (`strict: true`)
- Español para contenido de usuario, inglés para código (variables, funciones, tipos)
- Functional components con arrow functions
- Named exports (no default exports excepto pages)

### Naming
- Archivos de componentes: `PascalCase.tsx`
- Hooks: `use-kebab-case.ts`
- Utils/lib: `kebab-case.ts`
- Types: `PascalCase` para interfaces y types
- Variables/funciones: `camelCase`
- Constantes: `SCREAMING_SNAKE_CASE`
- Database columns: `snake_case`

### Componentes
- Props definidas como `type` (no `interface`) con sufijo `Props`
- Usar `cn()` de clsx/tailwind-merge para clases condicionales
- Server Components por default, Client Components solo cuando se necesiten

### Supabase
- Usar `createServerClient` en Server Components
- Usar `createBrowserClient` en Client Components
- RLS (Row Level Security) en TODAS las tablas
- Tipado generado con `supabase gen types`

### Formularios
- Zod para validación
- React Hook Form para manejo de estado
- Server Actions para submit cuando sea posible

### Git
- Commits en inglés, descriptivos
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
- Branch naming: `feat/feature-name`, `fix/bug-name`

## Comandos
- `pnpm dev` — desarrollo local
- `pnpm build` — build de producción
- `pnpm lint` — linting
- `pnpm db:generate` — generar tipos de Supabase
- `pnpm db:migrate` — correr migraciones

## Reglas Importantes
- Mobile-first siempre
- No instalar dependencias sin justificación
- No usar `any` en TypeScript
- Manejar loading, error y empty states en toda página
- Variables de entorno en `.env.local`, nunca hardcodeadas
- Toda query a Supabase debe tener manejo de errores
- Imágenes optimizadas con `next/image`
- Todos los cobros a clientes en USD
- Métodos de pago: Stripe (tarjeta de crédito/débito) como método principal
