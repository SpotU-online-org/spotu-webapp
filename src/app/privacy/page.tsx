import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Política de Privacidad — SpotU",
  description: "Política de privacidad de SpotU. Cómo recopilamos, usamos y protegemos tu información.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Política de Privacidad</h1>
          <p className="mt-2 text-sm text-muted-foreground">Última actualización: abril de 2025</p>

          <div className="mt-10 space-y-10 text-sm leading-7 text-foreground/80">

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">1. Quiénes somos</h2>
              <p>
                SpotU (&quot;nosotros&quot;, &quot;nuestro&quot;) opera el marketplace en línea disponible en{" "}
                <strong>spotu.online</strong>, que conecta anunciantes, espacios publicitarios y agencias de
                marketing en Colombia, México y Estados Unidos. Puedes contactarnos en{" "}
                <a href="mailto:admin@spotu.online" className="text-primary hover:underline">admin@spotu.online</a>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">2. Información que recopilamos</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Información de cuenta:</strong> nombre, correo electrónico, tipo de cuenta (anunciante,
                  espacio publicitario, agencia) y foto de perfil opcional.
                </li>
                <li>
                  <strong>Información de publicaciones:</strong> título, descripción, ubicación, precio,
                  imágenes, datos de contacto (WhatsApp y/o correo) y categorías asociadas.
                </li>
                <li>
                  <strong>Información de pago:</strong> procesamos pagos a través de Stripe. SpotU no almacena
                  números de tarjeta ni datos bancarios directamente; Stripe actúa como procesador y sus
                  políticas aplican a esa información.
                </li>
                <li>
                  <strong>Datos de uso:</strong> vistas de publicaciones, clics en botones de contacto,
                  dirección IP, tipo de navegador, páginas visitadas y marca de tiempo.
                </li>
                <li>
                  <strong>Cookies y almacenamiento local:</strong> utilizamos cookies de sesión para autenticación
                  y preferencias de idioma.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">3. Cómo usamos tu información</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Crear y administrar tu cuenta y publicaciones.</li>
                <li>Procesar pagos de suscripciones y servicios de Boost.</li>
                <li>Mostrarte publicaciones relevantes según tus preferencias y ubicación.</li>
                <li>Enviarte notificaciones transaccionales relacionadas con tu cuenta (confirmaciones de pago,
                  vencimiento de publicaciones, etc.).</li>
                <li>Mejorar la plataforma, detectar fraude y garantizar la seguridad del servicio.</li>
                <li>Cumplir con obligaciones legales y regulatorias aplicables.</li>
              </ul>
              <p className="mt-3">
                SpotU es un intermediario puro: <strong>no gestionamos ni mediamos en las transacciones
                comerciales</strong> entre usuarios. El contacto y negociación ocurren directamente entre las
                partes a través de los canales que cada usuario proporciona (WhatsApp, correo, sitio web).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">4. Compartir tu información</h2>
              <p>No vendemos tu información personal a terceros. Podemos compartirla con:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  <strong>Proveedores de servicio:</strong> Supabase (base de datos y autenticación), Stripe
                  (pagos), Resend (correos transaccionales) y Vercel (hospedaje). Cada proveedor actúa bajo
                  contratos de procesamiento de datos y cumple con sus propias políticas de privacidad.
                </li>
                <li>
                  <strong>Otros usuarios:</strong> la información que incluyes en tus publicaciones (nombre de
                  contacto, WhatsApp, correo, imágenes) es pública y visible para cualquier visitante del
                  marketplace.
                </li>
                <li>
                  <strong>Autoridades legales:</strong> cuando sea requerido por ley, orden judicial u obligación
                  regulatoria aplicable en Colombia, México o Estados Unidos.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">5. Almacenamiento y seguridad</h2>
              <p>
                Tu información se almacena en servidores seguros operados por Supabase (región US East). Usamos
                HTTPS en todas las comunicaciones, autenticación con tokens de sesión seguros y políticas de
                seguridad a nivel de fila (RLS) en nuestra base de datos para garantizar que solo accedas a tu
                propia información sensible.
              </p>
              <p className="mt-2">
                Aunque implementamos medidas razonables de seguridad, ningún sistema es 100 % seguro.
                Te recomendamos usar una contraseña fuerte y no compartir tus credenciales.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">6. Retención de datos</h2>
              <p>
                Conservamos tu información mientras tu cuenta esté activa. Si eliminas tu cuenta, eliminaremos
                o anonimizaremos tus datos personales en un plazo de 30 días, excepto cuando debamos conservarlos
                por obligación legal (por ejemplo, registros de facturación por hasta 7 años).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">7. Tus derechos</h2>
              <p>Dependiendo de tu ubicación, puedes tener derecho a:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Acceder a la información personal que tenemos sobre ti.</li>
                <li>Corregir datos inexactos o incompletos.</li>
                <li>Solicitar la eliminación de tu cuenta y datos personales.</li>
                <li>Oponerte al procesamiento de tus datos para fines de marketing.</li>
                <li>Solicitar la portabilidad de tus datos en formato legible por máquina.</li>
              </ul>
              <p className="mt-3">
                Para ejercer cualquiera de estos derechos, escríbenos a{" "}
                <a href="mailto:admin@spotu.online" className="text-primary hover:underline">admin@spotu.online</a>.
                Responderemos en un plazo máximo de 30 días.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">8. Cookies</h2>
              <p>
                Utilizamos cookies esenciales para el funcionamiento de la sesión y el idioma. No utilizamos
                cookies de rastreo de terceros con fines publicitarios. Al usar SpotU, aceptas el uso de estas
                cookies esenciales.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">9. Menores de edad</h2>
              <p>
                SpotU no está dirigido a personas menores de 18 años. No recopilamos intencionalmente
                información de menores. Si detectamos que un menor ha creado una cuenta, la eliminaremos de
                forma inmediata.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">10. Cambios a esta política</h2>
              <p>
                Podemos actualizar esta política periódicamente. Te notificaremos por correo electrónico o
                mediante un aviso en la plataforma ante cambios materiales. El uso continuado de SpotU después
                de la notificación implica la aceptación de los cambios.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">11. Contacto</h2>
              <p>
                Para cualquier pregunta sobre esta política de privacidad, contáctanos en:{" "}
                <a href="mailto:admin@spotu.online" className="text-primary hover:underline">admin@spotu.online</a>
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
