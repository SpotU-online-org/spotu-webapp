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
  "cta.title.line1": {
    es: "Tu primera publicación",
    en: "Your first listing",
  },
  "cta.title.line2.prefix": { es: "es ", en: "is " },
  "cta.title.free": { es: "gratis", en: "free" },
  "cta.title.line2": { es: "por 30 días.", en: "for 30 days." },
  "cta.title.line2.suffix": { es: " por 30 días.", en: " for 30 days." },
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
  "footer.whatsapp": {
    es: "WhatsApp (próximamente)",
    en: "WhatsApp (coming soon)",
  },
  "footer.contact": { es: "Contáctanos", en: "Contact us" },
  // Steps prefix
  "steps.prefix": { es: "Paso", en: "Step" },
  // Auth - shared
  "auth.google": { es: "Continuar con Google", en: "Continue with Google" },
  "auth.or_email": { es: "o con correo", en: "or with email" },
  "auth.email": { es: "Correo electrónico", en: "Email" },
  "auth.email_ph": { es: "tu@correo.com", en: "you@email.com" },
  "auth.password": { es: "Contraseña", en: "Password" },
  "auth.forgot_password": { es: "¿Olvidaste tu contraseña?", en: "Forgot your password?" },
  // Auth - Login
  "auth.login.title": { es: "Bienvenido de vuelta", en: "Welcome back" },
  "auth.login.subtitle": { es: "Inicia sesión en tu cuenta de SpotU.", en: "Sign in to your SpotU account." },
  "auth.login.password_ph": { es: "Tu contraseña", en: "Your password" },
  "auth.login.submit": { es: "Iniciar sesión", en: "Sign in" },
  "auth.login.no_account": { es: "¿No tienes cuenta?", en: "Don't have an account?" },
  "auth.login.register_link": { es: "Regístrate gratis", en: "Register free" },
  // Auth - Register
  "auth.register.step1": { es: "Tu perfil", en: "Your profile" },
  "auth.register.step2": { es: "Tu cuenta", en: "Your account" },
  "auth.register.how": { es: "¿Cómo usarás SpotU?", en: "How will you use SpotU?" },
  "auth.register.pick_role": { es: "Selecciona el perfil que mejor te describe.", en: "Select the profile that best describes you." },
  "auth.register.continue": { es: "Continuar", en: "Continue" },
  "auth.register.already": { es: "¿Ya tienes cuenta?", en: "Already have an account?" },
  "auth.register.login_link": { es: "Inicia sesión", en: "Sign in" },
  "auth.register.change_role": { es: "← Cambiar perfil", en: "← Change profile" },
  "auth.register.create_title": { es: "Crea tu cuenta", en: "Create your account" },
  "auth.register.create_subtitle": { es: "Primera publicación gratis por 30 días. Sin tarjeta.", en: "First listing free for 30 days. No card needed." },
  "auth.register.name": { es: "Nombre completo", en: "Full name" },
  "auth.register.name_ph": { es: "Tu nombre o el de tu empresa", en: "Your name or company name" },
  "auth.register.password_ph": { es: "Mínimo 6 caracteres", en: "Minimum 6 characters" },
  "auth.register.submit": { es: "Crear cuenta gratis", en: "Create free account" },
  "auth.register.terms_pre": { es: "Al registrarte aceptas nuestros", en: "By registering you accept our" },
  "auth.register.terms_link": { es: "Términos de uso", en: "Terms of use" },
  "auth.register.and": { es: "y", en: "and" },
  "auth.register.privacy_link": { es: "Política de privacidad", en: "Privacy policy" },
  // Auth - Setup
  "auth.setup.title": { es: "¿Cómo usarás SpotU?", en: "How will you use SpotU?" },
  "auth.setup.subtitle": { es: "Puedes seleccionar más de uno si aplica.", en: "You can select more than one if applicable." },
  "auth.setup.continue": { es: "Continuar al dashboard", en: "Continue to dashboard" },
  // Role labels (shared across register + setup)
  "role.advertiser.title": { es: "Anunciante", en: "Advertiser" },
  "role.advertiser.desc": { es: "Busco espacios publicitarios o agencias para mi marca.", en: "Looking for ad spaces or agencies for my brand." },
  "role.space_owner.title": { es: "Espacio publicitario", en: "Ad space" },
  "role.space_owner.desc": { es: "Tengo un espacio publicitario para ofrecer.", en: "I have an advertising space to offer." },
  "role.agency.title": { es: "Agencia de marketing", en: "Marketing agency" },
  "role.agency.desc": { es: "Ofrezco servicios profesionales de marketing.", en: "I offer professional marketing services." },
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
