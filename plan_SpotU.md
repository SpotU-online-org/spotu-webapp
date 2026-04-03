# SpotU — Plan Completo

## 1. Visión General

SpotU es un marketplace de publicidad que conecta **tres tipos de actores**: anunciantes, dueños de espacios publicitarios (físicos y digitales) y agencias/agentes de marketing. La plataforma centraliza la oferta y demanda de publicidad, facilitando el descubrimiento y simplificando el contacto entre partes.

### Conexiones del marketplace (3 lados)
1. **Anunciantes ↔ Espacios publicitarios** — empresas encuentran y contratan espacios; dueños de espacios encuentran anunciantes
2. **Agencias de marketing ↔ Anunciantes** — agencias ofrecen servicios profesionales; empresas encuentran expertos que gestionen sus campañas
3. **Agencias de marketing ↔ Espacios publicitarios** — agencias buscan y gestionan espacios en nombre de sus clientes

**Mercados objetivo inicial:** Colombia, norte de México (Monterrey, Chihuahua) y Florida (USA).

### Alcance actual (V1)
SpotU es un **intermediario puro**: permite a los actores publicar, buscar y contactarse. No ofrecemos analytics de marketing, gestión de campañas ni herramientas avanzadas. Las únicas funcionalidades extra son:
- **Contratos digitales** entre partes (hostear el acuerdo)
- **Stats básicas** por publicación: cuántas personas vieron la publicación y cuántas presionaron el botón de contactar
- **Búsqueda con IA** (Fase 2): matching semántico para todos los usuarios — describe lo que necesitas y la IA filtra los mejores resultados

### Dinámica del marketplace
- **Espacios y agencias** son el lado de oferta: **publican obligatoriamente** para existir en la plataforma
- **Anunciantes** son el lado de demanda: su flujo principal es **buscar y contactar directamente**. Opcionalmente pueden publicar su necesidad ("Solicitar cotizaciones") para que espacios y agencias los contacten a ellos
- Este modelo híbrido funciona en todas las etapas: cuando hay poca oferta, las publicaciones de anunciantes ayudan a atraer proveedores; cuando hay mucha oferta, los anunciantes simplemente buscan y contactan

---

## 2. Modelo de Negocio

### Todos los cobros en USD

### Fase 1 — MVP (Freemium con límites)
| Concepto | Precio |
|----------|--------|
| Primera publicación | **GRATIS por 30 días** (todos los usuarios) |
| Publicaciones (después del mes gratis o adicionales) | **$4.99 USD/mes** cada una |
| Publicación destacada (boost) | **$2.99 USD/semana** |

### Fase 2 — V1 (Planes de suscripción)
| Plan | Precio | Incluye |
|------|--------|---------|
| **Free** | $0 | 1 publicación activa, búsqueda básica, contactos limitados (10/mes) |
| **Pro** | $14.99 USD/mes | Publicaciones ilimitadas, contactos ilimitados, contratos digitales, badge verificado, posicionamiento prioritario |
| **Agency** | $49.99 USD/mes | Todo Pro + perfil público de agencia, portafolio de servicios, gestión multi-cliente |

### Fase 3 — Escala (futuro, según demanda)
- Comisión del 5-8% sobre transacciones cerradas en plataforma
- Analytics avanzados de marketing (si se valida la necesidad)
- Herramientas SaaS de gestión de campañas
- API para integración programática

### Métodos de pago aceptados
- **Stripe** como procesador principal
  - Tarjeta de crédito / débito (Visa, Mastercard, Amex)
  - Apple Pay / Google Pay (vía Stripe)
- Consideración futura: PSE (Colombia), OXXO (México) vía Stripe local payment methods

### Promoción de lanzamiento
- Todos los usuarios: primera publicación gratis durante 30 días (después se cobra mensualidad)
- Referral program: invita a un usuario → 1 mes de boost gratis
- Agencias: primer mes gratis del plan Agency para agencias que traigan 5+ clientes

---

## 3. Tipos de Publicación y Campos por Tarjeta

Cada actor del marketplace crea una **publicación/tarjeta** con campos específicos. El objetivo es que cada tarjeta sea simple, informativa y permita contacto directo.

### 3.1 Espacio Publicitario ("Tengo un espacio")

Para dueños de vallas, pantallas LED, sitios web, redes sociales, podcasts, etc.

| Campo | Tipo | Obligatorio | Ejemplo |
|-------|------|-------------|---------|
| Título | Texto corto | Sí | "Pantalla LED en estadio de Monterrey" |
| Tipo de espacio | Selector: Físico / Digital | Sí | Físico |
| Categoría | Selector | Sí | Valla, Pantalla LED, Sitio web, Red social, Podcast, Radio, Impreso, Otro |
| Descripción | Texto largo | Sí | Ubicación exacta, dimensiones, horarios, condiciones |
| Imágenes | Upload (1-5 fotos) | Sí (mín. 1) | Fotos del espacio, mockups |
| Ubicación (ciudad, país) | Texto / Selector | Sí | Monterrey, México |
| Audiencia estimada | Texto corto | No | "~15,000 personas por evento" |
| Precio estimado | Rango (mín-máx) | No | $200 - $500 USD/mes |
| Período de precio | Selector | No | Por día / semana / mes / campaña |
| Disponibilidad | Texto corto | No | "Disponible de lunes a viernes" |
| Botón: Contactar por WhatsApp | Número de WhatsApp | Sí (al menos uno) | +52 81 1234 5678 |
| Botón: Contactar por correo | Email | Sí (al menos uno) | contacto@espacio.com |
| Sitio web / redes sociales | URL | No | instagram.com/espacio |

### 3.2 Anunciante — Solicitud de cotización ("Busco publicidad")

**Opcional.** El flujo principal del anunciante es buscar espacios/agencias y contactarlos directamente. Pero si quiere que los proveedores lo contacten a él, puede publicar una solicitud.

| Campo | Tipo | Obligatorio | Ejemplo |
|-------|------|-------------|---------|
| Título | Texto corto | Sí | "Busco espacio para campaña de evento deportivo" |
| Tipo de espacio buscado | Multi-selector | Sí | Pantalla LED, Redes sociales |
| Descripción | Texto largo | Sí | Qué quieren anunciar, objetivo, contexto |
| Imágenes | Upload (0-5 fotos) | No | Logo, material de campaña |
| Ubicación deseada | Texto / Selector | Sí | Monterrey, México |
| Presupuesto estimado | Rango (mín-máx) | No | $100 - $300 USD |
| Período | Selector | No | Por semana / mes / campaña |
| Industria / sector | Selector | No | Deportes, Restaurantes, Tecnología, Otro |
| Botón: Contactar por WhatsApp | Número de WhatsApp | Sí (al menos uno) | +52 81 9876 5432 |
| Botón: Contactar por correo | Email | Sí (al menos uno) | marketing@empresa.com |
| Sitio web / redes sociales | URL | No | empresa.com |

### 3.3 Agencia / Agente de Marketing ("Ofrezco servicios de marketing")

Para agencias y freelancers de marketing que ofrecen sus servicios.

| Campo | Tipo | Obligatorio | Ejemplo |
|-------|------|-------------|---------|
| Nombre de agencia / agente | Texto corto | Sí | "Studio Creativo MKT" |
| Servicios ofrecidos | Multi-selector | Sí | Gestión de campañas, Diseño creativo, Media buying, Manejo de redes, SEO/SEM, Branding |
| Descripción | Texto largo | Sí | Experiencia, enfoque, propuesta de valor |
| Imágenes | Upload (0-5 fotos) | No | Logo, portafolio visual, casos de éxito |
| Mercados donde opera | Multi-selector | Sí | Colombia, México, USA |
| Precio estimado | Texto corto | No | "Desde $500 USD/mes por cliente" |
| Industrias de especialización | Multi-selector | No | Deportes, Real estate, Gastronomía |
| Botón: Contactar por WhatsApp | Número de WhatsApp | Sí (al menos uno) | +57 300 123 4567 |
| Botón: Contactar por correo | Email | Sí (al menos uno) | info@agencia.com |
| Sitio web / portafolio | URL | No | agencia.com |

### Nota sobre contacto
Cada publicación debe tener **al menos un método de contacto** (WhatsApp o correo). Los botones de contactar se muestran prominentemente en cada tarjeta. SpotU registra cuántas veces se presiona cada botón (stats básicas para el dueño de la publicación).

---

## 4. Fases de Desarrollo

### FASE 1: MVP (6-8 semanas)

**Objetivo:** Validar que existe demanda real conectando los 3 actores.

**Features:**
- Autenticación (email + Google) via Supabase Auth
- Registro con selección de rol: "Quiero anunciarme" / "Tengo espacio publicitario" / "Soy agencia de marketing"
- CRUD completo de publicaciones con los campos definidos en Sección 3 (obligatorio para espacios/agencias, opcional para anunciantes)
- Los anunciantes pueden buscar y contactar sin necesidad de publicar
- Búsqueda con filtros (ciudad, tipo de espacio, rango de precio, tipo de actor)
- Feed/explorar publicaciones con cards
- Página de detalle de publicación con botones de contacto (WhatsApp y/o correo)
- Stats básicas por publicación (vistas + clics en botón de contactar)
- Landing page con propuesta de valor
- Responsive / mobile-first

**No incluye en MVP:**
- Pagos / suscripciones
- IA / matching semántico (Fase 2)
- Contratos digitales (Fase 2)
- Mensajería interna (el contacto es directo por WhatsApp/correo)

#### Interacciones cerradas (closed interactions)
Sistema de confianza verificable entre partes:
1. Dos partes se contactan vía un listing (WhatsApp/email) y trabajan juntos fuera de la plataforma
2. La parte **contratada** (provider) crea una solicitud de "interacción cerrada"
3. La parte **contratante** (client) recibe la solicitud y puede confirmar o rechazar
4. Si confirma → se suma al contador de `confirmed_interactions_count` en el perfil del provider
5. Ambas partes pueden dejar un comentario breve (testimonio público)
6. Las solicitudes expiran en 30 días sin respuesta
7. UNIQUE constraint: un provider no puede solicitar más de una interacción cerrada por el mismo listing con el mismo client

---

### FASE 2: V1 (4-6 semanas post-MVP)

**Objetivo:** Monetizar, agregar IA para búsqueda y contratos digitales.

**Features:**

#### Búsqueda con IA (todos los usuarios)
- Input inteligente: "Quiero anunciar un evento deportivo en Monterrey con bajo presupuesto"
- Claude API interpreta intención, filtra y rankea resultados
- Embeddings con pgvector para búsqueda semántica
- Funciona para todos los usuarios (Free, Pro, Agency) — es parte del core del marketplace
- Complementa los filtros manuales, no los reemplaza

#### Sistema de pagos (Stripe)
- Integración con Stripe Checkout
- Planes de suscripción (Free / Pro / Agency)
- Cobro por publicaciones adicionales
- Publicaciones destacadas (boost)
- Portal de facturación del cliente

#### Contratos digitales entre partes (Pro)
- Templates de contrato predefinidos:
  - Contrato de alquiler de espacio publicitario
  - Acuerdo de campaña publicitaria / servicios de marketing
  - Términos personalizados
- Flujo:
  1. Una parte selecciona template y personaliza términos (duración, precio, condiciones)
  2. Envía propuesta a la otra parte vía la plataforma
  3. La otra parte revisa, sugiere cambios o acepta
  4. Ambas partes firman digitalmente (checkbox + timestamp + IP)
  5. Contrato guardado y descargable en PDF
- Historial de contratos en el dashboard
- Notificaciones de vencimiento

#### Notificaciones
- Email via Resend: nuevo contacto, contrato pendiente
- Notificaciones in-app (bell icon)

#### Verificación de usuarios
- Badge "Verificado" para usuarios que confirmen identidad/empresa
- Proceso manual inicial (subir documento → admin aprueba)

---

### FASE 3: Escala (ongoing, post-validación)

**Añadir según demanda validada:**
- Pagos entre partes vía plataforma (escrow con Stripe Connect)
- Mensajería interna (inbox, chat)
- Analytics avanzados (si los usuarios lo piden)
- App móvil nativa
- API pública
- Reviews y ratings entre partes
- Multi-idioma (español / inglés)
- Expansión a nuevos mercados

---

## 5. Arquitectura Técnica

### Stack
| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14+ (App Router), React 18+, TypeScript |
| Styling | TailwindCSS + shadcn/ui |
| Backend | Supabase (PostgreSQL, Auth, Storage, Edge Functions) |
| IA (V1) | Claude API (búsqueda semántica, matching) |
| Pagos | Stripe (Checkout, Billing) |
| Email | Resend |
| Deploy | Vercel |
| Package manager | pnpm |

### Diagrama de arquitectura
```
┌─────────────────────────────────────────────┐
│                 FRONTEND                     │
│            Next.js 14+ (App Router)          │
│         TailwindCSS + shadcn/ui              │
│                                              │
│  Pages:                                      │
│  ├── / (landing)                             │
│  ├── /auth (login/register)                  │
│  ├── /feed (explorar publicaciones)          │
│  ├── /publish (crear publicación)            │
│  ├── /listing/[id] (detalle + contactar)     │
│  ├── /profile/[id] (perfil público)          │
│  ├── /dashboard (mi panel + stats básicas)   │
│  ├── /contracts (contratos digitales) [V1]   │
│  └── /search (búsqueda con filtros)          │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│               SUPABASE                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │   Auth   │ │ Database │ │ Storage  │    │
│  │          │ │(Postgres)│ │ (images) │    │
│  └──────────┘ └──────────┘ └──────────┘    │
│  ┌──────────┐                               │
│  │  Edge    │                               │
│  │Functions │                               │
│  └──────────┘                               │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│              SERVICIOS EXTERNOS              │
│  ┌──────────┐ ┌──────────┐                  │
│  │  Stripe  │ │ Resend   │                  │
│  │ (pagos)  │ │ (emails) │                  │
│  └──────────┘ └──────────┘                  │
└─────────────────────────────────────────────┘
```

### Modelo de Base de Datos

```sql
-- Usuarios (extiende auth.users de Supabase)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  type TEXT CHECK (type IN ('advertiser', 'space_owner', 'agency')),
  display_name TEXT NOT NULL,
  company_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  phone TEXT,
  whatsapp TEXT,
  email_contact TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'MX',
  is_verified BOOLEAN DEFAULT FALSE,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'agency')),
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Publicaciones (core del marketplace)
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('want_to_advertise', 'have_space', 'offer_service')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,

  -- Categorización
  space_type TEXT CHECK (space_type IN (
    'billboard', 'led_screen', 'sports_venue',
    'social_media', 'website', 'app',
    'print', 'radio', 'podcast',
    'other'
  )),
  space_medium TEXT CHECK (space_medium IN ('physical', 'digital')),

  -- Para agencias
  services TEXT[], -- ['campaign_management', 'creative_design', 'media_buying', ...]
  specializations TEXT[], -- ['sports', 'real_estate', 'food_beverage', ...]

  -- Ubicación
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'MX',

  -- Comercial
  price_min DECIMAL,
  price_max DECIMAL,
  price_currency TEXT DEFAULT 'USD',
  price_period TEXT CHECK (price_period IN ('day', 'week', 'month', 'campaign')),
  price_text TEXT, -- texto libre para agencias: "Desde $500 USD/mes"

  -- Audiencia (solo espacios)
  audience_size TEXT, -- texto libre: "~15,000 por evento"
  availability TEXT, -- texto libre: "Lunes a viernes"

  -- Industria (solo anunciantes)
  industry TEXT,

  -- Contacto directo
  whatsapp TEXT,
  email_contact TEXT,
  website_url TEXT,

  -- Media
  images TEXT[],

  -- Estado
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'expired')),
  is_featured BOOLEAN DEFAULT FALSE,

  -- Stats básicas
  views_count INTEGER DEFAULT 0,
  contacts_count INTEGER DEFAULT 0, -- clics en botones de contactar

  -- IA (V1)
  embedding VECTOR(1536),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registro de vistas (para contar vistas únicas)
CREATE TABLE listing_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  viewer_ip TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registro de clics en contactar (para stats)
CREATE TABLE listing_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  contact_method TEXT CHECK (contact_method IN ('whatsapp', 'email')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contratos digitales (V1 - Pro)
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id),
  creator_id UUID REFERENCES profiles(id),
  counterpart_id UUID REFERENCES profiles(id),
  template_type TEXT CHECK (template_type IN ('space_rental', 'campaign_agreement', 'service_agreement', 'custom')),
  title TEXT NOT NULL,
  terms JSONB NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'negotiating', 'accepted', 'rejected', 'expired', 'completed')),
  creator_signed_at TIMESTAMPTZ,
  counterpart_signed_at TIMESTAMPTZ,
  creator_ip TEXT,
  counterpart_ip TEXT,
  expires_at TIMESTAMPTZ,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favoritos
CREATE TABLE favorites (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, listing_id)
);

-- Suscripciones / pagos (V1)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'pro', 'agency')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_listings_type ON listings(type);
CREATE INDEX idx_listings_space_type ON listings(space_type);
CREATE INDEX idx_listings_city ON listings(city);
CREATE INDEX idx_listings_country ON listings(country);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listing_views_listing ON listing_views(listing_id);
CREATE INDEX idx_listing_contacts_listing ON listing_contacts(listing_id);
CREATE INDEX idx_contracts_participants ON contracts(creator_id, counterpart_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_listings_embedding ON listings USING ivfflat (embedding vector_cosine_ops);
```

### Roles de usuario
| Rol | Permisos |
|-----|----------|
| **Visitante** | Ver listings públicos, buscar, ver landing |
| **Free** | 1 publicación activa, 10 contactos/mes, búsqueda con filtros, stats básicas (vistas + contactos) |
| **Pro** | Publicaciones ilimitadas, contactos ilimitados, contratos digitales, badge verificado, posicionamiento prioritario |
| **Agency** | Todo Pro + perfil público de agencia, portafolio de servicios, gestión multi-cliente |
| **Admin** | Todo + moderar, verificar usuarios, gestión global |

---

## 6. Flujos UX Principales

### Registro
```
Landing → CTA "Empieza gratis"
  → Seleccionar: "Quiero anunciarme" / "Tengo espacio" / "Soy agencia de marketing"
  → Sign up (Google o email)
  → Completar perfil (nombre, empresa, ciudad, país, WhatsApp y/o correo)
  → Si espacio/agencia: crear primera publicación (guiado, obligatorio)
  → Si anunciante: ir directo al feed para buscar (publicar es opcional)
  → Feed personalizado
```

### Publicación (Espacio publicitario)
```
Dashboard → "Nueva publicación" → "Tengo un espacio"
  → Paso 1: Tipo de espacio (Físico/Digital) + Categoría (valla, pantalla, web, podcast, etc.)
  → Paso 2: Título + Descripción detallada
  → Paso 3: Ubicación + Audiencia estimada + Disponibilidad
  → Paso 4: Precio estimado (rango) + Período
  → Paso 5: Fotos del espacio (mín. 1)
  → Paso 6: Datos de contacto (WhatsApp y/o correo, sitio web)
  → Preview → Publicar
```

### Solicitud de cotización (Anunciante — opcional)
```
Dashboard → "Solicitar cotizaciones"
  → Paso 1: Tipo de espacio buscado (multi-select)
  → Paso 2: Título + Descripción (qué quieres anunciar, objetivo)
  → Paso 3: Ubicación deseada + Industria/sector
  → Paso 4: Presupuesto estimado (rango) + Período
  → Paso 5: Imágenes opcionales (logo, material)
  → Paso 6: Datos de contacto (WhatsApp y/o correo, sitio web)
  → Preview → Publicar
  → Espacios y agencias ven la solicitud y pueden contactar al anunciante
```

### Publicación (Agencia/Agente)
```
Dashboard → "Nueva publicación" → "Ofrezco servicios de marketing"
  → Paso 1: Nombre de agencia/agente + Servicios (multi-select)
  → Paso 2: Descripción + Industrias de especialización
  → Paso 3: Mercados donde opera + Precio estimado
  → Paso 4: Imágenes opcionales (logo, portafolio)
  → Paso 5: Datos de contacto (WhatsApp y/o correo, sitio web/portafolio)
  → Preview → Publicar
```

### Búsqueda y descubrimiento
```
Feed / Barra de búsqueda
  → Opción A (MVP): Filtros manuales — tipo de actor, tipo de espacio, ciudad, país, rango de precio
  → Opción B (V1): Búsqueda con IA — "pantalla LED en Monterrey para evento deportivo bajo presupuesto"
     → Claude API interpreta → resultados rankeados por relevancia
  → Cards con preview (foto, título, ubicación, precio, tipo)
  → Click → Detalle completo con botones de contactar
  → Click "Contactar por WhatsApp" → abre WhatsApp directo
  → Click "Contactar por correo" → abre cliente de correo
  → SpotU registra el clic (stats para el dueño de la publicación)
```

### Stats básicas
```
Dashboard → Mi publicación
  → Total de vistas (cuántas personas vieron la publicación)
  → Total de contactos (cuántas veces presionaron botón de contactar)
  → Desglose: contactos por WhatsApp vs correo
```

### Contratos (V1 - Pro)
```
Dashboard → "Crear contrato"
  → Seleccionar contraparte (buscar por nombre o email)
  → Seleccionar template (alquiler de espacio / campaña / servicios / custom)
  → Llenar términos (duración, precio, condiciones)
  → Preview del contrato
  → Enviar a contraparte
  → Contraparte revisa → acepta / sugiere cambios / rechaza
  → Si ambos aceptan → firma digital (checkbox + timestamp + IP)
  → Contrato guardado → descargable en PDF
```

---

## 7. Roadmap Técnico

### Semana 1-2: Fundación
- [ ] Setup del proyecto (Next.js, Supabase, TailwindCSS, shadcn/ui)
- [ ] Configurar Supabase: auth, database schema, storage
- [ ] Landing page
- [ ] Sistema de autenticación (email + Google)
- [ ] Perfil de usuario (crear, editar)

### Semana 3-4: Core del Marketplace
- [ ] CRUD de publicaciones (formulario por tipo de actor)
- [ ] Upload de imágenes a Supabase Storage
- [ ] Feed/explorar con cards
- [ ] Página de detalle con botones de contactar (WhatsApp / correo)
- [ ] Búsqueda con filtros
- [ ] Perfiles públicos

### Semana 5-6: Stats + Polish
- [ ] Tracking de vistas por publicación
- [ ] Tracking de clics en botón de contactar
- [ ] Dashboard con stats básicas por publicación
- [ ] Favoritos
- [ ] Responsive/mobile optimization
- [ ] Loading, error, empty states

### Semana 7-8: Polish + Deploy MVP
- [ ] SEO básico
- [ ] Notificaciones por email (Resend) — bienvenida, nuevo contacto
- [ ] Testing y bug fixes
- [ ] Deploy a producción (Vercel)

### Semana 9-10: IA + Pagos (V1)
- [ ] Integración Claude API para búsqueda semántica
- [ ] pgvector para embeddings
- [ ] Barra de búsqueda inteligente (input libre + resultados rankeados)
- [ ] Stripe: planes de suscripción (Free / Pro / Agency)
- [ ] Stripe: cobro por publicaciones adicionales y boost
- [ ] Portal de facturación

### Semana 11-12: Contratos + Verificación (V1)
- [ ] Templates de contratos digitales
- [ ] Flujo de envío, revisión y firma de contratos
- [ ] Generación de PDF de contratos
- [ ] Verificación de usuarios (badge)
- [ ] Publicaciones destacadas (boost)

### Semana 13-14: Iteración
- [ ] Mejoras basadas en feedback de usuarios
- [ ] Optimizaciones de performance

### Futuro (según demanda)
- [ ] Mensajería interna
- [ ] Analytics avanzados
- [ ] Reviews y ratings
- [ ] App móvil
- [ ] API pública
- [ ] Expansión de métodos de pago locales

---

**Autor:** Cesar Emilio Castaño Marin
**Última actualización:** 3 de abril de 2026 (v5 — interacciones cerradas, i18n, dark hero)
