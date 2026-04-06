"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useI18n } from "@/components/layout/LanguageToggle";

type Section = {
  title: string;
  content: (string | { list: string[] })[];
};

type PageContent = {
  heading: string;
  updated: string;
  sections: Section[];
};

const CONTENT: Record<"es" | "en", PageContent> = {
  es: {
    heading: "Política de Privacidad",
    updated: "Última actualización: abril de 2026",
    sections: [
      {
        title: "1. Quiénes somos",
        content: [
          'SpotU ("nosotros", "nuestro") opera el marketplace en línea disponible en spotu.online, que conecta anunciantes, espacios publicitarios y agencias de marketing en Colombia, México y Estados Unidos. Puedes contactarnos en admin@spotu.online.',
        ],
      },
      {
        title: "2. Información que recopilamos",
        content: [
          {
            list: [
              "Información de cuenta: nombre, correo electrónico, tipo de cuenta y foto de perfil opcional.",
              "Información de publicaciones: título, descripción, ubicación, precio, imágenes y datos de contacto.",
              "Información de pago: procesamos pagos a través de Stripe. SpotU no almacena números de tarjeta directamente.",
              "Datos de uso: vistas de publicaciones, clics en botones de contacto, dirección IP, tipo de navegador y marca de tiempo.",
              "Cookies y almacenamiento local: utilizamos cookies de sesión para autenticación y preferencias de idioma.",
            ],
          },
        ],
      },
      {
        title: "3. Cómo usamos tu información",
        content: [
          {
            list: [
              "Crear y administrar tu cuenta y publicaciones.",
              "Procesar pagos de suscripciones y servicios de Boost.",
              "Mostrarte publicaciones relevantes según tus preferencias.",
              "Enviarte notificaciones transaccionales (confirmaciones de pago, vencimiento de publicaciones, etc.).",
              "Mejorar la plataforma, detectar fraude y garantizar la seguridad.",
              "Cumplir con obligaciones legales y regulatorias aplicables.",
            ],
          },
          "SpotU es un intermediario puro: no gestionamos ni mediamos en las transacciones comerciales entre usuarios.",
        ],
      },
      {
        title: "4. Compartir tu información",
        content: [
          "No vendemos tu información personal a terceros. Podemos compartirla con:",
          {
            list: [
              "Proveedores de servicio: Supabase (base de datos y autenticación), Stripe (pagos), Resend (correos) y Vercel (hospedaje).",
              "Otros usuarios: la información de tus publicaciones es pública y visible para cualquier visitante.",
              "Autoridades legales: cuando sea requerido por ley en Colombia, México o Estados Unidos.",
            ],
          },
        ],
      },
      {
        title: "5. Almacenamiento y seguridad",
        content: [
          "Tu información se almacena en servidores seguros operados por Supabase (región US East). Usamos HTTPS, autenticación con tokens de sesión seguros y políticas de seguridad a nivel de fila (RLS).",
          "Aunque implementamos medidas razonables de seguridad, ningún sistema es 100% seguro. Te recomendamos usar una contraseña fuerte.",
        ],
      },
      {
        title: "6. Retención de datos",
        content: [
          "Conservamos tu información mientras tu cuenta esté activa. Si eliminas tu cuenta, eliminaremos o anonimizaremos tus datos en un plazo de 30 días, excepto cuando debamos conservarlos por obligación legal (por ejemplo, registros de facturación por hasta 7 años).",
        ],
      },
      {
        title: "7. Tus derechos",
        content: [
          "Dependiendo de tu ubicación, puedes tener derecho a:",
          {
            list: [
              "Acceder a la información personal que tenemos sobre ti.",
              "Corregir datos inexactos o incompletos.",
              "Solicitar la eliminación de tu cuenta y datos personales.",
              "Oponerte al procesamiento de tus datos para fines de marketing.",
              "Solicitar la portabilidad de tus datos en formato legible por máquina.",
            ],
          },
          "Para ejercer cualquiera de estos derechos, escríbenos a admin@spotu.online. Responderemos en un plazo máximo de 30 días.",
        ],
      },
      {
        title: "8. Cookies",
        content: [
          "Utilizamos cookies esenciales para el funcionamiento de la sesión y el idioma. No utilizamos cookies de rastreo de terceros con fines publicitarios. Al usar SpotU, aceptas el uso de estas cookies esenciales.",
        ],
      },
      {
        title: "9. Menores de edad",
        content: [
          "SpotU no está dirigido a personas menores de 18 años. No recopilamos intencionalmente información de menores. Si detectamos que un menor ha creado una cuenta, la eliminaremos de forma inmediata.",
        ],
      },
      {
        title: "10. Cambios a esta política",
        content: [
          "Podemos actualizar esta política periódicamente. Te notificaremos por correo electrónico o mediante un aviso en la plataforma ante cambios materiales. El uso continuado de SpotU después de la notificación implica la aceptación de los cambios.",
        ],
      },
      {
        title: "11. Contacto",
        content: ["Para cualquier pregunta sobre esta política, contáctanos en: admin@spotu.online"],
      },
    ],
  },
  en: {
    heading: "Privacy Policy",
    updated: "Last updated: April 2026",
    sections: [
      {
        title: "1. Who we are",
        content: [
          'SpotU ("we", "our") operates the online marketplace at spotu.online, connecting advertisers, advertising spaces, and marketing agencies in Colombia, Mexico, and the United States. Contact us at admin@spotu.online.',
        ],
      },
      {
        title: "2. Information we collect",
        content: [
          {
            list: [
              "Account information: name, email address, account type, and optional profile photo.",
              "Listing information: title, description, location, price, images, and contact details.",
              "Payment information: payments are processed via Stripe. SpotU does not store card numbers directly.",
              "Usage data: listing views, contact button clicks, IP address, browser type, and timestamps.",
              "Cookies and local storage: we use session cookies for authentication and language preferences.",
            ],
          },
        ],
      },
      {
        title: "3. How we use your information",
        content: [
          {
            list: [
              "Create and manage your account and listings.",
              "Process subscription payments and Boost services.",
              "Show you relevant listings based on your preferences.",
              "Send you transactional notifications (payment confirmations, listing expiration, etc.).",
              "Improve the platform, detect fraud, and ensure service security.",
              "Comply with applicable legal and regulatory obligations.",
            ],
          },
          "SpotU is a pure intermediary: we do not manage or mediate commercial transactions between users.",
        ],
      },
      {
        title: "4. Sharing your information",
        content: [
          "We do not sell your personal information to third parties. We may share it with:",
          {
            list: [
              "Service providers: Supabase (database and authentication), Stripe (payments), Resend (email), and Vercel (hosting).",
              "Other users: information in your listings is public and visible to any visitor.",
              "Legal authorities: when required by law in Colombia, Mexico, or the United States.",
            ],
          },
        ],
      },
      {
        title: "5. Storage and security",
        content: [
          "Your information is stored on secure servers operated by Supabase (US East region). We use HTTPS, secure session token authentication, and row-level security (RLS) policies.",
          "While we implement reasonable security measures, no system is 100% secure. We recommend using a strong password.",
        ],
      },
      {
        title: "6. Data retention",
        content: [
          "We retain your information while your account is active. If you delete your account, we will delete or anonymize your personal data within 30 days, except when required to retain it by law (e.g., billing records for up to 7 years).",
        ],
      },
      {
        title: "7. Your rights",
        content: [
          "Depending on your location, you may have the right to:",
          {
            list: [
              "Access the personal information we hold about you.",
              "Correct inaccurate or incomplete data.",
              "Request deletion of your account and personal data.",
              "Object to processing of your data for marketing purposes.",
              "Request portability of your data in machine-readable format.",
            ],
          },
          "To exercise any of these rights, write to admin@spotu.online. We will respond within 30 days.",
        ],
      },
      {
        title: "8. Cookies",
        content: [
          "We use essential cookies for session functionality and language preferences. We do not use third-party tracking cookies for advertising purposes. By using SpotU, you accept the use of these essential cookies.",
        ],
      },
      {
        title: "9. Minors",
        content: [
          "SpotU is not directed at persons under 18 years of age. We do not intentionally collect information from minors. If we detect that a minor has created an account, we will delete it immediately.",
        ],
      },
      {
        title: "10. Changes to this policy",
        content: [
          "We may update this policy periodically. We will notify you by email or via a platform notice for material changes. Continued use of SpotU after notification implies acceptance of the changes.",
        ],
      },
      {
        title: "11. Contact",
        content: ["For any questions about this privacy policy, contact us at: admin@spotu.online"],
      },
    ],
  },
};

export default function PrivacyPage() {
  const { locale } = useI18n();
  const content = CONTENT[locale];

  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{content.heading}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{content.updated}</p>

          <div className="mt-10 space-y-10 text-sm leading-7 text-foreground/80">
            {content.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-lg font-semibold text-foreground mb-3">{section.title}</h2>
                {section.content.map((block, i) =>
                  typeof block === "string" ? (
                    <p key={i} className={i > 0 ? "mt-2" : undefined}>
                      {block.includes("admin@spotu.online") ? (
                        <>
                          {block.split("admin@spotu.online")[0]}
                          <a href="mailto:admin@spotu.online" className="text-primary hover:underline">
                            admin@spotu.online
                          </a>
                          {block.split("admin@spotu.online")[1]}
                        </>
                      ) : (
                        block
                      )}
                    </p>
                  ) : (
                    <ul key={i} className="list-disc pl-5 space-y-2 mt-2">
                      {block.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )
                )}
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
