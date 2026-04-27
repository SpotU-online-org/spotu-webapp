# SpotU — Pitch

> **"Tu spot publicitario ideal"**
> El marketplace que conecta anunciantes, espacios publicitarios y agencias de marketing en un solo lugar.

---

## El problema

La publicidad fuera de los gigantes digitales (Google, Meta) es un mercado fragmentado para el segmento SMB.

Un restaurante en Monterrey que quiere poner su anuncio en la pantalla LED de una cancha de fútbol normalmente termina llamando, preguntando y negociando uno por uno. Del otro lado, el dueño de esa pantalla suele tener capacidad ociosa que le cuesta llenar sin un canal de distribución claro.

Y las agencias de marketing que gestionan campañas para múltiples clientes enfrentan algo similar: aunque existen directorios para encontrarlas (Sortlist, Clutch), no hay una plataforma que las conecte simultáneamente con anunciantes y con espacios publicitarios independientes.

**El ecosistema LATAM tiene plataformas programáticas (PRODOOH, Hivestack, MiQ+Adsmovil) y publishers tradicionales (Publimovil, Latam Outdoor), pero están orientadas al segmento enterprise. Para el SMB que quiere pautar $200-$2,000 USD en un espacio local o regional, la experiencia sigue siendo manual.**

---

## La solución: SpotU

SpotU es el **marketplace de publicidad de 3 lados**. Conectamos tres tipos de actores en una plataforma simple y directa:

1. **Anunciantes ↔ Espacios publicitarios** — empresas encuentran y contratan espacios (físicos y digitales); dueños de espacios encuentran anunciantes
2. **Agencias de marketing ↔ Anunciantes** — agencias ofrecen servicios profesionales; empresas encuentran expertos que gestionen sus campañas
3. **Agencias de marketing ↔ Espacios publicitarios** — agencias buscan y gestionan espacios en nombre de sus clientes

---

## Estado actual: MVP en producción

SpotU no es una idea — es un producto funcionando.

**Lanzado en:** [spotu.online](https://spotu.online)

**Qué ya funciona hoy:**
- Registro y autenticación (email + Google OAuth)
- Publicación de espacios, agencias y solicitudes de anunciantes
- Feed de búsqueda con filtros (tipo, país, keyword)
- Detalle de publicación con contacto directo (WhatsApp + correo)
- Perfil público de cada usuario
- Dashboard con estadísticas (vistas y contactos por publicación)
- Favoritos
- Pagos con Stripe (suscripciones, trial 30 días, boost)
- Programa de pioneros (primeros 250 usuarios, 1 año gratis)
- Emails transaccionales (bienvenida, expiración pionero)
- Políticas legales (privacidad y términos)
- Dominio propio: `spotu.online`

---

## Cómo funciona SpotU

### 1. Te registras y eliges tu rol
Entras a SpotU, creas tu cuenta y seleccionas quién eres:
- **"Quiero anunciarme"** — eres una empresa o persona que busca dónde pautar
- **"Tengo un espacio publicitario"** — tienes una valla, pantalla, sitio web, podcast, red social, etc.
- **"Soy agencia de marketing"** — ofreces servicios de marketing y buscas clientes o espacios

### 2. Publicas tu oferta o buscas directamente

**Si tienes un espacio publicitario** (obligatorio publicar):
Creas tu listing con tipo de espacio, descripción, fotos, audiencia, precio y datos de contacto.

**Si eres agencia de marketing** (obligatorio publicar):
Publicas tus servicios, mercados donde operas y datos de contacto.

**Si quieres anunciarte** (publicar es opcional):
Tu flujo principal es **buscar y contactar directamente**. Opcionalmente puedes publicar una "solicitud de cotización" para que los proveedores te contacten a ti.

### 3. Exploras y contactas
Navegas el feed o buscas por keyword/filtros. Cada publicación tiene botones de **WhatsApp** y **correo** para contacto inmediato.

### 4. Stats básicas
Cada dueño de publicación ve cuántas personas vieron su publicación y cuántas presionaron el botón de contactar.

---

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

---

## Modelo de negocio

### Tarifa actual (Fase 1)

| Tipo de usuario | Suscripción mensual | Boost semanal |
|---|---|---|
| Espacios / Anunciantes | $4.99 USD/mes por publicación | $2.99 USD/sem |
| Agencias | $9.99 USD/mes por publicación | $4.99 USD/sem |

- **Primera publicación:** 30 días gratis (con tarjeta), después cobro automático
- **Pioneros (primeros 250 usuarios):** 1 año completamente gratis

### Evolución de revenue (Fase 2)
- Plan Pro: $14.99/mes (publicaciones ilimitadas, contratos digitales, badge verificado)
- Plan Agency: $49.99/mes (todo Pro + perfil de agencia, portafolio, gestión multi-cliente)

### Futuro (Fase 3, según demanda)
- Comisión 5-8% sobre transacciones cerradas en plataforma
- Analytics avanzados, herramientas SaaS

---

## Posicionamiento vs el ecosistema

SpotU coexiste con un ecosistema activo. Nuestra propuesta no es reemplazar a los jugadores existentes — es atender un segmento subatendido con un enfoque diferente.

| Característica | SpotU | Programmatic enterprise (PRODOOH, Hivestack, MiQ) | Publishers tradicionales (Publimovil, Latam Outdoor) | Directorios de agencias (Sortlist, Clutch) |
|---|---|---|---|---|
| Marketplace de 3 lados (anunciantes + espacios + agencias) | ✓ | Anunciantes + espacios | Vende su propio inventario | Solo agencias |
| Espacios físicos + digitales independientes | ✓ | Principalmente DOOH | Solo OOH propio | No incluye espacios |
| Accesible para SMBs ($4.99–$9.99/mes) | ✓ | Mínimos enterprise | Tarifas por campaña | Suscripción para agencias |
| Contacto directo (WhatsApp/correo) | ✓ | RFP / contratos | Comercial directo | RFP |
| Foco en LATAM + hispano USA | ✓ | LATAM amplio | LATAM regional | Global |

Ver [market_study.md](market_study.md) para un análisis competitivo completo.

---

## Por qué las agencias son clave

Las agencias y agentes de marketing son un **multiplicador natural** del marketplace:
- **Traen volumen:** una agencia con 10 clientes = 10 anunciantes potenciales con un solo onboarding
- **Profesionalizan la demanda:** campañas mejor estructuradas → mejores contratos → más valor para todos
- **Crean stickiness:** una agencia que opera su negocio dentro de SpotU no se va fácilmente
- **Nuevo revenue stream:** plan premium de agencia + comisiones futuras

---

## Roadmap próximos 6 meses

| Hito | Timeline |
|------|----------|
| Primeros 250 usuarios activos (3 mercados) | Mes 1-2 |
| Búsqueda semántica con IA (Claude API) | Mes 2-3 |
| Contratos digitales | Mes 3-4 |
| $500 MRR | Mes 3-4 |
| $2,000 MRR | Mes 5-6 |

---

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|-----------|
| Cold start (sin oferta ni demanda) | Llenar oferta manualmente, lanzar por ciudad. Onboardear agencias que traen múltiples clientes |
| Desintermediación | Contratos digitales, stats y boost crean valor dentro de la plataforma |
| Coexistencia con jugadores enterprise | Atender la franja SMB que ellos no atienden, integrar 3 lados |
| Necesidad de complementar el equipo | Búsqueda activa de socios con perfil comercial/growth y red en agencias |

---

## El equipo

**Cesar Emilio Castaño Marin** — Fundador
Lidera visión, producto y estrategia. Construyó el MVP completo: plataforma en producción con autenticación, publicaciones, pagos Stripe, emails transaccionales y dominio propio.

**Tomás Ossa Cárdenas** — Ingeniero de Software en Jefe
Socio de Cesar en *Smash Vision* y co-fundador técnico de SpotU. Lidera arquitectura, escalabilidad y la integración de las funcionalidades de Fase 2 (IA + contratos digitales).

> El reparto de equity entre los miembros del equipo aún no está formalmente definido — se acordará junto a los nuevos socios que se sumen al proyecto.

**Buscamos sumar:**
- Perfil con experiencia en growth/ventas o agencias de publicidad
- Red de contactos en alguno de los mercados objetivo (Colombia, N. México, Florida)
- Disposición a operar hands-on en los primeros meses
- Eventualmente, capital de arranque para acelerar onboarding y marketing inicial

Ver [team.md](team.md) para detalle completo del equipo y perfiles que buscamos.

---

## Costos operativos actuales

| Servicio | Costo mensual |
|----------|--------------|
| Supabase | $0 - $25 |
| Vercel Pro (requerido para uso comercial) | $20 |
| Claude API (IA, Fase 2) | ~$20-50 |
| Resend (emails) | $0 - $20 |
| Stripe | 2.9% + $0.30 por transacción |
| Dominio | ~$15/año |
| **Total estimado** | **~$70-$140/mes** |

---

## Preguntas frecuentes

### ¿Qué pasa si la gente se contacta por WhatsApp y no vuelve a usar SpotU?

El valor de SpotU está en generar el match, no en retener la conversación. El usuario vuelve cada vez que necesita un nuevo espacio, una nueva agencia o un nuevo cliente. Los contratos digitales (Fase 2), las stats y el boost generan retorno recurrente.

### ¿Por qué cobrar suscripción y no comisión?

En las fases iniciales no controlamos la transacción (el pago ocurre fuera de la plataforma). La comisión además incentiva la desintermediación. La suscripción es predecible para el usuario y para nosotros. En Fase 3, con volumen, agregamos pagos en plataforma y ahí sí tiene sentido cobrar comisión.

### ¿Cómo resuelven el cold start?

1. Lanzar por ciudad, no por país
2. Llenar la oferta manualmente primero
3. Onboardear agencias temprano (una agencia = múltiples clientes)
4. Los anunciantes no necesitan publicar — con suficientes espacios listados encuentran valor inmediato
5. Primera publicación gratis por 30 días

### ¿Por qué 3 mercados tan diferentes?

Si funciona en Colombia, México y Florida simultáneamente, tenemos evidencia fuerte de product-market fit. El mercado hispano conecta los tres puntos. Cobrar en USD simplifica operaciones desde el inicio.

---

**Contacto:** admin@spotu.online
**Sitio:** [spotu.online](https://spotu.online)
**Última actualización:** Abril 2026
