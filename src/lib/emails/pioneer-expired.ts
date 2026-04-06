export function pioneerExpiredEmailHtml(name: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tu año pionero ha concluido</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#4F46E5,#6366f1);padding:36px 40px;text-align:center;">
              <img src="https://spotu.online/logos/spotu-logo-full.webp" alt="SpotU" width="160" style="display:block;margin:0 auto;" />
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#1e1e2e;">
                Tu año pionero ha concluido${name ? `, ${name}` : ""}
              </h1>
              <p style="margin:0 0 20px;font-size:15px;color:#555;line-height:1.6;">
                Gracias por ser uno de los primeros en apostar por SpotU. Tu <strong>año gratuito como usuario pionero</strong> ha llegado a su fin.
              </p>
              <p style="margin:0 0 20px;font-size:15px;color:#555;line-height:1.6;">
                Tus publicaciones han sido <strong>pausadas automáticamente</strong>. Para reactivarlas, ingresa a tu dashboard y actívalas — se te solicitará un método de pago para continuar con las tarifas regulares.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;background:#f8f7ff;border-radius:10px;padding:16px 20px;width:100%;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#4F46E5;">Tarifas regulares SpotU</p>
                    <p style="margin:0 0 4px;font-size:14px;color:#555;">Espacios / Anunciantes: <strong>$4.99 USD/mes</strong></p>
                    <p style="margin:0;font-size:14px;color:#555;">Agencias: <strong>$9.99 USD/mes</strong></p>
                  </td>
                </tr>
              </table>
              <a href="https://spotu.online/dashboard"
                 style="display:inline-block;background:#4F46E5;color:#fff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:10px;letter-spacing:0.2px;">
                Ir a mi dashboard →
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #ebebf0;" /></td></tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;color:#999;">
                ¿Preguntas? <a href="mailto:admin@spotu.online" style="color:#4F46E5;text-decoration:none;">admin@spotu.online</a>
              </p>
              <p style="margin:0;font-size:12px;color:#bbb;">
                © ${new Date().getFullYear()} SpotU · spotu.online
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
