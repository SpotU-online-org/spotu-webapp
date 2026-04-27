const path = require('path');
const PptxGenJS = require(
  require('child_process').execSync('npm root -g').toString().trim() + '/pptxgenjs'
);

const ASSETS = path.resolve(__dirname, 'assets');
const A = (f) => path.join(ASSETS, f);

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
  amber:      'D97706',
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
    fontSize: 30, bold: true, color: C.slate, fontFace: F,
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

// Smaller accent bar for top-right page indicator (logo space)
function topRightLogo(slide) {
  slide.addImage({
    path: A('logo-horizontal.png'),
    x: 8.0, y: 0.32, w: 1.5, h: 0.42,
    sizing: { type: 'contain', w: 1.5, h: 0.42 },
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

  // Logo for dark background
  s.addImage({
    path: A('logo-dark-bg.png'),
    x: 3.0, y: 1.05, w: 4, h: 1.3,
    sizing: { type: 'contain', w: 4, h: 1.3 },
  });

  s.addText('Tu spot publicitario ideal', {
    x: 0.5, y: 2.55, w: 9, h: 0.55,
    fontSize: 24, color: C.indigoPale,
    align: 'center', fontFace: F,
  });

  // Coral divider
  s.addShape(prs.ShapeType.rect, {
    x: 4.15, y: 3.25, w: 1.7, h: 0.06,
    fill: { color: C.coral },
    line: { color: C.coral, width: 0 },
  });

  s.addText('Marketplace SMB que conecta anunciantes, espacios publicitarios y agencias de marketing', {
    x: 1.0, y: 3.45, w: 8, h: 0.75,
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
  topRightLogo(s);
  slideTitle(s, 'Para el SMB, la publicidad fuera de Google y Meta sigue siendo manual');
  hRule(s);

  const cards = [
    {
      title: 'Difícil de encontrar',
      body: 'Un restaurante en Monterrey termina llamando, preguntando y negociando uno por uno cada espacio que considera.',
    },
    {
      title: 'Capacidad ociosa',
      body: 'El dueño del espacio suele tener tiempo vacío que le cuesta llenar sin un canal de distribución claro.',
    },
    {
      title: 'Agencias dispersas',
      body: 'Existen directorios de agencias y plataformas OOH por separado, pero pocos puntos de encuentro de los tres lados.',
    },
  ];

  cards.forEach((c, i) => {
    const x = 0.5 + i * 3.05;
    roundCard(s, x, 1.72, 2.85, 2.95, C.slate100, C.slate200);

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
      x: x + 0.18, y: 2.96, w: 2.5, h: 1.55,
      fontSize: 12, color: C.slate500, fontFace: F,
    });
  });

  s.addText('Existen plataformas enterprise y publishers OOH consolidados, pero la franja SMB sigue subatendida.', {
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
  s.addText('SpotU es un marketplace de publicidad de 3 lados con foco SMB', {
    x: 0.5, y: 0.85, w: 9, h: 1.0,
    fontSize: 30, bold: true, color: C.white, fontFace: F,
  });

  const actors = [
    { icon: 'ANUNCIANTES', emoji: 'Marcas y empresas que buscan donde pautar', label: 'A', accent: C.indigoSoft },
    { icon: 'ESPACIOS',    emoji: 'Vallas, pantallas LED, podcasts, redes sociales y webs independientes', label: 'E', accent: C.coral },
    { icon: 'AGENCIAS',    emoji: 'Expertos que conectan marcas con los espacios correctos', label: 'M', accent: C.emerald },
  ];

  actors.forEach((a, i) => {
    const x = 0.5 + i * 3.05;
    s.addShape(prs.ShapeType.roundRect, {
      x, y: 2.1, w: 2.85, h: 3.1,
      rectRadius: 0.15,
      fill: { color: C.indigo900 },
      line: { color: C.indigoMid, width: 1 },
    });
    s.addShape(prs.ShapeType.ellipse, {
      x: x + 1.05, y: 2.35, w: 0.75, h: 0.75,
      fill: { color: a.accent },
      line: { color: a.accent, width: 0 },
    });
    s.addText(a.label, {
      x: x + 1.05, y: 2.35, w: 0.75, h: 0.75,
      fontSize: 30, bold: true, color: C.white, align: 'center', fontFace: F,
    });
    s.addText(a.icon, {
      x: x + 0.1, y: 3.2, w: 2.65, h: 0.4,
      fontSize: 12, bold: true, color: a.accent, align: 'center', fontFace: F, charSpacing: 1,
    });
    s.addText(a.emoji, {
      x: x + 0.15, y: 3.65, w: 2.55, h: 1.45,
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
  topRightLogo(s);
  slideTitle(s, '4 pasos, sin complicaciones');
  hRule(s);

  const steps = [
    { num: '01', title: 'Regístrate y elige tu rol',  body: 'Anunciante, espacio publicitario o agencia. También puedes tener varios roles.', fill: C.indigoLight, line: C.indigoPale, numColor: C.indigo },
    { num: '02', title: 'Publica o busca',            body: 'Espacios y agencias publican su oferta. Anunciantes navegan el feed o publican una solicitud.', fill: C.coralLight, line: C.coralPale, numColor: C.coral },
    { num: '03', title: 'Contacto directo',           body: 'Un clic abre WhatsApp o correo. Sin intermediarios ni tiempos de espera.', fill: C.indigoLight, line: C.indigoPale, numColor: C.indigo },
    { num: '04', title: 'Mide tus resultados',        body: 'Vistas y contactos por publicación. Aprendes qué funciona y qué no.', fill: C.coralLight, line: C.coralPale, numColor: C.coral },
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
// SLIDE 5 — MVP EN PRODUCCIÓN (con screenshot del landing)
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
    fontSize: 28, bold: true, color: C.white, fontFace: F,
  });

  // Browser-frame screenshot
  s.addShape(prs.ShapeType.roundRect, {
    x: 0.5, y: 1.65, w: 5.5, h: 3.7,
    rectRadius: 0.08,
    fill: { color: C.white },
    line: { color: C.indigoMid, width: 1 },
  });
  // Window dots
  ['EF4444', 'F59E0B', '10B981'].forEach((dot, i) => {
    s.addShape(prs.ShapeType.ellipse, {
      x: 0.65 + i * 0.18, y: 1.78, w: 0.13, h: 0.13,
      fill: { color: dot },
      line: { color: dot, width: 0 },
    });
  });
  s.addText('spotu.online', {
    x: 1.4, y: 1.77, w: 4.4, h: 0.16,
    fontSize: 9, color: C.slate500, fontFace: F,
  });

  // Screenshot
  s.addImage({
    path: A('site_landing.png'),
    x: 0.6, y: 2.0, w: 5.3, h: 3.3,
    sizing: { type: 'cover', w: 5.3, h: 3.3 },
  });

  // Right column features
  const features = [
    'Auth (email + Google OAuth)',
    'Feed con búsqueda y filtros',
    'Pagos Stripe (trial, suscripción, boost)',
    'Dashboard con stats por publicación',
    'Favoritos y perfiles públicos',
    'Programa pioneros (250 — 1 año gratis)',
    'Emails transaccionales con Resend',
    'Cron jobs (expiración pioneros)',
  ];

  features.forEach((f, i) => {
    const x = 6.3;
    const y = 1.65 + i * 0.45;

    s.addShape(prs.ShapeType.roundRect, {
      x: x, y: y + 0.05, w: 0.28, h: 0.28,
      rectRadius: 0.05,
      fill: { color: C.emerald },
      line: { color: C.emerald, width: 0 },
    });
    s.addText('OK', {
      x: x, y: y + 0.05, w: 0.28, h: 0.28,
      fontSize: 8, bold: true, color: C.white, align: 'center', fontFace: F,
    });
    s.addText(f, {
      x: x + 0.38, y, w: 3.4, h: 0.4,
      fontSize: 12, color: 'CBD5E1', fontFace: F,
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
  topRightLogo(s);
  slideTitle(s, 'Una franja SMB con cobertura limitada');
  hRule(s);

  const stats = [
    { value: '$5.2B', label: 'OOH México (mercado)', sub: 'fuente: Mordor Intelligence' },
    { value: '$1.59B', label: 'Spend OOH LATAM 2024', sub: 'creciendo ~5% anual' },
    { value: '8.3%', label: 'CAGR pDOOH LATAM', sub: 'hasta 2027 (estimado)' },
  ];

  stats.forEach((st, i) => {
    const x = 0.5 + i * 3.05;
    roundCard(s, x, 1.72, 2.85, 1.75, C.indigo, C.indigo);
    s.addText(st.value, {
      x, y: 1.92, w: 2.85, h: 0.78,
      fontSize: 38, bold: true, color: C.white, align: 'center', fontFace: F,
    });
    s.addText(st.label, {
      x: x + 0.1, y: 2.74, w: 2.65, h: 0.35,
      fontSize: 12, bold: true, color: C.indigoPale, align: 'center', fontFace: F,
    });
    s.addText(st.sub, {
      x: x + 0.1, y: 3.1, w: 2.65, h: 0.28,
      fontSize: 9, color: C.indigoSoft, align: 'center', fontFace: F,
    });
  });

  const markets = [
    { name: 'Colombia',         desc: 'Hub digital en crecimiento, $350M en OOH, 75% digital' },
    { name: 'Norte de México',  desc: 'Hub empresarial, nearshoring, 65% digital en OOH urbano' },
    { name: 'Florida, USA',     desc: 'Mercado hispano 5.7M+, puente LATAM-USA' },
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

  s.addText('Apuntamos al SMB que invierte $200–$2,000 USD por campaña — el segmento menos atendido por las plataformas enterprise.', {
    x: 0.5, y: 4.95, w: 9, h: 0.42,
    fontSize: 11, italic: true, color: C.slate500, align: 'center', fontFace: F,
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 7 — MODELO DE NEGOCIO
// ════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  s.background = { color: C.white };
  accentBar(s, 'Modelo de Negocio');
  topRightLogo(s);
  slideTitle(s, 'Suscripción mensual por publicación activa');
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
  s.addText('USD / mes por publicación', {
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
  s.addText('USD / mes por publicación', {
    x: 5.6, y: 3.42, w: 3.5, h: 0.38,
    fontSize: 13, color: C.coralPale, align: 'center', fontFace: F,
  });
  s.addText('+ $4.99 boost semanal', {
    x: 5.6, y: 3.84, w: 3.5, h: 0.75,
    fontSize: 13, color: C.white, align: 'center', fontFace: F,
  });

  s.addText('1ra publicación: 30 días gratis  ·  Pioneros (primeros 250 usuarios): 1 año completamente gratis', {
    x: 0.5, y: 4.98, w: 9, h: 0.42,
    fontSize: 12, bold: true, color: C.indigo, align: 'center', fontFace: F,
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 8 — PANORAMA COMPETITIVO (NEW)
// ════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  s.background = { color: C.white };
  accentBar(s, 'Panorama Competitivo');
  topRightLogo(s);
  slideTitle(s, 'El mercado tiene jugadores fuertes. SpotU coexiste con ellos.');
  hRule(s);

  const segments = [
    {
      title: 'Programmatic enterprise (LATAM)',
      players: 'PRODOOH · Hivestack · MiQ + Adsmovil · Place Exchange',
      foco: 'Anunciantes enterprise, mínimos altos, contratos RFP',
      color: C.indigo,
      bg: C.indigoLight,
      line: C.indigoPale,
    },
    {
      title: 'Publishers OOH tradicionales (LATAM)',
      players: 'Publimovil · Latam Outdoor Holding · Samba Digital',
      foco: 'Operan su propio inventario OOH, no son marketplaces neutrales',
      color: C.coral,
      bg: C.coralLight,
      line: C.coralPale,
    },
    {
      title: 'Directorios de agencias',
      players: 'Sortlist · Clutch · Semrush Agencies',
      foco: 'Solo lado de agencias, sin espacios publicitarios',
      color: C.emerald,
      bg: 'ECFDF5',
      line: 'A7F3D0',
    },
    {
      title: 'Marketplace SMB OOH (referencia USA)',
      players: 'AdQuick · Billups',
      foco: 'Modelo SMB/self-service en USA — valida la tesis para LATAM',
      color: C.amber,
      bg: 'FEF3C7',
      line: 'FCD34D',
    },
  ];

  segments.forEach((seg, i) => {
    const x = 0.5 + (i % 2) * 4.65;
    const y = 1.7 + Math.floor(i / 2) * 1.65;
    roundCard(s, x, y, 4.35, 1.45, seg.bg, seg.line);

    s.addShape(prs.ShapeType.rect, {
      x: x, y: y, w: 0.07, h: 1.45,
      fill: { color: seg.color }, line: { color: seg.color, width: 0 },
    });

    s.addText(seg.title, {
      x: x + 0.22, y: y + 0.12, w: 4.0, h: 0.32,
      fontSize: 12, bold: true, color: seg.color, fontFace: F,
    });
    s.addText(seg.players, {
      x: x + 0.22, y: y + 0.46, w: 4.0, h: 0.34,
      fontSize: 11, bold: true, color: C.slate, fontFace: F,
    });
    s.addText(seg.foco, {
      x: x + 0.22, y: y + 0.83, w: 4.0, h: 0.55,
      fontSize: 10, italic: true, color: C.slate500, fontFace: F,
    });
  });

  s.addText('Ninguno de estos jugadores integra los 3 lados (anunciantes + espacios + agencias) en el segmento SMB con foco LATAM-hispano.', {
    x: 0.5, y: 5.05, w: 9, h: 0.4,
    fontSize: 11, italic: true, color: C.slate500, align: 'center', fontFace: F,
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 9 — POSICIONAMIENTO (replaces "Diferenciadores")
// ════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  s.background = { color: C.white };
  accentBar(s, 'Posicionamiento');
  topRightLogo(s);
  slideTitle(s, 'Donde encaja SpotU en el ecosistema');
  hRule(s);

  // Header row
  s.addShape(prs.ShapeType.rect, {
    x: 0.5, y: 1.72, w: 9, h: 0.42,
    fill: { color: C.indigo900 }, line: { color: C.indigo900, width: 0 },
  });
  ['Característica', 'SpotU', 'Programmatic\nenterprise', 'Publishers\ntradicionales', 'Directorios\nde agencias'].forEach((h, i) => {
    const widths = [2.85, 1.4, 1.55, 1.55, 1.55];
    let xs = 0.6;
    for (let k = 0; k < i; k++) xs += widths[k] + 0.05;
    s.addText(h, {
      x: xs, y: 1.74, w: widths[i] - 0.1, h: 0.38,
      fontSize: 9, bold: true, color: i === 1 ? C.indigoPale : C.white, align: i === 0 ? 'left' : 'center', fontFace: F, charSpacing: 1,
    });
  });

  const rows = [
    ['Marketplace 3 lados',           '✓', '~', '✗', '~'],
    ['Espacios físicos + digitales',  '✓', '~', '~', '✗'],
    ['Accesible para SMBs ($4-$10/mes)', '✓', '✗', '~', '✓'],
    ['Contacto directo (WhatsApp/email)', '✓', '✗', '~', '~'],
    ['Foco LATAM-hispano',            '✓', '✓', '✓', '~'],
    ['Búsqueda con IA (Fase 2)',      '✓', '~', '✗', '~'],
  ];

  rows.forEach((row, i) => {
    const y = 2.18 + i * 0.43;
    const bg = i % 2 === 0 ? C.slate100 : C.white;
    s.addShape(prs.ShapeType.rect, {
      x: 0.5, y, w: 9, h: 0.41,
      fill: { color: bg }, line: { color: bg, width: 0 },
    });
    const widths = [2.85, 1.4, 1.55, 1.55, 1.55];
    let xs = 0.6;
    row.forEach((cell, j) => {
      let color = C.slate, weight = false;
      if (j > 0) {
        if (cell === '✓') { color = C.emerald; weight = true; }
        else if (cell === '✗') { color = C.red; weight = true; }
        else if (cell === '~') { color = C.amber; weight = true; }
      }
      s.addText(cell, {
        x: xs, y: y + 0.07, w: widths[j] - 0.1, h: 0.28,
        fontSize: j === 0 ? 11 : 14, bold: weight || j === 0, color,
        align: j === 0 ? 'left' : 'center', fontFace: F,
      });
      xs += widths[j] + 0.05;
    });
  });

  s.addText('✓ cubierto    ~ parcial    ✗ no cubierto', {
    x: 0.5, y: 4.85, w: 9, h: 0.32,
    fontSize: 10, italic: true, color: C.slate500, align: 'center', fontFace: F,
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 10 — AGENCIAS = MULTIPLICADOR
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
    { tag: 'x10',  text: '1 agencia con 10 clientes = 10 anunciantes con un solo onboarding' },
    { tag: 'LTV',  text: 'Alta retención: una agencia que opera en SpotU no migra fácilmente' },
    { tag: 'PRO',  text: 'Profesionalizan la demanda: campañas mejor estructuradas, más valor para todos' },
    { tag: '2x',   text: 'Plan Agency ($9.99/mes) — ARPU 2x vs usuario básico, LTV objetivo >$500 USD' },
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
    s.addText(p.tag, {
      x: 0.65, y: y + 0.14, w: 0.62, h: 0.44,
      fontSize: 11, bold: true, color: C.white, align: 'center', fontFace: F,
    });
    s.addText(p.text, {
      x: 1.42, y: y + 0.17, w: 7.9, h: 0.38,
      fontSize: 14, color: 'E0E7FF', fontFace: F,
    });
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 11 — TRACCIÓN & ROADMAP
// ════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  s.background = { color: C.white };
  accentBar(s, 'Tracción & Roadmap');
  topRightLogo(s);
  slideTitle(s, 'El MVP funciona. Ahora a crecer.');
  hRule(s);

  const milestones = [
    { phase: 'HOY',     label: 'MVP en producción',    desc: 'spotu.online activo con pagos, auth, feed y dashboard',  color: C.emerald, done: true },
    { phase: 'MES 1-2', label: 'Primeros 250 pioneros',desc: 'Onboarding en Colombia, México y Florida',                color: C.indigo,  done: false },
    { phase: 'MES 2-3', label: 'IA + contratos',       desc: 'Búsqueda semántica con Claude API y contratos digitales', color: C.indigo,  done: false },
    { phase: 'MES 5-6', label: '$2,000 MRR',           desc: '400+ usuarios de pago activos en 3 mercados',             color: C.coral,   done: false },
  ];

  s.addShape(prs.ShapeType.line, {
    x: 1.12, y: 2.58, w: 7.75, h: 0,
    line: { color: C.slate200, width: 2 },
  });

  milestones.forEach((m, i) => {
    const cx = 1.12 + i * 2.58;
    s.addShape(prs.ShapeType.ellipse, {
      x: cx - 0.3, y: 2.28, w: 0.6, h: 0.6,
      fill: { color: m.done ? C.emerald : m.color },
      line: { color: m.done ? C.emerald : m.color, width: 0 },
    });
    if (m.done) {
      s.addText('OK', {
        x: cx - 0.3, y: 2.32, w: 0.6, h: 0.5,
        fontSize: 11, bold: true, color: C.white, align: 'center', fontFace: F,
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

  s.addText('Costos operativos < $70 USD/mes  ·  Break-even con 15 usuarios de pago  ·  Margen bruto >85%', {
    x: 0.5, y: 5.0, w: 9, h: 0.38,
    fontSize: 11, color: C.slate500, align: 'center', fontFace: F,
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 12 — POR QUÉ AHORA
// ════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  s.background = { color: C.white };
  accentBar(s, 'Por Qué Ahora');
  topRightLogo(s);
  slideTitle(s, 'El timing es favorable');
  hRule(s);

  const reasons = [
    { title: 'Digitalización SMB',         body: 'Los negocios pequeños y medianos LATAM están migrando presupuesto publicitario a canales medibles y locales.', fill: C.indigoLight, line: C.indigoPale },
    { title: 'Boom del nearshoring',       body: 'México atrae empresas que necesitan publicidad local. Nuevo presupuesto en busca de canales de distribución.', fill: C.indigoLight, line: C.indigoPale },
    { title: 'Economía de creadores',      body: 'Podcasters, influencers y webs quieren monetizar su audiencia. Son los espacios digitales independientes de SpotU.', fill: C.coralLight,  line: C.coralPale  },
    { title: 'IA accesible para matching', body: 'Hoy es viable conectar oferta y demanda con búsqueda semántica a bajo costo en toda LATAM.', fill: C.coralLight, line: C.coralPale },
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
      x: x + 0.2, y: y + 0.68, w: 3.97, h: 0.85,
      fontSize: 12, color: C.slate500, fontFace: F,
    });
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 13 — CIERRE / CTA
// ════════════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  s.background = { color: C.indigoDark };

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

  // Logo top center
  s.addImage({
    path: A('logo-dark-bg.png'),
    x: 4.0, y: 0.4, w: 2, h: 0.6,
    sizing: { type: 'contain', w: 2, h: 0.6 },
  });

  s.addText('Hay una franja del mercado', {
    x: 0.5, y: 1.4, w: 9, h: 0.7,
    fontSize: 30, bold: true, color: C.white, align: 'center', fontFace: F,
  });
  s.addText('que aún no encuentra su lugar.', {
    x: 0.5, y: 1.95, w: 9, h: 0.7,
    fontSize: 30, bold: true, color: C.coral, align: 'center', fontFace: F,
  });
  s.addText('Construyamos ese lugar juntos.', {
    x: 0.5, y: 2.6, w: 9, h: 0.7,
    fontSize: 30, bold: true, color: C.indigoPale, align: 'center', fontFace: F,
  });

  s.addShape(prs.ShapeType.rect, {
    x: 3.6, y: 3.55, w: 2.8, h: 0.06,
    fill: { color: C.coral },
    line: { color: C.coral, width: 0 },
  });

  s.addText('spotu.online   ·   admin@spotu.online', {
    x: 0.5, y: 3.78, w: 9, h: 0.45,
    fontSize: 16, color: C.indigoPale, align: 'center', fontFace: F,
  });

  s.addText('Cesar Emilio Castaño Marin  ·  Fundador de SpotU', {
    x: 0.5, y: 4.4, w: 9, h: 0.38,
    fontSize: 13, color: C.indigoSoft, align: 'center', fontFace: F,
  });
}

// ── Save ──────────────────────────────────────────────────────────────────
prs.writeFile({ fileName: 'c:/Users/cesar/OneDrive/Escritorio/FREELANCE/SpotU/docs/SpotU_Presentacion.pptx' })
  .then(() => console.log('Presentacion guardada: docs/SpotU_Presentacion.pptx'))
  .catch(err => { console.error('Error:', err); process.exit(1); });
