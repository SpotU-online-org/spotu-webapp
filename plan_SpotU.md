# SpotU — Plan Completo

## 1. Visión General

SpotU es un marketplace de publicidad que conecta **tres tipos de actores**: anunciantes, dueños de espacios publicitarios (físicos y digitales) y **agencias/agentes de marketing**. La plataforma centraliza la oferta y demanda de espacios publicitarios y servicios de marketing, facilitando el descubrimiento mediante IA y simplificando la negociación entre partes.

### Conexiones del marketplace (3 lados)
1. **Anunciantes ↔ Espacios publicitarios** — empresas encuentran y contratan espacios; dueños de espacios encuentran anunciantes
2. **Agencias de marketing ↔ Anunciantes** — agencias ofrecen servicios profesionales; empresas encuentran expertos que gestionen sus campañas
3. **Agencias de marketing ↔ Espacios publicitarios** — agencias buscan y gestionan espacios en nombre de sus clientes

**Mercados objetivo inicial:** Colombia, norte de México (Monterrey, Chihuahua) y Florida (USA).

---

## 2. Modelo de Negocio

### Todos los cobros en USD

### Fase 1 — MVP (Freemium con límites)
| Concepto | Precio |
|----------|--------|
| Primera publicación | **GRATIS** (primeros 100 usuarios por mercado) |
| Publicaciones adicionales | **$4.99 USD/mes** cada una |
| Publicación destacada (boost) | **$2.99 USD/semana** |

### Fase 2 — V1 (Planes de suscripción)
| Plan | Precio | Incluye |
|------|--------|---------|
| **Free** | $0 | 1 publicación activa, búsqueda básica, mensajes limitados (10/mes) |
| **Pro** | $14.99 USD/mes | Publicaciones ilimitadas, analytics de interacción, badge verificado, posicionamiento prioritario, contratos digitales, mensajes ilimitados |
| **Business** | $39.99 USD/mes | Todo Pro + API access, analytics avanzados, soporte prioritario, múltiples usuarios por cuenta |
| **Agency** | $79.99 USD/mes | Todo Business + dashboard multi-cliente, portafolio de servicios público, leads prioritarios de anunciantes, branding de agencia, gestión de campañas para clientes, reportes consolidados |

### Fase 3 — Escala
- Comisión del 5-8% sobre transacciones cerradas en plataforma (cuando se habiliten pagos entre partes)
- Comisión por referral de agencia: 3-5% sobre contratos cerrados a través de agencias
- Herramientas SaaS de gestión de campañas
- Marketplace de servicios de marketing (agencias publican servicios, empresas contratan)
- API para integración programática

### Métodos de pago aceptados
- **Stripe** como procesador principal
  - Tarjeta de crédito / débito (Visa, Mastercard, Amex)
  - Apple Pay / Google Pay (vía Stripe)
- Consideración futura: PSE (Colombia), OXXO (México) vía Stripe local payment methods

### Promoción de lanzamiento
- Primeros 100 usuarios por mercado: primera publicación gratis de por vida
- Referral program: invita a un usuario → 1 mes de boost gratis
- Agencias: primer mes gratis del plan Agency para agencias que traigan 5+ clientes

---

## 3. Fases de Desarrollo

### FASE 1: MVP (6-8 semanas)

**Objetivo:** Validar que existe demanda real conectando anunciantes con espacios.

**Features:**
- Autenticación (email + Google) via Supabase Auth
- Registro con selección de rol: "Quiero anunciarme" / "Tengo espacio publicitario" / "Soy agencia de marketing" / "Ambos"
- CRUD completo de publicaciones
  - Tipo: "Quiero anunciarme", "Tengo espacio publicitario" o "Ofrezco servicios de marketing"
  - Campos: título, descripción, tipo de espacio, ubicación, precio estimado, audiencia, fotos
- Búsqueda con filtros (ciudad, tipo de espacio, rango de precio, audiencia)
- Feed/explorar publicaciones con cards
- Página de detalle de publicación
- Perfiles públicos de usuario/empresa
- Sistema de contacto: botón "Contactar" → mensaje interno
- Inbox básico (lista de conversaciones + chat simple)
- Landing page con propuesta de valor
- Responsive / mobile-first

**No incluye en MVP:**
- Pagos
- IA
- Analytics
- Contratos

---

### FASE 2: V1 (4-6 semanas post-MVP)

**Objetivo:** Monetizar y agregar valor diferenciado con IA y herramientas pro.

**Features:**

#### Búsqueda con IA (matching semántico)
- Input inteligente: "Quiero anunciar un evento deportivo en Monterrey con bajo presupuesto"
- Claude API interpreta intención, filtra y rankea resultados
- Embeddings con pgvector para búsqueda semántica
- Recomendaciones personalizadas en el feed

#### Sistema de pagos (Stripe)
- Integración con Stripe Checkout
- Planes de suscripción (Free / Pro / Business)
- Cobro por publicaciones adicionales
- Publicaciones destacadas (boost)
- Portal de facturación del cliente
- Métodos: tarjeta, Apple Pay, Google Pay

#### Analytics de interacción (Pro)
- Dashboard por publicación:
  - Vistas totales y únicas
  - Contactos recibidos
  - Tasa de conversión (vista → contacto)
  - Gráficas de tendencia (últimos 7, 30, 90 días)
- Dashboard general del usuario:
  - Resumen de todas las publicaciones
  - Publicación con mejor rendimiento
  - Comparativa entre publicaciones

#### Contratos digitales entre partes (Pro)
- Templates de contrato predefinidos:
  - Contrato de alquiler de espacio publicitario
  - Acuerdo de campaña publicitaria
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
- Email via Resend: nuevo mensaje, nuevo contacto, contrato pendiente
- Notificaciones in-app (bell icon)

#### Plataforma para agencias (Agency)
- Perfil de agencia con portafolio de servicios (diseño, media buying, gestión de campañas, etc.)
- Dashboard multi-cliente: gestionar campañas de múltiples clientes desde una cuenta
- Feed de leads: ver anunciantes que buscan ayuda profesional o que coincidan con los servicios de la agencia
- Publicación de servicios con pricing, casos de éxito y áreas de especialización
- Sistema de propuestas: enviar propuestas de servicio a anunciantes directamente
- Reportes consolidados: analytics agrupados por cliente
- Branding personalizado: logo y colores de agencia en propuestas y contratos

#### Verificación de usuarios
- Badge "Verificado" para usuarios que confirmen identidad/empresa
- Badge "Agencia Verificada" para agencias que confirmen registro legal
- Proceso manual inicial (subir documento → admin aprueba)

---

### FASE 3: Escala (ongoing, post-validación)

**Features:**
- Pagos entre partes vía plataforma (escrow con Stripe Connect)
- App móvil nativa (React Native)
- API pública para integración programática
- Analytics avanzados (heatmaps geográficos, benchmarks de industria)
- Reviews y ratings entre partes (incluyendo calificación de agencias)
- Marketplace de servicios de agencias (búsqueda y contratación directa)
- Sistema de referral para agencias (comisión por contratos cerrados)
- White-label para agencias premium (plataforma con branding propio)
- Publicidad programática (automatización de compra/venta)
- Multi-idioma (español / inglés / portugués)
- Expansión a nuevos mercados
- Contratos con firma electrónica avanzada (integración con DocuSign o similar)

---

## 4. Arquitectura Técnica

### Stack
| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14+ (App Router), React 18+, TypeScript |
| Styling | TailwindCSS + shadcn/ui |
| Backend | Supabase (PostgreSQL, Auth, Storage, Realtime, Edge Functions) |
| IA | Claude API (búsqueda semántica, matching) |
| Pagos | Stripe (Checkout, Billing, Connect futuro) |
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
│  ├── /listing/[id] (detalle)                 │
│  ├── /inbox (mensajes)                       │
│  ├── /profile/[id] (perfil público)          │
│  ├── /dashboard (mi panel + analytics)       │
│  ├── /contracts (contratos digitales)        │
│  ├── /agency/[id] (perfil público agencia)  │
│  ├── /agency/dashboard (panel de agencia)   │
│  └── /search (búsqueda con IA)              │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│               SUPABASE                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │   Auth   │ │ Database │ │ Storage  │    │
│  │          │ │(Postgres)│ │ (images) │    │
│  └──────────┘ └──────────┘ └──────────┘    │
│  ┌──────────┐ ┌──────────┐                  │
│  │Realtime  │ │  Edge    │                  │
│  │(mensajes)│ │Functions │                  │
│  └──────────┘ └──────────┘                  │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│              SERVICIOS EXTERNOS              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │Claude API│ │  Stripe  │ │ Resend   │    │
│  │(matching)│ │ (pagos)  │ │ (emails) │    │
│  └──────────┘ └──────────┘ └──────────┘    │
└─────────────────────────────────────────────┘
```

### Modelo de Base de Datos

```sql
-- Usuarios (extiende auth.users de Supabase)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  type TEXT CHECK (type IN ('advertiser', 'space_owner', 'agency', 'both')),
  display_name TEXT NOT NULL,
  company_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  phone TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'MX',
  is_verified BOOLEAN DEFAULT FALSE,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business', 'agency')),
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
    'campaign_management', 'creative_design', 'media_buying',
    'social_media_management', 'seo_sem', 'branding',
    'other'
  )),

  -- Ubicación
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'MX',
  latitude DECIMAL,
  longitude DECIMAL,

  -- Comercial
  price_min DECIMAL,
  price_max DECIMAL,
  price_currency TEXT DEFAULT 'USD',
  price_period TEXT CHECK (price_period IN ('day', 'week', 'month', 'campaign')),

  -- Audiencia
  audience_size INTEGER,
  audience_description TEXT,
  audience_demographics JSONB,

  -- Media
  images TEXT[],
  video_url TEXT,

  -- Estado
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'expired')),
  is_featured BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  contacts_count INTEGER DEFAULT 0,

  -- IA (V1)
  embedding VECTOR(1536),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics de interacción (V1 - Pro)
CREATE TABLE listing_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES profiles(id),
  viewer_ip TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE listing_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  contactor_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversaciones y mensajes
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id),
  participant_1 UUID REFERENCES profiles(id),
  participant_2 UUID REFERENCES profiles(id),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contratos digitales (V1 - Pro)
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  listing_id UUID REFERENCES listings(id),
  creator_id UUID REFERENCES profiles(id),
  counterpart_id UUID REFERENCES profiles(id),
  template_type TEXT CHECK (template_type IN ('space_rental', 'campaign_agreement', 'custom')),
  title TEXT NOT NULL,
  terms JSONB NOT NULL,
  -- { duration, price, conditions, deliverables, etc. }
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

CREATE TABLE contract_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  revised_by UUID REFERENCES profiles(id),
  changes JSONB NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favoritos
CREATE TABLE favorites (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, listing_id)
);

-- Suscripciones / pagos
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'pro', 'business', 'agency')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agencias (perfil extendido para agencias de marketing)
CREATE TABLE agency_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  agency_name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  services TEXT[] NOT NULL, -- ['campaign_management', 'creative_design', 'media_buying', ...]
  specializations TEXT[], -- ['sports', 'real_estate', 'food_beverage', ...]
  portfolio_url TEXT,
  case_studies JSONB, -- [{ title, description, results, images }]
  team_size INTEGER,
  years_experience INTEGER,
  markets TEXT[], -- ['CO', 'MX', 'US']
  is_verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Relación agencia-cliente (gestión multi-cliente)
CREATE TABLE agency_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES agency_profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'inactive')),
  permissions JSONB DEFAULT '{"manage_listings": true, "view_analytics": true, "create_contracts": false}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agency_id, client_id)
);

-- Propuestas de servicio (agencia → anunciante)
CREATE TABLE service_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES agency_profiles(id) ON DELETE CASCADE,
  advertiser_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id), -- listing del anunciante que motivó la propuesta
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  services_offered TEXT[],
  price_estimate_min DECIMAL,
  price_estimate_max DECIMAL,
  timeline TEXT,
  status TEXT DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_listings_type ON listings(type);
CREATE INDEX idx_listings_space_type ON listings(space_type);
CREATE INDEX idx_listings_city ON listings(city);
CREATE INDEX idx_listings_country ON listings(country);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_embedding ON listings USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_listing_views_listing ON listing_views(listing_id);
CREATE INDEX idx_listing_views_date ON listing_views(created_at);
CREATE INDEX idx_listing_contacts_listing ON listing_contacts(listing_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_conversations_participants ON conversations(participant_1, participant_2);
CREATE INDEX idx_contracts_participants ON contracts(creator_id, counterpart_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_agency_profiles_user ON agency_profiles(user_id);
CREATE INDEX idx_agency_clients_agency ON agency_clients(agency_id);
CREATE INDEX idx_agency_clients_client ON agency_clients(client_id);
CREATE INDEX idx_service_proposals_agency ON service_proposals(agency_id);
CREATE INDEX idx_service_proposals_advertiser ON service_proposals(advertiser_id);
CREATE INDEX idx_service_proposals_status ON service_proposals(status);
```

### Roles de usuario
| Rol | Permisos |
|-----|----------|
| **Visitante** | Ver listings públicos, buscar, ver landing |
| **Anunciante (Free)** | 1 publicación "quiero anunciarme", 10 mensajes/mes, búsqueda básica |
| **Dueño de espacio (Free)** | 1 publicación "tengo espacio", 10 mensajes/mes, búsqueda básica |
| **Agencia (Free)** | 1 publicación "ofrezco servicios", 10 mensajes/mes, búsqueda básica, perfil de agencia básico |
| **Both (Free)** | 1 publicación de cada tipo, 10 mensajes/mes |
| **Pro** | Publicaciones ilimitadas, analytics, contratos digitales, mensajes ilimitados, badge verificado |
| **Business** | Todo Pro + API, multi-usuario, analytics avanzados, soporte prioritario |
| **Agency** | Todo Business + dashboard multi-cliente, portafolio público, leads prioritarios, propuestas de servicio, reportes consolidados, branding personalizado |
| **Admin** | Todo + moderar, verificar usuarios/agencias, analytics globales, gestión de contratos |

---

## 5. Flujos UX Principales

### Registro
```
Landing → CTA "Publica gratis"
  → Seleccionar: "Quiero anunciarme" / "Tengo espacio" / "Soy agencia de marketing" / "Ambos"
  → Sign up (Google o email)
  → Completar perfil (nombre, empresa, ciudad, país)
  → Si agencia: completar perfil de agencia (servicios, especialización, portafolio)
  → Onboarding: crear primera publicación (guiado)
  → Feed personalizado
```

### Publicación
```
Dashboard → "Nueva publicación"
  → Paso 1: Tipo (anunciarme / tengo espacio)
  → Paso 2: Info básica (título, descripción, tipo de espacio)
  → Paso 3: Ubicación y audiencia
  → Paso 4: Precio y disponibilidad
  → Paso 5: Fotos/videos
  → Preview → Publicar
  → Confirmación + opción de compartir
```

### Búsqueda (V1 con IA)
```
Feed / Barra de búsqueda
  → Input libre: "pantalla LED en Monterrey para evento deportivo"
  → IA interpreta → resultados rankeados por relevancia
  → Filtros laterales (tipo, ciudad, país, precio, audiencia)
  → Cards con preview
  → Click → Detalle completo
  → "Contactar" → Mensaje directo
```

### Contacto
```
Detalle de listing → "Contactar"
  → Modal: mensaje inicial
  → Se crea conversación
  → Inbox: lista de conversaciones
  → Chat simple (texto)
  → Notificación por email al receptor
```

### Contratos (V1 - Pro)
```
Conversación → "Crear contrato"
  → Seleccionar template (alquiler de espacio / campaña / custom)
  → Llenar términos (duración, precio, condiciones)
  → Preview del contrato
  → Enviar a contraparte
  → Contraparte revisa → acepta / sugiere cambios / rechaza
  → Si ambos aceptan → firma digital (checkbox + timestamp + IP)
  → Contrato guardado → descargable en PDF
  → Notificación de vencimiento cuando aplique
```

### Analytics (V1 - Pro)
```
Dashboard → "Analytics"
  → Vista general: total vistas, contactos, tasa de conversión
  → Por publicación: gráficas de tendencia
  → Comparativa entre publicaciones
  → Exportar datos (CSV)
```

### Flujo de Agencia (V1 - Agency)
```
Dashboard de agencia → Vista multi-cliente
  → Lista de clientes vinculados
  → Agregar cliente (invitar por email o vincular cuenta existente)
  → Por cliente: ver publicaciones, analytics, contratos
  → "Explorar leads" → feed de anunciantes buscando ayuda
  → "Enviar propuesta" → seleccionar servicios, precio, timeline
  → Anunciante recibe propuesta → acepta / rechaza / negocia
  → Si acepta → se crea conversación + se vincula como cliente
  → Reportes consolidados: performance de todos los clientes
```

### Portafolio de agencia (público)
```
Perfil público de agencia → /agency/[id]
  → Logo, nombre, descripción, años de experiencia
  → Servicios ofrecidos con pricing estimado
  → Casos de éxito / portafolio
  → Reviews y calificación
  → Mercados donde opera
  → CTA: "Solicitar propuesta" / "Contactar"
```

---

## 6. Roadmap Técnico

### Semana 1-2: Fundación
- [ ] Setup del proyecto (Next.js, Supabase, TailwindCSS, shadcn/ui)
- [ ] Configurar Supabase: auth, database schema, storage
- [ ] Landing page
- [ ] Sistema de autenticación (email + Google)
- [ ] Perfil de usuario (crear, editar)

### Semana 3-4: Core del Marketplace
- [ ] CRUD de publicaciones (formulario multi-paso)
- [ ] Upload de imágenes a Supabase Storage
- [ ] Feed/explorar con cards
- [ ] Página de detalle de listing
- [ ] Búsqueda con filtros básicos
- [ ] Perfiles públicos

### Semana 5-6: Comunicación
- [ ] Sistema de mensajería (conversaciones + mensajes)
- [ ] Inbox con lista de conversaciones
- [ ] Notificaciones por email (Resend)
- [ ] Favoritos

### Semana 7-8: Polish MVP
- [ ] Responsive/mobile optimization
- [ ] Loading, error, empty states
- [ ] SEO básico
- [ ] Testing y bug fixes
- [ ] Deploy a producción (Vercel)

### Semana 9-10: IA + Pagos (V1)
- [ ] Integración Claude API para búsqueda semántica
- [ ] pgvector para embeddings
- [ ] Stripe: planes de suscripción
- [ ] Stripe: cobro por publicaciones adicionales
- [ ] Portal de facturación

### Semana 11-12: Analytics + Contratos (V1)
- [ ] Tracking de vistas y contactos
- [ ] Dashboard de analytics por publicación
- [ ] Templates de contratos digitales
- [ ] Flujo de envío, revisión y firma de contratos
- [ ] Generación de PDF de contratos
- [ ] Notificaciones de contratos

### Semana 13-14: Plataforma de Agencias (V1)
- [ ] Perfil de agencia (CRUD, portafolio, servicios)
- [ ] Tipo de publicación "ofrezco servicios de marketing"
- [ ] Dashboard multi-cliente para agencias
- [ ] Sistema de propuestas de servicio
- [ ] Vinculación agencia-cliente
- [ ] Perfil público de agencia (/agency/[id])
- [ ] Plan de suscripción Agency en Stripe

### Semana 15+: Iteración
- [ ] Verificación de usuarios y agencias
- [ ] Publicaciones destacadas (boost)
- [ ] Reviews y ratings (incluyendo agencias)
- [ ] Reportes consolidados para agencias
- [ ] Optimización de IA
- [ ] Expansión de métodos de pago locales
- [ ] Marketplace de servicios de agencias

---

**Autor:** Cesar Emilio Castaño Marin
**Última actualización:** 1 de abril de 2026 (v2 — integración de agencias de marketing)
