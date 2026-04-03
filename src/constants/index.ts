export const SITE_NAME = "SpotU";
export const SITE_TAGLINE = "Tu spot publicitario ideal";
export const SITE_DESCRIPTION =
  "Marketplace de publicidad que conecta anunciantes, espacios publicitarios y agencias de marketing.";

export const NAV_LINKS = [
  { label: "Explorar", href: "/feed" },
  { label: "Publicar", href: "/publish" },
] as const;

export const USER_ROLES = {
  advertiser: {
    label: "Quiero anunciarme",
    description: "Busca espacios publicitarios y agencias para tu marca",
    icon: "Megaphone",
  },
  space_owner: {
    label: "Tengo un espacio publicitario",
    description: "Publica tu espacio y conecta con anunciantes",
    icon: "MapPin",
  },
  agency: {
    label: "Soy agencia de marketing",
    description: "Ofrece tus servicios a anunciantes y gestiona espacios",
    icon: "Briefcase",
  },
} as const;

export const SPACE_CATEGORIES = [
  { value: "billboard", label: "Valla publicitaria" },
  { value: "led_screen", label: "Pantalla LED" },
  { value: "sports_venue", label: "Recinto deportivo" },
  { value: "social_media", label: "Red social" },
  { value: "website", label: "Sitio web" },
  { value: "app", label: "App móvil" },
  { value: "print", label: "Impreso" },
  { value: "radio", label: "Radio" },
  { value: "podcast", label: "Podcast" },
  { value: "other", label: "Otro" },
] as const;

export const AGENCY_SERVICES = [
  { value: "campaign_management", label: "Gestión de campañas" },
  { value: "creative_design", label: "Diseño creativo" },
  { value: "media_buying", label: "Media buying" },
  { value: "social_media_management", label: "Manejo de redes" },
  { value: "seo_sem", label: "SEO/SEM" },
  { value: "branding", label: "Branding" },
] as const;

export const PRICE_PERIODS = [
  { value: "day", label: "Por día" },
  { value: "week", label: "Por semana" },
  { value: "month", label: "Por mes" },
  { value: "campaign", label: "Por campaña" },
] as const;

export const MARKETS = [
  { value: "CO", label: "Colombia" },
  { value: "MX", label: "México" },
  { value: "US", label: "Estados Unidos" },
] as const;
