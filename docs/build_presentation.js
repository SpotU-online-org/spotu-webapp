const PptxGenJS = require(
  require('child_process').execSync('npm root -g').toString().trim() + '/pptxgenjs'
);

const prs = new PptxGenJS();
prs.layout = 'LAYOUT_16x9';

// ── Colors ────────────────────────────────────────────────────────────────
const C = {
  indigo:     '4F46E5',
  indigoDark: '3730A3',
  indigo900:  '312E81',
  indigoMid:  '4338CA',
  indigoLight:'EEF2FF',
  indigoPale: 'C7D2FE',
  indigoMuted:'A5B4FC',
  indigoSoft: '818CF8',
  coral:      'F97316',
  coralLight: 'FFF7ED',
  coralPale:  'FED7AA',
  slate:      '0F172A',
  slate700:   '334155',
  slate500:   '64748B',
  slate300:   'CBD5E1',
  slate200:   'E2E8F0',
  slate100:   'F8FAFC',
  white:      'FFFFFF',
  emerald:    '10B981',
  red:        'EF4444',
};

const F = 'Calibri';

// ── Helpers ───────────────────────────────────────────────────────────────
function accentBar(slide, label) {
  slide.addShape(prs.ShapeType.rect, {
    x: 0.5, y: 0.38, w: 0.07, h: 0.28,
    fill: { color: C.coral },
    line: { color: C.coral, width: 0 },
  });
  slide.addText(label.toUpperCase(), {
    x: 0.67, y: 0.38, w: 8, h: 0.28,
    fontSize: 9, bold: true, color: C.coral, fontFace: F, charSpacing: 2,
  });
}

function slideTitle(slide, text) {
  slide.addText(text, {
    x: 0.5, y: 0.78, w: 9, h: 0.72,
    fontSize: 33, bold: true, color: C.slate, fontFace: F,
  });
}

function hRule(slide) {
  slide.addShape(prs.ShapeType.line, {
    x: 0.5, y: 1.55, w: 9, h: 0,
    line: { color: C.slate200, width: 1 },
  });
}

function roundCard(slide, x, y, w, h, fillColor, lineColor) {
  slide.addShape(prs.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: 0.12,
    fill: { color: fillColor },
    line: { color: lineColor, width: 1 },
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 1 — HERO
// ════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  s.background = { color: C.indigo };

  // Decorative circles
  s.addShape(prs.ShapeType.ellipse, {
    x: 8.0, y: -0.9, w: 2.8, h: 2.8,
    fill: { color: C.indigoMid },
    line: { color: C.indigoMid, width: 0 },
  });
  s.addShape(prs.ShapeType.ellipse, {
    x: -0.7, y: 3.7, w: 2.2, h: 2.2,
    fill: { color: C.coral },
    line: { color: C.coral, width: 0 },
  });
  s.addShape(prs.ShapeType.ellipse, {
    x: 6.5, y: 4.2, w: 1.2, h: 1.2,
    fill: { color: C.indigoMid },
    line: { color: C.indigoMid, width: 0 },
  });

  s.addText('SpotU', {
    x: 0.5, y: 1.0, w: 9, h: 1.3,
    fontSize: 80, bold: true, color: C.white,
    align: 'center', fontFace: F,
  });

  s.addText('Tu spot publicitario ideal', {
    x: 0.5, y: 2.35, w: 9, h: 0.55,
    fontSize: 24, color: C.indigoPale,
    align: 'center', fontFace: F,
  });

  // Coral divider
  s.addShape(prs.ShapeType.rect, {
    x: 4.15, y: 3.05, w: 1.7, h: 0.06,
    fill: { color: C.coral },
    line: { color: C.coral, width: 0 },
  });

  s.addText('El marketplace que conecta anunciantes, espacios publicitarios y agencias de marketing', {
    x: 1.0, y: 3.25, w: 8, h: 0.75,
    fontSize: 15, color: C.indigoMuted,
    align: 'center', fontFace: F,
  });

  s.addText('spotu.online  ·  MVP en producción', {
    x: 0.5, y: 5.1, w: 9, h: 0.35,
    fontSize: 11, color: C.indigoSoft,
    align: 'center', fontFace: F,
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 2 — EL PROBLEMA
// ════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  s.background = { color: C.white };
  accentBar(s, 'El Problema');
  slideTitle(s, 'La publicidad fragmentada es un mercado roto');
  hRule(s);

  const cards = [
    {
      title: 'Imposible de encontrar',
      body: 'Un restaurante en Monterrey tarda semanas buscando una pantalla LED. Llama, pregunta, negocia uno por uno.',
    },
    {
      title: 'Capacidad ociosa',
      body: 'El dueño del espacio tiene tiempo vacío que no sabe cómo llenar. Sin visibilidad, sin herramientas.',
    },
    {
      title: 'Sin lugar central',
      body: 'Las agencias de marketing tampoco tienen dónde ofrecer sus servicios ni encontrar espacios para sus clientes.',
    },
  ];

  cards.forEach((c, i) => {
    const x = 0.5 + i * 3.05;
    roundCard(s, x, 1.72, 2.85, 3.05, C.slate100, C.slate200);

    // Number badge
    s.addShape(prs.ShapeType.ellipse, {
      x: x + 0.18, y: 1.9, w: 0.45, h: 0.45,
      fill: { color: C.coral },
      line: { color: C.coral, width: 0 },
    });
    s.addText(String(i + 1), {
      x: x + 0.18, y: 1.9, w: 0.45, h: 0.45,
      fontSize: 13, bold: true, color: C.white, align: 'center', fontFace: F,
    });

    s.addText(c.title, {
      x: x + 0.18, y: 2.45, w: 2.5, h: 0.45,
      fontSize: 14, bold: true, color: C.slate, fontFace: F,
    });
    s.addText(c.body, {
      x: x + 0.18, y: 2.96, w: 2.5, h: 1.6,
      fontSize: 12, color: C.slate500, fontFace: F,
    });
  });

  s.addText('No existe un marketplace que conecte oferta y demanda de publicidad de forma simple.', {
    x: 0.5, y: 4.95, w: 9, h: 0.42,
    fontSize: 13, bold: true, color: C.indigo, align: 'center', fontFace: F,
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — LA SOLUCIÓN
// ════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  s.background = { color: C.indigo };

  s.addText('La Solución', {
    x: 0.5, y: 0.42, w: 9, h: 0.38,
    fontSize: 13, bold: true, color: C.indigoMuted, fontFace: F, charSpacing: 1,
  });
  s.addText('SpotU es el marketplace de publicidad de 3 lados', {
    x: 0.5, y: 0.85, w: 9, h: 1.0,
    fontSize: 36, bold: true, color: C.white, fontFace: F,
  });

  const actors = [
    { icon: 'ANUNCIANTES', emoji: 'Marcas y empresas que buscan donde pautar', label: '📢', accent: C.indigoSoft },
    { icon: 'ESPACIOS',    emoji: 'Vallas, pantallas LED, podcasts, redes sociales', label: '📍', accent: C.coral },
    { icon: 'AGENCIAS',    emoji: 'Expertos que conectan marcas con los mejores espacios', label: '💼', accent: C.emerald },
  ];

  actors.forEach((a, i) => {
    const x = 0.5 + i * 3.05;
    s.addShape(prs.ShapeType.roundRect, {
      x, y: 2.1, w: 2.85, h: 3.1,
      rectRadius: 0.15,
      fill: { color: C.indigo900 },
      line: { color: C.indigoMid, width: 1 },
    });
    s.addText(a.label, {
      x, y: 2.3, w: 2.85, h: 0.6,
      fontSize: 30, align: 'center', fontFace: F,
    });
    s.addText(a.icon, {
      x: x + 0.1, y: 2.98, w: 2.65, h: 0.4,
      fontSize: 12, bold: true, color: a.accent, align: 'center', fontFace: F, charSpacing: 1,
    });
    s.addText(a.emoji, {
      x: x + 0.15, y: 3.45, w: 2.55, h: 1.55,
      fontSize: 13, color: C.indigoPale, align: 'center', fontFace: F,
    });
  });

  // Connecting arrows
  [3.37, 6.42].forEach(x => {
    s.addShape(prs.ShapeType.line, {
      x, y: 3.65, w: 0.33, h: 0,
      line: { color: C.coral, width: 2 },
    });
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 4 — CÓMO FUNCIONA
// ════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  s.background = { color: C.white };
  accentBar(s, 'Cómo Funciona');
  slideTitle(s, '4 pasos, sin complicaciones');
  hRule(s);

  const steps = [
    { num: '01', title: 'Regístrate y elige tu rol', body: 'Anunciante, espacio publicitario o agencia de marketing.', fill: C.indigoLight, line: C.indigoPale, numColor: C.indigo },
    { num: '02', title: 'Publica o busca', body: 'Espacios y agencias publican. Anunciantes navegan el feed o publican una solicitud.', fill: C.coralLight, line: C.coralPale, numColor: C.coral },
    { num: '03', title: 'Contacto directo por WhatsApp', body: 'Un clic abre WhatsApp o correo. Sin intermediarios ni tiempos de espera.', fill: C.indigoLight, line: C.indigoPale, numColor: C.indigo },
    { num: '04', title: 'Mide tus resultados', body: 'Ve cuántas personas vieron tu publicacion y cuántas te contactaron.', fill: C.coralLight, line: C.coralPale, numColor: C.coral },
  ];

  steps.forEach((st, i) => {
    const x = 0.5 + (i % 2) * 4.65;
    const y = 1.75 + Math.floor(i / 2) * 1.75;
    roundCard(s, x, y, 4.35, 1.55, st.fill, st.line);
    s.addText(st.num, {
      x: x + 0.2, y: y + 0.18, w: 0.55, h: 0.55,
      fontSize: 26, bold: true, color: st.numColor, fontFace: F,
    });
    s.addText(st.title, {
      x: x + 0.88, y: y + 0.16, w: 3.28, h: 0.42,
      fontSize: 14, bold: true, color: C.slate, fontFace: F,
    });
    s.addText(st.body, {
      x: x + 0.88, y: y + 0.6, w: 3.28, h: 0.78,
      fontSize: 12, color: C.slate500, fontFace: F,
    });
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 5 — MVP EN PRODUCCIÓN
// ════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  s.background = { color: C.slate };

  s.addText('MVP en Producción', {
    x: 0.5, y: 0.32, w: 9, h: 0.38,
    fontSize: 12, bold: true, color: C.coral, fontFace: F, charSpacing: 1,
  });
  s.addText('spotu.online ya está funcionando', {
    x: 0.5, y: 0.75, w: 9, h: 0.7,
    fontSize: 30, bold: true, color: C.white, fontFace: F,
  });

  const features = [
    'Registro y autenticación (email + Google)',
    'Feed público con búsqueda y filtros',
    'Pagos con Stripe (trial, suscripciones, boost)',
    'Dashboard con estadísticas por publicación',
    'Favoritos y perfiles públicos',
    'Publicaciones multi-paso con imágenes y tags',
    'Programa de pioneros (1er año gratis)',
    'Emails transaccionales con Resend',
    'Dominio propio: spotu.online en Vercel',
    'Cron jobs automáticos (expiración pioneros)',
  ];

  features.forEach((f, i) => {
    const col = i < 5 ? 0 : 1;
    const row = i < 5 ? i : i - 5;
    const x = 0.5 + col * 4.75;
    const y = 1.62 + row * 0.71;

    s.addShape(prs.ShapeType.roundRect, {
      x: x, y: y + 0.06, w: 0.3, h: 0.3,
      rectRadius: 0.05,
      fill: { color: C.emerald },
      line: { color: C.emerald, width: 0 },
    });
    s.addText('✓', {
      x: x, y: y + 0.03, w: 0.3, h: 0.35,
      fontSize: 12, bold: true, color: C.white, align: 'center', fontFace: F,
    });
    s.addText(f, {
      x: x + 0.4, y: y, w: 4.15, h: 0.42,
      fontSize: 13, color: 'CBD5E1', fontFace: F,
    });
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 6 — MERCADO
// ════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  s.background = { color: C.white };
  accentBar(s, 'Mercado');
  slideTitle(s, 'Una oportunidad real y desatendida');
  hRule(s);

  const stats = [
    { value: '$40B', label: 'Mercado OOH global', sub: 'creciendo 5% anual' },
    { value: '$12B', label: 'Publicidad digital LATAM', sub: 'creciendo 15% anual' },
    { value: '3', label: 'Mercados objetivo', sub: 'Colombia · N. México · Florida' },
  ];

  stats.forEach((st, i) => {
    const x = 0.5 + i * 3.05;
    roundCard(s, x, 1.72, 2.85, 1.75, C.indigo, C.indigo);
    s.addText(st.value, {
      x, y: 1.92, w: 2.85, h: 0.78,
      fontSize: 42, bold: true, color: C.white, align: 'center', fontFace: F,
    });
    s.addText(st.label, {
      x: x + 0.1, y: 2.74, w: 2.65, h: 0.35,
      fontSize: 12, bold: true, color: C.indigoPale, align: 'center', fontFace: F,
    });
    s.addText(st.sub, {
      x: x + 0.1, y: 3.1, w: 2.65, h: 0.28,
      fontSize: 10, color: C.indigoSoft, align: 'center', fontFace: F,
    });
  });

  const markets = [
    { name: 'Colombia', desc: 'Hub digital en crecimiento, ecosistema de agencias activo' },
    { name: 'Norte de Mexico', desc: 'Hub empresarial, nearshoring, alta inversion publicitaria' },
    { name: 'Florida, USA', desc: 'Mercado hispano 5.7M+, puente LATAM-USA' },
  ];

  markets.forEach((m, i) => {
    const x = 0.5 + i * 3.05;
    s.addText(m.name, {
      x, y: 3.62, w: 2.85, h: 0.38,
      fontSize: 14, bold: true, color: C.slate, align: 'center', fontFace: F,
    });
    s.addText(m.desc, {
      x: x + 0.1, y: 4.04, w: 2.65, h: 0.62,
      fontSize: 11, color: C.slate500, align: 'center', fontFace: F,
    });
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 7 — MODELO DE NEGOCIO
// ════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  s.background = { color: C.white };
  accentBar(s, 'Modelo de Negocio');
  slideTitle(s, 'Suscripcion mensual por publicacion activa');
  hRule(s);

  // Card 1 — Indigo
  s.addShape(prs.ShapeType.roundRect, {
    x: 0.7, y: 1.72, w: 3.9, h: 3.1,
    rectRadius: 0.18,
    fill: { color: C.indigo },
    line: { color: C.indigo, width: 0 },
  });
  s.addText('Espacios y Anunciantes', {
    x: 0.9, y: 1.92, w: 3.5, h: 0.52,
    fontSize: 16, bold: true, color: C.white, align: 'center', fontFace: F,
  });
  s.addText('$4.99', {
    x: 0.7, y: 2.5, w: 3.9, h: 0.9,
    fontSize: 58, bold: true, color: C.white, align: 'center', fontFace: F,
  });
  s.addText('USD / mes por publicacion', {
    x: 0.9, y: 3.42, w: 3.5, h: 0.38,
    fontSize: 13, color: C.indigoPale, align: 'center', fontFace: F,
  });
  s.addText('+ $2.99 boost semanal', {
    x: 0.9, y: 3.84, w: 3.5, h: 0.75,
    fontSize: 13, color: C.white, align: 'center', fontFace: F,
  });

  // Card 2 — Coral
  s.addShape(prs.ShapeType.roundRect, {
    x: 5.4, y: 1.72, w: 3.9, h: 3.1,
    rectRadius: 0.18,
    fill: { color: C.coral },
    line: { color: C.coral, width: 0 },
  });
  s.addText('Agencias de Marketing', {
    x: 5.6, y: 1.92, w: 3.5, h: 0.52,
    fontSize: 16, bold: true, color: C.white, align: 'center', fontFace: F,
  });
  s.addText('$9.99', {
    x: 5.4, y: 2.5, w: 3.9, h: 0.9,
    fontSize: 58, bold: true, color: C.white, align: 'center', fontFace: F,
  });
  s.addText('USD / mes por publicacion', {
    x: 5.6, y: 3.42, w: 3.5, h: 0.38,
    fontSize: 13, color: C.coralPale, align: 'center', fontFace: F,
  });
  s.addText('+ $4.99 boost semanal', {
    x: 5.6, y: 3.84, w: 3.5, h: 0.75,
    fontSize: 13, color: C.white, align: 'center', fontFace: F,
  });

  s.addText('1ra publicacion: 30 dias gratis  ·  Pioneros (primeros 100 usuarios): 1 ano completamente gratis', {
    x: 0.5, y: 4.98, w: 9, h: 0.42,
    fontSize: 12, bold: true, color: C.indigo, align: 'center', fontFace: F,
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 8 — DIFERENCIADORES
// ════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  s.background = { color: C.white };
  accentBar(s, 'Diferenciadores');
  slideTitle(s, 'Por que SpotU y no la competencia?');
  hRule(s);

  // Header
  s.addText('Caracteristica', { x: 0.6, y: 1.66, w: 5.5, h: 0.38, fontSize: 11, bold: true, color: C.slate500, fontFace: F });
  s.addText('SpotU',          { x: 6.1, y: 1.66, w: 1.6, h: 0.38, fontSize: 11, bold: true, color: C.indigo,   fontFace: F, align: 'center' });
  s.addText('Competencia',    { x: 7.8, y: 1.66, w: 1.6, h: 0.38, fontSize: 11, bold: true, color: C.slate500, fontFace: F, align: 'center' });

  const rows = [
    'Marketplace de 3 lados (anunciantes + espacios + agencias)',
    'Espacios fisicos Y digitales en un solo lugar',
    'Enfoque en LATAM y mercado hispano USA',
    'Contacto directo por WhatsApp sin intermediarios',
    'Busqueda semantica con IA (Fase 2)',
    'Precio accesible para pequenas y medianas empresas',
    'Contratos digitales integrados (Fase 2)',
  ];

  rows.forEach((row, i) => {
    const y = 2.1 + i * 0.47;
    const bg = i % 2 === 0 ? C.slate100 : C.white;
    s.addShape(prs.ShapeType.rect, {
      x: 0.5, y, w: 9, h: 0.45,
      fill: { color: bg }, line: { color: bg, width: 0 },
    });
    s.addText(row, {
      x: 0.65, y: y + 0.07, w: 5.3, h: 0.32,
      fontSize: 13, color: C.slate, fontFace: F,
    });
    s.addText('✔', {
      x: 6.1, y: y + 0.07, w: 1.6, h: 0.32,
      fontSize: 15, bold: true, color: C.emerald, align: 'center', fontFace: F,
    });
    s.addText('✗', {
      x: 7.8, y: y + 0.07, w: 1.6, h: 0.32,
      fontSize: 15, bold: true, color: C.red, align: 'center', fontFace: F,
    });
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 9 — AGENCIAS = MULTIPLICADOR
// ════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  s.background = { color: C.indigo };

  s.addText('El Multiplicador', {
    x: 0.5, y: 0.35, w: 9, h: 0.38,
    fontSize: 12, bold: true, color: C.indigoMuted, fontFace: F, charSpacing: 1,
  });
  s.addText('Las agencias son el motor de crecimiento del marketplace', {
    x: 0.5, y: 0.78, w: 9, h: 0.9,
    fontSize: 28, bold: true, color: C.white, fontFace: F,
  });

  const points = [
    { icon: 'x10', text: '1 agencia con 10 clientes = 10 anunciantes con un solo onboarding' },
    { icon: '🔒',  text: 'Alta retencion: una agencia que opera en SpotU no migra facilmente' },
    { icon: '📈',  text: 'Profesionalizan la demanda: campanas mejor estructuradas, mas valor para todos' },
    { icon: '$$$', text: 'Plan Agency ($9.99/mes) — ARPU 2x vs usuario basico, LTV objetivo >$500 USD' },
  ];

  points.forEach((p, i) => {
    const y = 1.88 + i * 0.87;
    s.addShape(prs.ShapeType.roundRect, {
      x: 0.5, y, w: 9, h: 0.72,
      rectRadius: 0.1,
      fill: { color: C.indigo900 },
      line: { color: C.indigoMid, width: 1 },
    });
    s.addShape(prs.ShapeType.roundRect, {
      x: 0.65, y: y + 0.14, w: 0.62, h: 0.44,
      rectRadius: 0.07,
      fill: { color: C.coral },
      line: { color: C.coral, width: 0 },
    });
    s.addText(p.icon, {
      x: 0.65, y: y + 0.14, w: 0.62, h: 0.44,
      fontSize: i === 0 || i === 3 ? 11 : 18, bold: true, color: C.white, align: 'center', fontFace: F,
    });
    s.addText(p.text, {
      x: 1.42, y: y + 0.17, w: 7.9, h: 0.38,
      fontSize: 14, color: 'E0E7FF', fontFace: F,
    });
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 10 — TRACCIÓN & ROADMAP
// ════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  s.background = { color: C.white };
  accentBar(s, 'Traccion & Roadmap');
  slideTitle(s, 'El MVP funciona. Ahora a crecer.');
  hRule(s);

  const milestones = [
    { phase: 'HOY',    label: 'MVP en produccion', desc: 'spotu.online activo con pagos, auth, feed y dashboard', color: C.emerald, done: true },
    { phase: 'MES 1-2', label: 'Primeros 100 usuarios', desc: 'Onboarding en Colombia, Mexico y Florida', color: C.indigo, done: false },
    { phase: 'MES 2-3', label: 'IA + contratos', desc: 'Busqueda semantica con Claude API y contratos digitales', color: C.indigo, done: false },
    { phase: 'MES 5-6', label: '$2,000 MRR', desc: '400+ usuarios de pago activos en 3 mercados', color: C.coral, done: false },
  ];

  // Timeline line
  s.addShape(prs.ShapeType.line, {
    x: 1.12, y: 2.58, w: 7.75, h: 0,
    line: { color: C.slate200, width: 2 },
  });

  milestones.forEach((m, i) => {
    const cx = 1.12 + i * 2.58;

    // Circle
    s.addShape(prs.ShapeType.ellipse, {
      x: cx - 0.3, y: 2.28, w: 0.6, h: 0.6,
      fill: { color: m.done ? C.emerald : m.color },
      line: { color: m.done ? C.emerald : m.color, width: 0 },
    });
    if (m.done) {
      s.addText('✓', {
        x: cx - 0.3, y: 2.3, w: 0.6, h: 0.55,
        fontSize: 14, bold: true, color: C.white, align: 'center', fontFace: F,
      });
    }

    s.addText(m.phase, {
      x: cx - 1.1, y: 3.02, w: 2.2, h: 0.3,
      fontSize: 10, bold: true, color: m.color, align: 'center', fontFace: F, charSpacing: 1,
    });
    s.addText(m.label, {
      x: cx - 1.1, y: 3.34, w: 2.2, h: 0.42,
      fontSize: 13, bold: true, color: C.slate, align: 'center', fontFace: F,
    });
    s.addText(m.desc, {
      x: cx - 1.05, y: 3.8, w: 2.1, h: 0.88,
      fontSize: 11, color: C.slate500, align: 'center', fontFace: F,
    });
  });

  s.addText('Costos operativos < $70 USD/mes  ·  Break-even con solo 15 usuarios de pago  ·  Margen bruto >85%', {
    x: 0.5, y: 5.0, w: 9, h: 0.38,
    fontSize: 11, color: C.slate500, align: 'center', fontFace: F,
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 11 — POR QUÉ AHORA
// ════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  s.background = { color: C.white };
  accentBar(s, 'Por Que Ahora');
  slideTitle(s, 'El timing es perfecto');
  hRule(s);

  const reasons = [
    { title: 'Digitalizacion acelerada',    body: 'Los negocios LATAM migran su presupuesto publicitario a digital. SpotU captura ese movimiento.',         fill: C.indigoLight, line: C.indigoPale },
    { title: 'Boom del nearshoring',         body: 'Mexico atrae empresas que necesitan publicidad local. Nuevo presupuesto, sin plataforma donde gastarlo.', fill: C.indigoLight, line: C.indigoPale },
    { title: 'Economia de creadores',        body: 'Podcasters, influencers y webs quieren monetizar su audiencia. Son los espacios digitales de SpotU.',     fill: C.coralLight,  line: C.coralPale  },
    { title: 'IA hace el matching posible',  body: 'Hoy es viable conectar oferta y demanda con busqueda semantica a bajo costo en toda LATAM.',              fill: C.coralLight,  line: C.coralPale  },
  ];

  reasons.forEach((r, i) => {
    const x = 0.5 + (i % 2) * 4.65;
    const y = 1.72 + Math.floor(i / 2) * 1.78;
    roundCard(s, x, y, 4.35, 1.62, r.fill, r.line);
    const numColor = i < 2 ? C.indigo : C.coral;
    s.addShape(prs.ShapeType.ellipse, {
      x: x + 0.2, y: y + 0.2, w: 0.42, h: 0.42,
      fill: { color: numColor },
      line: { color: numColor, width: 0 },
    });
    s.addText(String(i + 1), {
      x: x + 0.2, y: y + 0.2, w: 0.42, h: 0.42,
      fontSize: 13, bold: true, color: C.white, align: 'center', fontFace: F,
    });
    s.addText(r.title, {
      x: x + 0.75, y: y + 0.18, w: 3.42, h: 0.42,
      fontSize: 14, bold: true, color: C.slate, fontFace: F,
    });
    s.addText(r.body, {
      x: x + 0.2, y: y + 0.68, w: 3.97, h: 0.8,
      fontSize: 12, color: C.slate500, fontFace: F,
    });
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 12 — CIERRE / CTA
// ════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  s.background = { color: C.indigoDark };

  // Decorative circles
  s.addShape(prs.ShapeType.ellipse, {
    x: 8.3, y: -0.8, w: 2.5, h: 2.5,
    fill: { color: C.indigoMid },
    line: { color: C.indigoMid, width: 0 },
  });
  s.addShape(prs.ShapeType.ellipse, {
    x: -0.5, y: 3.9, w: 2.0, h: 2.0,
    fill: { color: C.coral },
    line: { color: C.coral, width: 0 },
  });

  s.addText('La oportunidad es real.', {
    x: 0.5, y: 0.8, w: 9, h: 0.75,
    fontSize: 42, bold: true, color: C.white, align: 'center', fontFace: F,
  });
  s.addText('El timing es ahora.', {
    x: 0.5, y: 1.6, w: 9, h: 0.75,
    fontSize: 42, bold: true, color: C.coral, align: 'center', fontFace: F,
  });
  s.addText('La ejecucion lo decide todo.', {
    x: 0.5, y: 2.4, w: 9, h: 0.75,
    fontSize: 42, bold: true, color: C.indigoPale, align: 'center', fontFace: F,
  });

  // Coral divider
  s.addShape(prs.ShapeType.rect, {
    x: 3.6, y: 3.35, w: 2.8, h: 0.06,
    fill: { color: C.coral },
    line: { color: C.coral, width: 0 },
  });

  s.addText('spotu.online   ·   admin@spotu.online', {
    x: 0.5, y: 3.62, w: 9, h: 0.45,
    fontSize: 16, color: C.indigoPale, align: 'center', fontFace: F,
  });

  s.addText('Cesar Emilio Castano Marin  ·  Fundador de SpotU', {
    x: 0.5, y: 4.25, w: 9, h: 0.38,
    fontSize: 13, color: C.indigoSoft, align: 'center', fontFace: F,
  });
}

// ── Save ──────────────────────────────────────────────────────────────────
prs.writeFile({ fileName: 'c:/Users/cesar/OneDrive/Escritorio/FREELANCE/SpotU/docs/SpotU_Presentacion.pptx' })
  .then(() => console.log('Presentacion guardada: docs/SpotU_Presentacion.pptx'))
  .catch(err => { console.error('Error:', err); process.exit(1); });
