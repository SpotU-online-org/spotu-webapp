# SpotU — Pitch para Cofounders

## El problema

La publicidad fuera de los gigantes digitales (Google, Meta) es un mercado fragmentado y opaco.

Un restaurante en Monterrey que quiere poner su anuncio en la pantalla LED de una cancha de fútbol no tiene forma eficiente de encontrar ese espacio. Tiene que llamar, preguntar, negociar uno por uno. Del otro lado, el dueño de esa pantalla tiene capacidad ociosa que no sabe cómo llenar.

Lo mismo pasa con vallas publicitarias, pantallas en centros comerciales, espacios en podcasts, páginas web locales, influencers pequeños, y cientos de otros canales. **No existe un lugar centralizado donde oferta y demanda se encuentren.**

## La solución: SpotU

SpotU es el **marketplace de espacios publicitarios**. Conectamos a quienes quieren anunciarse con quienes tienen espacios disponibles — físicos y digitales — en una plataforma moderna, simple y asistida por inteligencia artificial. Además, integramos a **agencias y agentes de marketing** como un tercer actor clave del ecosistema.

**Para anunciantes:**
- Publica lo que necesitas ("Quiero anunciar un evento deportivo en Monterrey con bajo presupuesto")
- La IA te recomienda los mejores espacios disponibles
- Contacta directamente al dueño del espacio o a una agencia que gestione tu campaña
- Cierra contratos dentro de la plataforma

**Para dueños de espacios:**
- Publica tu espacio (pantalla, valla, red social, podcast, lo que sea)
- Anunciantes y agencias te encuentran y te contactan
- Ve estadísticas de quién ve tu espacio y quién te contacta
- Formaliza acuerdos con contratos digitales

**Para agencias y agentes de marketing:**
- Publica tu portafolio de servicios (gestión de campañas, diseño creativo, media buying, etc.)
- Encuentra anunciantes que buscan ayuda profesional para sus campañas
- Accede a un catálogo centralizado de espacios publicitarios para tus clientes
- Gestiona múltiples clientes y campañas desde una sola plataforma
- Genera leads calificados: empresas que ya están buscando publicidad activamente

## Mercado

### Tamaño
- Publicidad OOH (Out-of-Home) global: **$40B USD** (creciendo 5% anual)
- Publicidad digital LATAM: **$12B USD** (creciendo 15% anual)
- El segmento de publicidad fragmentada y no-programática es el menos atendido por tecnología

### Mercados iniciales
1. **Colombia** — economía digital en crecimiento, mercado publicitario activo
2. **Norte de México** (Monterrey, Chihuahua) — hub empresarial con alta inversión publicitaria
3. **Florida, USA** — mercado hispano grande, bridge entre LATAM y USA

### Por qué estos mercados
- Alta concentración de SMBs que invierten en publicidad local
- Mercado hispano conectado entre los tres puntos
- Baja competencia de plataformas similares
- Permite validar en tres contextos económicos diferentes simultáneamente

## Modelo de negocio

### Ingresos (en USD)

**Fase 1 — Validación:**
- Freemium: 1 publicación gratis, adicionales a $4.99/mes
- Boost de publicaciones: $2.99/semana

**Fase 2 — Crecimiento:**
- Plan Pro: $14.99/mes (analytics, contratos, publicaciones ilimitadas)
- Plan Business: $39.99/mes (API, multi-usuario, analytics avanzados)
- Plan Agency: $79.99/mes (gestión multi-cliente, dashboard de agencia, leads prioritarios, branding personalizado)

**Fase 3 — Escala:**
- Comisión 5-8% sobre transacciones en plataforma
- Comisión por referral de agencia: 3-5% sobre contratos cerrados a través de agencias
- Herramientas SaaS de gestión de campañas
- Marketplace de servicios de marketing (agencias ofrecen, empresas contratan)

### Unit economics objetivo (por usuario Pro)
- ARPU: ~$15 USD/mes
- CAC objetivo: < $10 USD (adquisición orgánica + referral)
- LTV objetivo: > $150 USD (10+ meses retención)

### Unit economics objetivo (por agencia)
- ARPU: ~$80 USD/mes (suscripción) + comisiones por transacciones
- CAC objetivo: < $30 USD (las agencias traen múltiples clientes → LTV alto)
- LTV objetivo: > $800 USD (retención alta por dependencia operativa)

## Diferenciadores

| SpotU | Competencia |
|-------|-------------|
| IA para matching semántico | Búsqueda manual por filtros |
| Espacios físicos + digitales | Solo uno de los dos |
| LATAM + hispano USA | Enfoque solo USA o solo Europa |
| Simple, mobile-first | Plataformas enterprise complejas |
| Contratos integrados | Negociación fuera de plataforma |
| Precio accesible para SMBs | Pricing enterprise |
| Marketplace 3 lados (anunciantes + espacios + agencias) | Solo 2 lados |

## Tecnología

- **Frontend:** Next.js (React) — web app responsive, PWA
- **Backend:** Supabase (PostgreSQL, Auth, Realtime)
- **IA:** Claude API para matching semántico
- **Pagos:** Stripe
- **Deploy:** Vercel

Stack moderno, bajo costo operativo, alta velocidad de iteración. Un equipo pequeño (2-3 personas) puede construir y operar el MVP.

### Por qué agencias

Las agencias y agentes de marketing son un **multiplicador natural** del marketplace:
- **Traen volumen:** una agencia con 10 clientes = 10 anunciantes potenciales con un solo onboarding
- **Profesionalizan la demanda:** campañas mejor estructuradas → mejores contratos → más valor para dueños de espacios
- **Reducen fricción:** empresas pequeñas que no saben cómo hacer publicidad encuentran en las agencias un intermediario experto
- **Crean stickiness:** una agencia que opera su negocio dentro de SpotU no se va fácilmente
- **Nuevo revenue stream:** plan premium de agencia + comisiones por intermediación

## Tracción / Plan

| Hito | Timeline |
|------|----------|
| MVP funcional (publicaciones, búsqueda, mensajes) | 8 semanas |
| Primeros 100 usuarios (3 mercados) | Semana 10-12 |
| V1 con IA, pagos, analytics, contratos | Semana 14-16 |
| 500 usuarios activos | Mes 4-5 |
| Revenue: $1,000 MRR | Mes 5-6 |
| Revenue: $5,000 MRR | Mes 8-10 |

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|-----------|
| Cold start (sin oferta ni demanda) | Llenar oferta manualmente, lanzar por ciudad. Onboardear agencias que traen múltiples clientes |
| Desintermediación (se van fuera de la plataforma) | Agregar valor continuo: analytics, contratos, pagos, gestión multi-cliente para agencias |
| Competencia de gigantes | Nicho diferente: espacios no-tradicionales + LATAM + marketplace 3 lados |
| Complejidad del tercer actor (agencias) | Fase gradual: primero anunciantes + espacios, luego agencias en V1 |

## Lo que buscamos en un cofounder

- Alguien con experiencia en **ventas/growth**, **producto/marketing** o **agencias de publicidad**
- Red de contactos en alguno de los mercados objetivo (especialmente con agencias de marketing)
- Disposición a operar hands-on en los primeros meses
- Visión a largo plazo: esto puede ser grande si lo ejecutamos bien

## El ask

SpotU no necesita mucho capital para empezar. Necesita ejecución. El stack es de bajo costo (Supabase + Vercel tienen tiers gratuitos generosos), y el equipo inicial puede ser de 2-3 personas.

Lo que necesitamos:
1. **Validar demanda** en los 3 mercados simultáneamente
2. **Construir MVP** en 8 semanas
3. **Llenar la oferta** manualmente (hablar con dueños de espacios)
4. **Iterar rápido** basado en feedback real

**La oportunidad es real, el timing es ahora, y la ejecución es lo que va a hacer la diferencia.**

---

**Autor:** Cesar Emilio Castaño Marin
**Última actualización:** 1 de abril de 2026 (v2 — integración de agencias de marketing)
