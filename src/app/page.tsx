import Link from "next/link";
import {
  Megaphone,
  MapPin,
  Briefcase,
  Search,
  MousePointerClick,
  Handshake,
  ArrowRight,
  Zap,
  Eye,
  Shield,
} from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const ROLES = [
  {
    icon: Megaphone,
    title: "Anunciantes",
    description:
      "Encuentra espacios publicitarios y agencias de marketing para tu marca. Busca, compara y contacta directo.",
    cta: "Buscar espacios",
    href: "/feed",
    color: "text-indigo",
    bg: "bg-indigo/10",
  },
  {
    icon: MapPin,
    title: "Espacios publicitarios",
    description:
      "Publica tu valla, pantalla LED, sitio web o red social. Conecta con anunciantes que buscan tu espacio.",
    cta: "Publicar espacio",
    href: "/auth/register",
    color: "text-coral",
    bg: "bg-coral/10",
  },
  {
    icon: Briefcase,
    title: "Agencias de marketing",
    description:
      "Ofrece tus servicios profesionales. Encuentra clientes y gestiona espacios para ellos.",
    cta: "Registrar agencia",
    href: "/auth/register",
    color: "text-emerald",
    bg: "bg-emerald/10",
  },
];

const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Descubre",
    description:
      "Explora espacios publicitarios, agencias de marketing o solicitudes de anunciantes.",
  },
  {
    icon: MousePointerClick,
    step: "02",
    title: "Conecta",
    description:
      "Contacta directamente por WhatsApp o correo. Sin intermediarios, sin complicaciones.",
  },
  {
    icon: Handshake,
    step: "03",
    title: "Cierra",
    description:
      "Acuerda los términos y comienza tu campaña publicitaria.",
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Publica en 2 minutos",
    description:
      "Formulario simple y guiado para publicar tu espacio o servicio.",
  },
  {
    icon: Eye,
    title: "Stats en tiempo real",
    description:
      "Mide cuántas personas ven tu publicación y cuántas te contactan.",
  },
  {
    icon: Shield,
    title: "Contacto directo",
    description:
      "WhatsApp y correo directo. Tú controlas la conversación desde el primer momento.",
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
                </span>
                Primeros 100 usuarios — primera publicación gratis
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Marcas, espacios y expertos.{" "}
                <span className="text-primary">Un solo lugar.</span>
              </h1>

              <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
                SpotU conecta anunciantes con espacios publicitarios y agencias
                de marketing. Publica tu oferta, descubre oportunidades y
                contacta directo.
              </p>

              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <LinkButton href="/auth/register" size="lg">
                  Empieza gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </LinkButton>
                <LinkButton href="/feed" size="lg" variant="outline">
                  Explorar publicaciones
                </LinkButton>
              </div>
            </div>
          </div>
        </section>

        {/* Roles */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Un marketplace para cada actor
              </h2>
              <p className="mt-4 text-muted-foreground">
                SpotU conecta los tres lados del ecosistema publicitario en una
                sola plataforma.
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {ROLES.map((role) => (
                <div
                  key={role.title}
                  className="group relative rounded-2xl border bg-card p-8 transition-shadow hover:shadow-lg"
                >
                  <div className={`inline-flex rounded-xl ${role.bg} p-3`}>
                    <role.icon className={`h-6 w-6 ${role.color}`} />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{role.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {role.description}
                  </p>
                  <Link
                    href={role.href}
                    className={`mt-6 inline-flex items-center text-sm font-medium ${role.color} hover:underline`}
                  >
                    {role.cta}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-muted/40 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Cómo funciona
              </h2>
              <p className="mt-4 text-muted-foreground">
                Tres pasos simples para conectar con el actor que necesitas.
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-3">
              {STEPS.map((step) => (
                <div key={step.step} className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <span className="mt-4 block text-xs font-bold uppercase tracking-wider text-primary">
                    Paso {step.step}
                  </span>
                  <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Simple, directo, efectivo
              </h2>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-3">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="flex flex-col items-center text-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Empieza hoy. Los primeros 100 usuarios publican gratis.
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Publica tu espacio, ofrece tus servicios o encuentra la
              publicidad perfecta para tu marca.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <LinkButton
                href="/auth/register"
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
              >
                Crear cuenta gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </LinkButton>
              <LinkButton
                href="/feed"
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Explorar sin cuenta
              </LinkButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
