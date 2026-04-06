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
    heading: "Términos de Uso",
    updated: "Última actualización: abril de 2026",
    sections: [
      {
        title: "1. Aceptación de los términos",
        content: [
          'Al acceder o usar SpotU ("la plataforma"), disponible en spotu.online, aceptas estar vinculado por estos Términos de Uso. Si no estás de acuerdo con alguno de los términos, no uses el servicio.',
          "SpotU se reserva el derecho de modificar estos términos en cualquier momento. Los cambios materiales serán notificados con al menos 15 días de anticipación.",
        ],
      },
      {
        title: "2. Descripción del servicio",
        content: [
          "SpotU es un marketplace de intermediación pura que facilita la conexión entre:",
          {
            list: [
              "Anunciantes que buscan espacios publicitarios.",
              "Propietarios de espacios publicitarios físicos o digitales.",
              "Agencias de marketing que ofrecen servicios a anunciantes y espacios.",
            ],
          },
          "SpotU no es parte de ninguna transacción comercial entre usuarios. No garantizamos el éxito de las negociaciones ni la calidad de los servicios. El contacto y cierre de acuerdos ocurren directamente entre las partes.",
        ],
      },
      {
        title: "3. Registro y cuentas",
        content: [
          {
            list: [
              "Debes tener al menos 18 años para crear una cuenta.",
              "La información de registro debe ser veraz, completa y actualizada.",
              "Eres responsable de mantener la confidencialidad de tus credenciales.",
              "No puedes crear cuentas en nombre de terceros sin su autorización expresa.",
              "SpotU puede suspender o eliminar cuentas que violen estos términos.",
            ],
          },
        ],
      },
      {
        title: "4. Publicaciones",
        content: [
          "Al publicar en SpotU, garantizas que:",
          {
            list: [
              "La información es veraz, precisa y no es engañosa.",
              "Tienes los derechos necesarios sobre el contenido e imágenes que publicas.",
              "El contenido no infringe derechos de terceros ni viola leyes aplicables.",
              "No publicarás contenido ilegal, difamatorio, obsceno, amenazante o fraudulento.",
              "No usarás la plataforma para enviar spam ni realizar publicidad no solicitada.",
            ],
          },
          "SpotU se reserva el derecho de eliminar publicaciones que violen estos términos, sin previo aviso.",
        ],
      },
      {
        title: "5. Precios y facturación",
        content: [
          "Los precios actuales del servicio son:",
          {
            list: [
              "Primera publicación: gratuita por 30 días desde la creación (usuarios no pioneros). Al término del período gratuito, aplica la tarifa mensual correspondiente.",
              "Espacios publicitarios y anunciantes: USD $4.99/mes por publicación activa.",
              "Agencias de marketing: USD $9.99/mes por publicación activa.",
              "Boost: USD $2.99/semana (espacios/anunciantes) o USD $4.99/semana (agencias). Posiciona la publicación en primer lugar por 7 días.",
              "Usuarios pioneros (primeros 100 registrados por fecha de creación): publicaciones activas gratuitas durante 1 año desde su registro.",
            ],
          },
          "Las suscripciones se renuevan automáticamente cada mes. SpotU cobra en dólares estadounidenses (USD) a través de Stripe. Al proporcionar un método de pago, autorizas los cargos recurrentes.",
          "Si desactivas una publicación antes de que venza el período de facturación, no se emitirán reembolsos por el período ya pagado. Si desactivas durante el período gratuito, no se realizará ningún cargo.",
        ],
      },
      {
        title: "6. Cancelación y reembolsos",
        content: [
          "Puedes cancelar tu suscripción en cualquier momento desde tu dashboard o el portal de suscripciones de Stripe. La cancelación surte efecto al final del período de facturación en curso.",
          "No ofrecemos reembolsos por períodos ya cobrados, excepto en casos de error de cobro duplicado o falla técnica imputable a SpotU. Para solicitar un reembolso, escríbenos a admin@spotu.online dentro de los 7 días siguientes al cargo.",
        ],
      },
      {
        title: "7. Propiedad intelectual",
        content: [
          "Al publicar contenido en SpotU, nos otorgas una licencia no exclusiva, mundial, libre de regalías para mostrar y distribuir ese contenido en el contexto del servicio. Conservas todos los derechos sobre tu contenido.",
          "Los nombres, logotipos, diseño y código de SpotU son propiedad de SpotU y están protegidos por derechos de autor. No puedes usarlos sin autorización escrita.",
        ],
      },
      {
        title: "8. Limitación de responsabilidad",
        content: [
          "SpotU actúa exclusivamente como intermediario y no es responsable de:",
          {
            list: [
              "La veracidad, exactitud o calidad del contenido publicado por los usuarios.",
              "Las transacciones, acuerdos o disputas entre usuarios.",
              "Pérdidas económicas derivadas del uso o imposibilidad de uso del servicio.",
              "Interrupciones del servicio por mantenimiento, fallas técnicas o causas de fuerza mayor.",
            ],
          },
          "En ningún caso la responsabilidad total de SpotU hacia un usuario superará el monto pagado por dicho usuario en los últimos 3 meses.",
        ],
      },
      {
        title: "9. Conducta prohibida",
        content: [
          "Está prohibido usar SpotU para:",
          {
            list: [
              "Actividades ilegales o que infrinjan derechos de terceros.",
              "Publicar información falsa o engañosa sobre productos o servicios.",
              "Acceder sin autorización a sistemas o datos de otros usuarios.",
              "Interferir con el funcionamiento de la plataforma (ataques DDoS, scraping masivo, etc.).",
              "Crear cuentas falsas o múltiples cuentas con fines de manipulación.",
              "Eludir sistemas de pago o usar métodos de pago fraudulentos.",
            ],
          },
        ],
      },
      {
        title: "10. Ley aplicable y resolución de disputas",
        content: [
          "Estos términos se rigen por las leyes de la República de México, sin perjuicio de los derechos del consumidor aplicables en Colombia y Estados Unidos según la ubicación del usuario.",
          "Para usuarios en Colombia, también aplican las disposiciones de la Ley 1480 de 2011 (Estatuto del Consumidor). Para usuarios en Florida, aplican las leyes estatales pertinentes.",
          "Cualquier disputa será sometida a arbitraje vinculante o, de no ser posible, a los tribunales competentes según la ubicación del usuario.",
        ],
      },
      {
        title: "11. Contacto",
        content: ["Para preguntas sobre estos términos o el servicio en general: admin@spotu.online"],
      },
    ],
  },
  en: {
    heading: "Terms of Use",
    updated: "Last updated: April 2026",
    sections: [
      {
        title: "1. Acceptance of terms",
        content: [
          'By accessing or using SpotU ("the platform"), available at spotu.online, you agree to be bound by these Terms of Use. If you do not agree with any of the terms, do not use the service.',
          "SpotU reserves the right to modify these terms at any time. Material changes will be notified at least 15 days in advance.",
        ],
      },
      {
        title: "2. Description of service",
        content: [
          "SpotU is a pure intermediary marketplace that facilitates connections between:",
          {
            list: [
              "Advertisers looking for advertising spaces.",
              "Owners of physical or digital advertising spaces.",
              "Marketing agencies offering services to advertisers and spaces.",
            ],
          },
          "SpotU is not a party to any commercial transaction between users. We do not guarantee the success of negotiations or the quality of services. Contact and agreement occur directly between the parties.",
        ],
      },
      {
        title: "3. Registration and accounts",
        content: [
          {
            list: [
              "You must be at least 18 years old to create an account.",
              "Registration information must be truthful, complete, and up to date.",
              "You are responsible for maintaining the confidentiality of your credentials.",
              "You may not create accounts on behalf of third parties without their express authorization.",
              "SpotU may suspend or delete accounts that violate these terms.",
            ],
          },
        ],
      },
      {
        title: "4. Listings",
        content: [
          "By publishing on SpotU, you guarantee that:",
          {
            list: [
              "The information is truthful, accurate, and not misleading.",
              "You have the necessary rights over the content and images you publish.",
              "The content does not infringe third-party rights or violate applicable laws.",
              "You will not publish illegal, defamatory, obscene, threatening, or fraudulent content.",
              "You will not use the platform to send spam or unsolicited advertising.",
            ],
          },
          "SpotU reserves the right to remove listings that violate these terms, without prior notice.",
        ],
      },
      {
        title: "5. Pricing and billing",
        content: [
          "Current service prices are:",
          {
            list: [
              "First listing: free for 30 days from creation (non-pioneer users). After the free period, the corresponding monthly fee applies.",
              "Ad spaces and advertisers: USD $4.99/month per active listing.",
              "Marketing agencies: USD $9.99/month per active listing.",
              "Boost: USD $2.99/week (spaces/advertisers) or USD $4.99/week (agencies). Places the listing first in the feed for 7 days.",
              "Pioneer users (first 100 registered by creation date): free active listings for 1 year from registration.",
            ],
          },
          "Subscriptions renew automatically each month. SpotU charges in US dollars (USD) via Stripe. By providing a payment method, you authorize recurring charges.",
          "If you deactivate a listing before the billing period ends, no refunds will be issued for the already-paid period. If you deactivate during the free trial, no charge will be made.",
        ],
      },
      {
        title: "6. Cancellation and refunds",
        content: [
          "You may cancel your subscription at any time from your dashboard or Stripe's subscription portal. Cancellation takes effect at the end of the current billing period.",
          "We do not offer refunds for already-charged periods, except in cases of duplicate billing errors or technical failures attributable to SpotU. To request a refund, email admin@spotu.online within 7 days of the charge.",
        ],
      },
      {
        title: "7. Intellectual property",
        content: [
          "By publishing content on SpotU, you grant us a non-exclusive, worldwide, royalty-free license to display and distribute that content in the context of the service. You retain all intellectual property rights over your content.",
          "SpotU's names, logos, design, and code are the property of SpotU and are protected by copyright. You may not use them without written authorization.",
        ],
      },
      {
        title: "8. Limitation of liability",
        content: [
          "SpotU acts exclusively as an intermediary and is not responsible for:",
          {
            list: [
              "The truthfulness, accuracy, or quality of content published by users.",
              "Transactions, agreements, or disputes between users.",
              "Economic losses arising from the use or inability to use the service.",
              "Service interruptions due to maintenance, technical failures, or force majeure.",
            ],
          },
          "In no event shall SpotU's total liability to a user exceed the amount paid by that user in the last 3 months.",
        ],
      },
      {
        title: "9. Prohibited conduct",
        content: [
          "It is prohibited to use SpotU for:",
          {
            list: [
              "Illegal activities or those that infringe third-party rights.",
              "Publishing false or misleading information about products or services.",
              "Unauthorized access to other users' systems or data.",
              "Interfering with the platform's operation (DDoS attacks, mass scraping, etc.).",
              "Creating fake accounts or multiple accounts for manipulation purposes.",
              "Circumventing payment systems or using fraudulent payment methods.",
            ],
          },
        ],
      },
      {
        title: "10. Applicable law and dispute resolution",
        content: [
          "These terms are governed by the laws of the Republic of Mexico, without prejudice to consumer rights applicable in Colombia and the United States according to the user's location.",
          "For users in Colombia, the provisions of Law 1480 of 2011 (Consumer Statute) also apply. For users in Florida, relevant state laws apply.",
          "Any dispute will be submitted to binding arbitration or, if not possible, to the competent courts according to the user's location.",
        ],
      },
      {
        title: "11. Contact",
        content: ["For questions about these terms or the service in general: admin@spotu.online"],
      },
    ],
  },
};

export default function TermsPage() {
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
