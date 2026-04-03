"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

type Locale = "es" | "en";

type I18nContextValue = {
  locale: Locale;
  t: (key: string) => string;
  toggleLocale: () => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const TRANSLATIONS: Record<string, Record<Locale, string>> = {
  // Nav
  "nav.explore": { es: "Explorar", en: "Explore" },
  "nav.publish": { es: "Publicar", en: "Publish" },
  "nav.login": { es: "Iniciar sesión", en: "Sign in" },
  "nav.register": { es: "Empieza gratis", en: "Start free" },
  // Hero
  "hero.badge": {
    es: "Publica gratis tu primer anuncio por 30 días",
    en: "Publish your first ad free for 30 days",
  },
  "hero.title.1": {
    es: "Marcas, espacios y expertos.",
    en: "Brands, spaces & experts.",
  },
  "hero.title.2": { es: "Un solo lugar.", en: "One place." },
  "hero.description": {
    es: "SpotU conecta anunciantes con espacios publicitarios y agencias de marketing. Publica tu oferta, descubre oportunidades y contacta directo.",
    en: "SpotU connects advertisers with ad spaces and marketing agencies. Publish your offer, discover opportunities and contact directly.",
  },
  "hero.cta.primary": { es: "Empieza gratis", en: "Start free" },
  "hero.cta.secondary": {
    es: "Explorar publicaciones",
    en: "Browse listings",
  },
  // Roles
  "roles.title": {
    es: "Un marketplace para cada actor",
    en: "A marketplace for every player",
  },
  "roles.description": {
    es: "SpotU conecta los tres lados del ecosistema publicitario en una sola plataforma.",
    en: "SpotU connects the three sides of the advertising ecosystem in one platform.",
  },
  "roles.advertisers.title": { es: "Anunciantes", en: "Advertisers" },
  "roles.advertisers.description": {
    es: "Encuentra espacios publicitarios y agencias de marketing para tu marca. Busca, compara y contacta directo.",
    en: "Find ad spaces and marketing agencies for your brand. Search, compare and contact directly.",
  },
  "roles.advertisers.cta": { es: "Buscar espacios", en: "Find spaces" },
  "roles.spaces.title": { es: "Espacios publicitarios", en: "Ad spaces" },
  "roles.spaces.description": {
    es: "Publica tu valla, pantalla LED, sitio web o red social. Conecta con anunciantes que buscan tu espacio.",
    en: "List your billboard, LED screen, website or social media. Connect with advertisers looking for your space.",
  },
  "roles.spaces.cta": { es: "Publicar espacio", en: "List your space" },
  "roles.agencies.title": {
    es: "Agencias de marketing",
    en: "Marketing agencies",
  },
  "roles.agencies.description": {
    es: "Ofrece tus servicios profesionales. Encuentra clientes y gestiona espacios para ellos.",
    en: "Offer your professional services. Find clients and manage spaces for them.",
  },
  "roles.agencies.cta": { es: "Registrar agencia", en: "Register agency" },
  // Steps
  "steps.title": { es: "Cómo funciona", en: "How it works" },
  "steps.description": {
    es: "Tres pasos simples para conectar con el actor que necesitas.",
    en: "Three simple steps to connect with who you need.",
  },
  "steps.1.title": { es: "Descubre", en: "Discover" },
  "steps.1.description": {
    es: "Explora espacios publicitarios, agencias de marketing o solicitudes de anunciantes.",
    en: "Explore ad spaces, marketing agencies or advertiser requests.",
  },
  "steps.2.title": { es: "Conecta", en: "Connect" },
  "steps.2.description": {
    es: "Contacta directamente por WhatsApp o correo. Sin intermediarios, sin complicaciones.",
    en: "Contact directly via WhatsApp or email. No middlemen, no hassle.",
  },
  "steps.3.title": { es: "Cierra", en: "Close" },
  "steps.3.description": {
    es: "Acuerda los términos y comienza tu campaña publicitaria.",
    en: "Agree on terms and start your advertising campaign.",
  },
  // Features
  "features.title": {
    es: "Simple, directo, efectivo",
    en: "Simple, direct, effective",
  },
  "features.1.title": { es: "Publica en 2 minutos", en: "Publish in 2 minutes" },
  "features.1.description": {
    es: "Formulario simple y guiado para publicar tu espacio o servicio.",
    en: "Simple guided form to publish your space or service.",
  },
  "features.2.title": { es: "Stats en tiempo real", en: "Real-time stats" },
  "features.2.description": {
    es: "Mide cuántas personas ven tu publicación y cuántas te contactan.",
    en: "Track how many people view your listing and how many contact you.",
  },
  "features.3.title": { es: "Contacto directo", en: "Direct contact" },
  "features.3.description": {
    es: "WhatsApp y correo directo. Tú controlas la conversación desde el primer momento.",
    en: "WhatsApp and direct email. You control the conversation from the start.",
  },
  // CTA
  "cta.title": {
    es: "Tu primera publicación es gratis por 30 días.",
    en: "Your first listing is free for 30 days.",
  },
  "cta.description": {
    es: "Publica tu espacio, ofrece tus servicios o encuentra la publicidad perfecta para tu marca.",
    en: "List your space, offer your services or find the perfect advertising for your brand.",
  },
  "cta.primary": { es: "Crear cuenta gratis", en: "Create free account" },
  "cta.secondary": { es: "Explorar sin cuenta", en: "Browse without account" },
  // Footer
  "footer.tagline": {
    es: "Tu spot publicitario ideal. Conectamos marcas, espacios y expertos en un solo lugar.",
    en: "Your ideal advertising spot. We connect brands, spaces and experts in one place.",
  },
  "footer.platform": { es: "Plataforma", en: "Platform" },
  "footer.explore_spaces": { es: "Explorar espacios", en: "Explore spaces" },
  "footer.publish": { es: "Publicar", en: "Publish" },
  "footer.find_agencies": { es: "Encontrar agencias", en: "Find agencies" },
  "footer.resources": { es: "Recursos", en: "Resources" },
  "footer.pricing": { es: "Precios", en: "Pricing" },
  "footer.about": { es: "Nosotros", en: "About" },
  "footer.legal": { es: "Legal", en: "Legal" },
  "footer.terms": { es: "Términos de uso", en: "Terms of use" },
  "footer.privacy": { es: "Privacidad", en: "Privacy" },
  "footer.rights": {
    es: "Todos los derechos reservados.",
    en: "All rights reserved.",
  },
  // Steps prefix
  "steps.prefix": { es: "Paso", en: "Step" },
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("es");

  const t = useCallback(
    (key: string): string => {
      const entry = TRANSLATIONS[key];
      if (!entry) return key;
      return entry[locale] ?? key;
    },
    [locale]
  );

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === "es" ? "en" : "es"));
  }, []);

  return (
    <I18nContext.Provider value={{ locale, t, toggleLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}

export function LanguageToggle() {
  const { locale, toggleLocale } = useI18n();
  const nextLocale = locale === "es" ? "EN" : "ES";

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLocale}
      aria-label={locale === "es" ? "Switch to English" : "Cambiar a Español"}
      className="gap-1.5 text-muted-foreground hover:text-foreground"
    >
      <Globe className="h-4 w-4" />
      <span className="text-xs font-semibold">{nextLocale}</span>
    </Button>
  );
}
