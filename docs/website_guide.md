# SpotU — Guía del sitio web

> Cómo funciona spotu.online, explicado sin tecnicismos.

---

## ¿Qué es SpotU?

SpotU es un **sitio web donde se conectan tres tipos de personas**:

1. **Anunciantes** — empresas o personas que quieren pautar (poner anuncios) en algún lado.
2. **Dueños de espacios publicitarios** — personas que tienen un lugar donde se puede publicitar: una valla en la carretera, una pantalla LED en un estadio, un podcast con miles de oyentes, una cuenta de Instagram con mucho seguimiento, un sitio web con tráfico, etc.
3. **Agencias de marketing** — profesionales o empresas que ayudan a los anunciantes a diseñar y gestionar sus campañas publicitarias.

**El problema que resuelve:** antes de SpotU, si querías poner un anuncio en la pantalla de un estadio en Monterrey, tenías que llamar, preguntar quién administra eso, negociar, y así con cada espacio. Del otro lado, el dueño de esa pantalla tenía tiempo vacío que no sabía cómo llenar. SpotU pone a todos en el mismo lugar para que se encuentren fácilmente.

---

## ¿Cómo funciona paso a paso?

### Paso 1: Entras al sitio

Vas a [spotu.online](https://spotu.online) y ves la página de inicio. Ahí se explica qué es SpotU, para quién es, y cómo funciona. Está disponible en español e inglés (puedes cambiar el idioma arriba).

### Paso 2: Creas tu cuenta

Das clic en "Crear cuenta" o "Registrarse". Puedes registrarte con tu correo electrónico o directamente con tu cuenta de Google (más fácil y rápido).

Al registrarte, eliges quién eres:
- "Quiero anunciarme" → eres anunciante
- "Tengo un espacio publicitario" → eres dueño de un espacio
- "Soy agencia de marketing" → eres agencia

Puedes tener más de un rol si aplica (por ejemplo, alguien puede ser dueño de un espacio Y querer anunciarse en otros espacios).

### Paso 3: Completas tu perfil

Después del registro, completas tu perfil: nombre, foto, empresa, ciudad, país, y datos de contacto (WhatsApp y/o correo). Este perfil es público — cuando alguien vea tus publicaciones, puede hacer clic en tu nombre y ver tu perfil.

---

## Las páginas principales del sitio

### La página de inicio (`spotu.online`)

Es la presentación de SpotU. Explica el concepto, muestra los beneficios para cada tipo de usuario y tiene botones para registrarse. Si ya tienes cuenta, te lleva directo al feed.

### El feed de publicaciones (`spotu.online/feed`)

Es como el "escaparate" del marketplace. Aquí están listadas todas las publicaciones activas: espacios publicitarios en venta/renta, ofertas de agencias y solicitudes de anunciantes.

Puedes:
- **Buscar por palabra clave** — si buscas "pantalla LED Monterrey", te muestra solo las publicaciones relacionadas.
- **Filtrar por tipo** — ver solo espacios físicos, solo agencias, etc.
- **Filtrar por país** — Colombia, México, USA, etc.

Cada publicación aparece como una tarjeta con foto, título, tipo, ubicación y datos básicos.

### El detalle de una publicación (`spotu.online/listing/...`)

Cuando das clic en una publicación del feed, entras al detalle completo:
- Todas las fotos
- Descripción completa
- Precio estimado
- Audiencia (para espacios)
- Datos de contacto

Lo más importante: **botones de contacto directo**.
- Si el dueño tiene WhatsApp registrado → hay un botón que abre WhatsApp directamente con el número y un mensaje predefinido.
- Si tiene correo → hay un botón que abre tu app de correo.

No hay mensajería dentro de SpotU — el contacto es directo. Esto es intencional: es más rápido, más natural y lo que la gente ya usa.

También puedes dar clic en el corazón para **guardar la publicación en favoritos** y revisarla después.

### El perfil público (`spotu.online/profile/...`)

Cada usuario tiene una página de perfil pública. Muestra: foto, nombre, empresa, bio, ciudad/país y todas sus publicaciones activas.

### Tu dashboard (`spotu.online/dashboard`)

Esta es tu área privada, solo para ti. Aquí ves:

- **Tus publicaciones**: lista de todo lo que tienes publicado, con el estado de cada una (activa, pausada, pendiente de pago, etc.)
- **Estadísticas básicas**: cuántas personas vieron cada publicación y cuántas presionaron el botón de contactar.
- **Estado de facturación**: si tu publicación está en trial, activa, o pendiente de pago.
- **Acceso a Stripe Portal**: donde manejas tus suscripciones y método de pago.

### Publicar (`spotu.online/publish`)

Aquí creas una nueva publicación. El formulario está dividido en pasos para hacerlo fácil:
1. **Tipo de espacio** (físico o digital) y categoría
2. **Título y descripción** — qué ofreces o qué buscas
3. **Ubicación** — país (puedes poner hasta 10 países si tu espacio es digital)
4. **Precio estimado** y período (por día, semana, mes, campaña)
5. **Fotos** — puedes subir hasta 10 imágenes
6. **Datos de contacto** — WhatsApp y/o correo
7. **Tags** — palabras clave para que te encuentren más fácil (máximo 5)

Al final eliges si quieres **publicar activa** (y vas al pago) o **guardar en pausa** para publicarla después.

---

## El sistema de pagos

SpotU cobra una suscripción mensual por cada publicación activa. Los pagos se procesan con **Stripe**, que es el sistema de pagos más usado del mundo (el mismo que usan Airbnb, Amazon, Shopify, etc.) — es seguro y confiable.

### ¿Cuánto cuesta?

| Tipo de publicación | Precio |
|---------------------|--------|
| Espacio publicitario o solicitud de anunciante | $4.99 USD/mes |
| Agencia de marketing | $9.99 USD/mes |
| Boost (destacar tu publicación 7 días) | $2.99 USD o $4.99 USD |

### Primer mes gratis

Si es tu primera publicación, tienes **30 días completamente gratis**. Se te pide tu tarjeta de crédito, pero no se cobra nada hasta el día 30. Si antes del día 30 pausas tu publicación, no se cobra nada.

### Programa pioneros

Los **primeros 100 usuarios** en registrarse en SpotU tienen **1 año de publicaciones gratis**. Es una forma de agradecer a quienes apoyan el proyecto desde el inicio.

### ¿Cómo pago?

Cuando activas una publicación, SpotU te redirige automáticamente a una página de Stripe (segura) donde ingresas tu tarjeta. Después de eso, el cobro es automático cada mes — no tienes que volver a pagar manualmente.

Desde tu dashboard puedes ir al "Portal de facturación" para ver tus suscripciones, cambiar tu método de pago o cancelar.

---

## Pausar y activar publicaciones

Puedes **pausar** una publicación en cualquier momento desde el menú de tu dashboard. Cuando está pausada:
- No aparece en el feed (nadie la ve)
- No se te cobra (si la pausa ocurre antes del próximo cobro, Stripe cancela)

Para **activar** una publicación pausada, das clic en "Activar" y si no tienes suscripción activa, SpotU te lleva a pagar.

---

## El Boost — Destacar tu publicación

El Boost es un pago único (no mensual) que pone tu publicación **al tope del feed** durante 7 días. Es útil cuando lanzas algo nuevo o quieres más visibilidad rápida.

Puedes comprar un Boost desde tu dashboard, en la columna de facturación de cada publicación.

---

## Favoritos (`spotu.online/favorites`)

Cuando encuentras una publicación que te interesa, puedes guardarla en favoritos dando clic al corazón. Después puedes ver todas tus publicaciones guardadas en `/favorites`. Necesitas tener cuenta para usar favoritos.

---

## Preguntas frecuentes (no técnicas)

### ¿Tengo que publicar algo para usar SpotU?

Depende de quién eres:
- **Si eres anunciante:** no. Puedes entrar al feed y contactar espacios o agencias sin publicar nada.
- **Si tienes un espacio o eres agencia:** sí, necesitas publicar para que los anunciantes te encuentren.

### ¿Qué pasa después de que me contactan?

SpotU conecta las partes pero no participa en la negociación. Una vez que alguien te contacta por WhatsApp o correo, todo lo demás (precios, condiciones, pago entre ustedes) lo manejan directamente entre las dos personas.

### ¿Es seguro?

Los pagos pasan por Stripe, que cumple todos los estándares internacionales de seguridad (PCI DSS). Tu número de tarjeta nunca llega a SpotU — lo maneja Stripe directamente.

Los datos de los usuarios están guardados en Supabase, una plataforma de base de datos con cifrado y controles de acceso estrictos.

### ¿En qué países funciona?

SpotU funciona en cualquier país del mundo — puedes registrarte desde donde quieras. Los mercados principales donde se están enfocando los esfuerzos iniciales son Colombia, norte de México y Florida (USA), pero la plataforma está abierta a todos.

### ¿Solo para empresas o también personas?

Para todos. Un freelancer con un podcast puede publicar su espacio. Un emprendedor que quiere pautar en una valla puede usarlo. No tienes que ser una empresa grande.

### ¿Puedo cancelar cuando quiera?

Sí. Cancelas desde el Portal de Stripe en tu dashboard. Tu publicación permanece activa hasta que termina el período ya pagado, y después no se renueva.

---

## En resumen

SpotU es **el lugar en internet donde dueños de espacios publicitarios, anunciantes y agencias de marketing se encuentran, se ven y se contactan** — sin intermediarios, sin complicaciones, con precios accesibles para negocios de todos los tamaños.

Si tienes un espacio publicitario, SpotU te ayuda a llenarlo.
Si quieres pautar, SpotU te ayuda a encontrar dónde.
Si eres agencia, SpotU es tu directorio y tu herramienta de trabajo.

---

**Sitio web:** [spotu.online](https://spotu.online)
**Contacto:** admin@spotu.online
**Última actualización:** Abril 2026
