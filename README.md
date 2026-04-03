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

- [x] Setup del proyecto (Next.js, TailwindCSS, shadcn/ui)
- [x] Branding: colores (Electric Indigo + Coral), tipografía (Inter), logos
- [x] Landing page (hero con gradient orbs animados, roles, cómo funciona, features, CTA)
- [x] Internacionalización (ES/EN toggle en nav)
- [x] Supabase: cliente browser/server, middleware para sesiones
- [x] DB schema: profiles, listings (con ubicación extendida), views, contacts, favorites
- [x] RLS policies en todas las tablas + storage bucket para imágenes
- [x] Auto-creación de perfil al registrarse (trigger)
- [ ] Autenticación (Supabase Auth)
- [ ] Perfil de usuario
- [ ] CRUD de publicaciones
- [ ] Feed/explorar con cards
- [ ] Búsqueda con filtros
- [ ] Stats básicas (vistas + contactos)

## Autor

**Cesar Emilio Castaño Marin** — Fundador de SpotU
