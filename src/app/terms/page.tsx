import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Términos de Uso — SpotU",
  description: "Términos y condiciones de uso de SpotU. Lee las reglas que rigen el uso de nuestra plataforma.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Términos de Uso</h1>
          <p className="mt-2 text-sm text-muted-foreground">Última actualización: abril de 2025</p>

          <div className="mt-10 space-y-10 text-sm leading-7 text-foreground/80">

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">1. Aceptación de los términos</h2>
              <p>
                Al acceder o usar SpotU (&quot;la plataforma&quot;, &quot;el servicio&quot;), disponible en{" "}
                <strong>spotu.online</strong>, aceptas estar vinculado por estos Términos de Uso. Si no estás de
                acuerdo con alguno de los términos, no uses el servicio.
              </p>
              <p className="mt-2">
                SpotU se reserva el derecho de modificar estos términos en cualquier momento. Los cambios
                materiales serán notificados con al menos 15 días de anticipación.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">2. Descripción del servicio</h2>
              <p>
                SpotU es un <strong>marketplace de intermediación pura</strong> que facilita la conexión entre:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Anunciantes que buscan espacios publicitarios.</li>
                <li>Propietarios de espacios publicitarios físicos o digitales.</li>
                <li>Agencias de marketing que ofrecen servicios a anunciantes y espacios.</li>
              </ul>
              <p className="mt-3">
                SpotU <strong>no es parte</strong> de ninguna transacción comercial entre usuarios. No garantizamos
                el éxito de las negociaciones ni la calidad de los servicios prestados entre usuarios. El contacto
                y cierre de acuerdos ocurren directamente entre las partes involucradas.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">3. Registro y cuentas</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Debes tener al menos 18 años para crear una cuenta.</li>
                <li>La información de registro debe ser veraz, completa y actualizada.</li>
                <li>Eres responsable de mantener la confidencialidad de tus credenciales.</li>
                <li>No puedes crear cuentas en nombre de terceros sin su autorización expresa.</li>
                <li>SpotU puede suspender o eliminar cuentas que violen estos términos.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">4. Publicaciones</h2>
              <p>Al publicar en SpotU, garantizas que:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>La información es veraz, precisa y no es engañosa.</li>
                <li>Tienes los derechos necesarios sobre el contenido e imágenes que publicas.</li>
                <li>El contenido no infringe derechos de terceros ni viola leyes aplicables.</li>
                <li>No publicarás contenido ilegal, difamatorio, obsceno, amenazante o fraudulento.</li>
                <li>No usarás la plataforma para enviar spam ni realizar publicidad no solicitada.</li>
              </ul>
              <p className="mt-3">
                SpotU se reserva el derecho de eliminar publicaciones que violen estos términos, sin previo aviso
                y sin responsabilidad alguna.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">5. Precios y facturación</h2>
              <p>Los precios actuales del servicio son:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  <strong>Primera publicación:</strong> gratuita por 30 días a partir de la activación (usuarios
                  no pioneros). Al término del período gratuito, aplica la tarifa mensual correspondiente.
                </li>
                <li>
                  <strong>Espacios publicitarios y anunciantes:</strong> USD $4.99/mes por publicación activa.
                </li>
                <li>
                  <strong>Agencias de marketing:</strong> USD $9.99/mes por publicación activa.
                </li>
                <li>
                  <strong>Boost:</strong> USD $2.99/semana (espacios/anunciantes) o USD $4.99/semana (agencias).
                  Posiciona la publicación en primer lugar en el feed y resultados de búsqueda por 7 días.
                </li>
                <li>
                  <strong>Usuarios pioneros (primeros 100 registrados):</strong> publicaciones activas de forma
                  gratuita e ilimitada como agradecimiento por su confianza temprana.
                </li>
              </ul>
              <p className="mt-3">
                Las suscripciones se renuevan automáticamente cada mes hasta que el usuario desactive la
                publicación. SpotU cobra en dólares estadounidenses (USD) a través de Stripe. Al proporcionar
                un método de pago, autorizas los cargos recurrentes.
              </p>
              <p className="mt-2">
                Si desactivas una publicación antes de que venza el período de facturación, no se emitirán
                reembolsos por el período ya pagado. Si desactivas durante el período gratuito, no se realizará
                ningún cargo.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">6. Cancelación y reembolsos</h2>
              <p>
                Puedes cancelar tu suscripción en cualquier momento desde tu dashboard. La cancelación surte
                efecto al final del período de facturación en curso y la publicación pasará a estado inactivo.
              </p>
              <p className="mt-2">
                No ofrecemos reembolsos por períodos de facturación ya cobrados, excepto en casos de error de
                cobro duplicado o falla técnica imputable a SpotU. Para solicitar un reembolso por estas causas,
                escríbenos a{" "}
                <a href="mailto:admin@spotu.online" className="text-primary hover:underline">admin@spotu.online</a>{" "}
                dentro de los 7 días siguientes al cargo.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">7. Propiedad intelectual</h2>
              <p>
                Al publicar contenido en SpotU, nos otorgas una licencia no exclusiva, mundial, libre de
                regalías para mostrar, distribuir y promover ese contenido en el contexto del servicio. Conservas
                todos los derechos de propiedad intelectual sobre tu contenido.
              </p>
              <p className="mt-2">
                Los nombres, logotipos, diseño y código de SpotU son propiedad de SpotU y están protegidos por
                derechos de autor y marcas registradas. No puedes usarlos sin autorización escrita.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">8. Limitación de responsabilidad</h2>
              <p>
                SpotU actúa exclusivamente como intermediario y <strong>no es responsable</strong> de:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>La veracidad, exactitud o calidad del contenido publicado por los usuarios.</li>
                <li>Las transacciones, acuerdos o disputas entre usuarios.</li>
                <li>Pérdidas económicas derivadas del uso o imposibilidad de uso del servicio.</li>
                <li>Interrupciones del servicio por mantenimiento, fallas técnicas o causas de fuerza mayor.</li>
              </ul>
              <p className="mt-3">
                En ningún caso la responsabilidad total de SpotU hacia un usuario superará el monto pagado por
                dicho usuario en los últimos 3 meses.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">9. Conducta prohibida</h2>
              <p>Está prohibido usar SpotU para:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Actividades ilegales o que infrinjan derechos de terceros.</li>
                <li>Publicar información falsa o engañosa sobre productos o servicios.</li>
                <li>Acceder sin autorización a sistemas o datos de otros usuarios.</li>
                <li>Interferir con el funcionamiento de la plataforma (ataques DDoS, scraping masivo, etc.).</li>
                <li>Crear cuentas falsas o múltiples cuentas con fines de manipulación.</li>
                <li>Eludir sistemas de pago o usar métodos de pago fraudulentos.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">10. Ley aplicable y resolución de disputas</h2>
              <p>
                Estos términos se rigen por las leyes de la República de México, sin perjuicio de los derechos
                del consumidor aplicables en Colombia y Estados Unidos según la ubicación del usuario.
              </p>
              <p className="mt-2">
                Para usuarios en Colombia, también aplican las disposiciones de la Ley 1480 de 2011 (Estatuto del
                Consumidor). Para usuarios en Estados Unidos (Florida), aplican las leyes estatales pertinentes.
              </p>
              <p className="mt-2">
                Cualquier disputa que no pueda resolverse amigablemente mediante comunicación directa con
                SpotU será sometida a arbitraje vinculante o, de no ser posible, a los tribunales competentes
                según la ubicación del usuario.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">11. Contacto</h2>
              <p>
                Para preguntas sobre estos términos o el servicio en general:{" "}
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
