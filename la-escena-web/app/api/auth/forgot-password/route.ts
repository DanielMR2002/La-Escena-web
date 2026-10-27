import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendMail } from '@/lib/mailer'
import crypto from 'crypto'

export async function POST(req: Request) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email requerido' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email } })

  // Siempre responder OK para no revelar si el email existe
  if (!user) {
    return NextResponse.json({ ok: true })
  }

  // Eliminar tokens anteriores del mismo usuario
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } })

  // Crear token seguro con expiración de 1 hora
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt },
  })

  const resetUrl = `${process.env.NEXTAUTH_URL}/nueva-contrasena?token=${token}`

  await sendMail({
    to: email,
    subject: 'Restablecer contraseña — La Escena',
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
      <body style="margin:0;padding:0;background:#0d0d0d;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;padding:40px 16px;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#141414;border-radius:12px;overflow:hidden;border:1px solid #2a2a2a;">
              <!-- Header -->
              <tr><td style="background:#c0392b;padding:32px 40px;">
                <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.05em;text-transform:uppercase;">La Escena</p>
                <p style="margin:8px 0 0;font-size:13px;color:#f5b7b1;">Recuperación de contraseña</p>
              </td></tr>
              <!-- Body -->
              <tr><td style="padding:40px;">
                <p style="margin:0 0 16px;color:#e5e5e5;font-size:15px;">Hola,</p>
                <p style="margin:0 0 24px;color:#9ca3af;font-size:14px;line-height:1.6;">
                  Recibimos una solicitud para restablecer la contraseña de tu cuenta. Si no fuiste tú, puedes ignorar este correo.
                </p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr><td align="center" style="padding:8px 0 32px;">
                    <a href="${resetUrl}" style="display:inline-block;background:#c0392b;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:14px 32px;border-radius:6px;">
                      Restablecer contraseña
                    </a>
                  </td></tr>
                </table>
                <p style="margin:0 0 8px;color:#9ca3af;font-size:12px;">
                  Este link expira en <strong style="color:#e5e5e5;">1 hora</strong>. Si el botón no funciona, copia y pega esta URL en tu navegador:
                </p>
                <p style="margin:0;word-break:break-all;color:#c0392b;font-size:11px;">${resetUrl}</p>
              </td></tr>
              <!-- Footer -->
              <tr><td style="padding:20px 40px;border-top:1px solid #2a2a2a;">
                <p style="margin:0;color:#4b5563;font-size:11px;text-align:center;">© La Escena · laescena.s@gmail.com</p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
  })

  return NextResponse.json({ ok: true })
}
