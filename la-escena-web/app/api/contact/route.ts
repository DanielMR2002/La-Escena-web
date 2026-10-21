import { NextResponse } from 'next/server'
import { sendMail } from '@/lib/mailer'

export async function POST(req: Request) {
  const body = await req.json()

  const {
    name,
    email,
    phone,
    company,
    service,
    city,
    date,
    message
  } = body

  const row = (label: string, value: string) => value && value !== '—' ? `
    <tr>
      <td style="padding:10px 16px;background:#1a1a1a;color:#9ca3af;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;width:130px;vertical-align:top;">${label}</td>
      <td style="padding:10px 16px;background:#111111;color:#f3f4f6;font-size:14px;vertical-align:top;">${value}</td>
    </tr>` : ''

  const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr>
          <td style="background:#cc0000;padding:28px 32px;border-radius:8px 8px 0 0;">
            <p style="margin:0;color:#ffffff;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.15em;opacity:0.8;">La Escena · Agencia de artistas</p>
            <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.02em;">Nuevo mensaje de contacto</h1>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="background:#161616;padding:28px 32px;">
            <p style="margin:0 0 20px;color:#9ca3af;font-size:13px;">Se recibió una nueva solicitud a través del formulario de contacto del sitio web.</p>

            <!-- DATOS -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:6px;overflow:hidden;border:1px solid #2a2a2a;">
              ${row('Nombre', name || '—')}
              ${row('Email', email || '—')}
              ${row('Teléfono', phone || '—')}
              ${row('Empresa', company || '—')}
              ${row('Servicio', service || '—')}
              ${row('Ciudad', city || '—')}
              ${row('Fecha', date || '—')}
            </table>

            <!-- MENSAJE -->
            ${message ? `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;border-radius:6px;overflow:hidden;border:1px solid #2a2a2a;">
              <tr>
                <td style="padding:10px 16px;background:#1a1a1a;color:#9ca3af;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Mensaje</td>
              </tr>
              <tr>
                <td style="padding:16px;background:#111111;color:#f3f4f6;font-size:14px;line-height:1.6;">${message.replace(/\n/g, '<br/>')}</td>
              </tr>
            </table>` : ''}

            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
              <tr>
                <td>
                  <a href="mailto:${email}" style="display:inline-block;background:#cc0000;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:13px;font-weight:600;letter-spacing:0.03em;">Responder a ${name}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#0f0f0f;padding:16px 32px;border-radius:0 0 8px 8px;border-top:1px solid #1f1f1f;">
            <p style="margin:0;color:#4b5563;font-size:11px;">Este mensaje fue enviado desde el formulario de contacto de <strong style="color:#6b7280;">laescena.com.co</strong></p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  try {
    await sendMail({
      to: process.env.CONTACT_EMAIL!,
      subject: `Nuevo contacto: ${name} — ${service}`,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
