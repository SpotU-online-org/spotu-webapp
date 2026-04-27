# SpotU — Modelo de Negocio

> Cómo SpotU genera valor para sus usuarios y cómo monetiza ese valor.

---

## La propuesta de valor

SpotU no vende publicidad. SpotU **conecta** a quienes tienen espacios publicitarios con quienes los necesitan, y a ambos con las agencias que los pueden ayudar. A diferencia de plataformas programáticas (PRODOOH, Hivestack) o publishers tradicionales (Publimovil) que están orientadas al segmento enterprise, el foco de SpotU es el SMB.

- **Para dueños de espacios:** visibilidad ante cientos de anunciantes potenciales sin tener que buscarlos uno por uno.
- **Para anunciantes:** acceso a espacios que de otra forma tomaría semanas encontrar, comparar y negociar.
- **Para agencias:** una plataforma donde ofrecer servicios a anunciantes que necesitan ayuda, y donde encontrar espacios para sus clientes.

**SpotU cobra por dar visibilidad y por ser el punto de encuentro — no por la transacción en sí.**

---

## Estructura de precios actual (Fase 1)

### Suscripciones por publicación activa

| Tipo de usuario | Precio mensual | Boost semanal |
|---|---|---|
| Espacio publicitario | $4.99 USD/mes | $2.99 USD |
| Anunciante (publicar solicitud) | $4.99 USD/mes | $2.99 USD |
| Agencia de marketing | $9.99 USD/mes | $4.99 USD |

- **Suscripción:** cobro mensual recurrente por cada publicación activa.
- **Boost:** pago único (no recurrente) que posiciona la publicación al tope del feed durante 7 días.

### Incentivos de adopción

**Primera publicación — trial 30 días:**
- Cualquier usuario nuevo puede activar su primera publicación con 30 días gratis.
- Se requiere tarjeta de crédito, pero no se cobra hasta el día 30.
- Si el usuario desactiva antes del día 30, no se cobra nada.

**Programa de pioneros (primeros 250 usuarios):**
- Los primeros 250 usuarios registrados tienen **1 año de publicaciones completamente gratuitas**.
- Sin tarjeta requerida, sin cobro.
- Al vencer el año, se cobran las tarifas normales.
- Objetivo: generar tracción inicial y embajadores de la plataforma.

---

## Evolución del modelo (Fase 2 — planes de suscripción)

Una vez validado el marketplace, el modelo evoluciona a planes:

| Plan | Precio | Para quién |
|------|--------|-----------|
| **Básico** | $4.99/mes por publicación | Usuarios con pocas publicaciones |
| **Pro** | $14.99/mes | Publicaciones ilimitadas + contratos digitales + badge verificado |
| **Agency** | $49.99/mes | Todo Pro + perfil de agencia + portafolio + gestión multi-cliente |

### Por qué planes y no per-publicación en Fase 2

- **Para el usuario:** un precio fijo predecible es más fácil de presupuestar que "pago por cada publicación".
- **Para SpotU:** el ARPU (ingreso promedio por usuario) crece significativamente al pasar de per-publicación a plan mensual.
- **Incentivo de uso:** con plan Pro, el usuario tiene incentivo de publicar más — más publicaciones = más valor para todos.

---

## Por qué suscripción y no comisión

Esta es la pregunta más común. La razón es simple:

**En las fases iniciales, SpotU no puede cobrar comisión** porque:
1. La transacción ocurre fuera de la plataforma (el anunciante y el espacio se ponen de acuerdo por WhatsApp/correo y pagan como quieran — transferencia, efectivo, factura).
2. SpotU no puede rastrear ni verificar que la transacción ocurrió.
3. La comisión incentiva la desintermediación: si las partes saben que cobraremos 5% al cerrar, harán la transacción "en paralelo" fuera de SpotU.

**La suscripción es honesta y alineada con el valor:**
- Pagás por visibilidad (que tu publicación sea vista).
- No pagás por el resultado (eso depende de tu publicación y precio).
- Es un costo bajo y fijo, fácil de justificar si recibes aunque sea 1-2 contactos al mes.

**En Fase 3**, cuando tengamos volumen, podemos agregar pagos entre partes dentro de la plataforma (escrow con Stripe) y ahí sí cobra comisión. Pero no antes de validar el marketplace.

---

## Unit economics

### Por publicación activa (Fase 1)

| Métrica | Espacio/Anunciante | Agencia |
|---------|-------------------|---------|
| Ingreso mensual | $4.99 | $9.99 |
| Costo de Stripe (2.9% + $0.30) | ~$0.44 | ~$0.59 |
| **Margen bruto por publicación** | **~$4.55** | **~$9.40** |

Costos de infraestructura por usuario son mínimos (centavos en base de datos y storage).

### Por agencia (Fase 2 — Plan Agency)

| Métrica | Valor |
|---------|-------|
| ARPU mensual | $49.99 |
| Costo Stripe | ~$1.75 |
| Margen bruto | ~$48.24 |
| LTV objetivo (12 meses) | ~$600 USD |
| CAC objetivo | < $30 USD |
| **LTV/CAC ratio** | **>20x** |

Las agencias tienen alta retención porque SpotU se vuelve parte de su flujo de trabajo. Una agencia que usa SpotU para gestionar las campañas de 5 clientes no se va fácilmente.

### Hitos de revenue proyectados

| Hito | Usuarios activos de pago | MRR estimado |
|------|--------------------------|-------------|
| Mes 2-3 | 50 | ~$300 |
| Mes 4-5 | 200 | ~$1,200 |
| Mes 6-8 | 500 | ~$3,000 |
| Mes 10-12 | 1,000 | ~$6,000 |
| Año 2 | 5,000 | ~$30,000 |

*Estimados conservadores asumiendo ARPU promedio de $6/mes.*

---

## Costos operativos

### Costos fijos mensuales (escala actual)

| Servicio | Costo |
|----------|-------|
| Supabase (base de datos, auth, storage) | $0-$25 |
| Vercel (hosting y deploy) | $0-$20 |
| Resend (emails transaccionales) | $0-$20 |
| Dominio y DNS | ~$1.25 (amortizado) |
| **Total infraestructura** | **< $70/mes** |

### Costos variables

| Servicio | Costo |
|----------|-------|
| Stripe | 2.9% + $0.30 por transacción |
| Claude API (búsqueda IA, Fase 2) | ~$0.01-0.05 por búsqueda |

**El modelo es altamente eficiente en capital:** los costos no crecen linealmente con los usuarios gracias al stack serverless (Supabase + Vercel).

---

## Punto de breakeven

Con los costos actuales (~$70/mes fijos + Stripe):
- **14-15 usuarios de pago** al mes son suficientes para cubrir costos de infraestructura.
- Cada usuario adicional tiene margen bruto >85%.

Esto significa que SpotU puede ser **rentable muy temprano** — incluso con tracción modesta.

---

## Métricas clave a monitorear

| Métrica | Por qué importa |
|---------|----------------|
| **MRR** (Monthly Recurring Revenue) | Ingreso base predecible |
| **Churn rate** | % de usuarios que cancelan por mes — mide valor percibido |
| **Trial to paid conversion** | % de trials que se convierten en pago — mide onboarding |
| **Boost attach rate** | % de usuarios que compran boost — segundo revenue stream |
| **ARPU** | Ingreso promedio por usuario — sube con planes Fase 2 |
| **CAC** | Costo de adquisición — objetivo < $10 orgánico |
| **LTV/CAC** | Salud del modelo — objetivo > 10x |

---

**Autor:** Cesar Emilio Castaño Marin
**Última actualización:** Abril 2026
