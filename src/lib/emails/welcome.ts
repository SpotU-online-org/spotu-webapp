export function welcomeEmailHtml(name: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenido a SpotU</title>
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
              <p style="color:rgba(255,255,255,0.85);margin:16px 0 0;font-size:15px;letter-spacing:0.3px;">Tu marketplace de publicidad</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#1e1e2e;">
                Bienvenido${name ? `, ${name}` : ""} 🎉
              </h1>
              <p style="margin:0 0 20px;font-size:15px;color:#555;line-height:1.6;">
                Ya eres parte de <strong>SpotU</strong>, el marketplace que conecta anunciantes con espacios publicitarios y agencias de marketing en Colombia, México y USA.
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.6;">
                Con tu cuenta puedes <strong>publicar tu espacio o agencia</strong>, explorar el feed y contactar directamente a quien necesitas — sin intermediarios.
              </p>
              <a href="https://spotu.online/feed"
                 style="display:inline-block;background:#4F46E5;color:#fff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:10px;letter-spacing:0.2px;">
                Explorar SpotU →
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #ebebf0;" /></td></tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;color:#999;">
                ¿Tienes preguntas? Escríbenos a
                <a href="mailto:admin@spotu.online" style="color:#4F46E5;text-decoration:none;">admin@spotu.online</a>
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
