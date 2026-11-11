export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { createArtist } from "@/services/artist-create.service"
import { sendMail } from "@/lib/mailer"

export async function POST(req: Request) {
  try {
    await requireAdmin()

    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      )
    }

    const artist = await createArtist(email, password)

    // Enviar email de bienvenida
    try {
      await sendMail({
        to: email,
        subject: "Bienvenido(a) a La Escena 🎉",
        html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <tr>
          <td style="background:#cc0000;padding:28px 32px;border-radius:8px 8px 0 0;">
            <p style="margin:0;color:#ffffff;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.15em;opacity:0.8;">La Escena · Agencia de artistas</p>
            <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.02em;">¡Bienvenido(a) a La Escena!</h1>
          </td>
        </tr>

        <tr>
          <td style="background:#161616;padding:28px 32px;">
            <p style="margin:0 0 20px;color:#d1d5db;font-size:14px;line-height:1.6;">Tu cuenta ha sido creada. A continuación encontrarás tus credenciales para ingresar a la plataforma:</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:6px;overflow:hidden;border:1px solid #2a2a2a;">
              <tr>
                <td style="padding:10px 16px;background:#1a1a1a;color:#9ca3af;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;width:130px;">Correo</td>
                <td style="padding:10px 16px;background:#111111;color:#f3f4f6;font-size:14px;">${email}</td>
              </tr>
              <tr>
                <td style="padding:10px 16px;background:#1a1a1a;color:#9ca3af;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Contraseña</td>
                <td style="padding:10px 16px;background:#111111;color:#f3f4f6;font-size:14px;">${password}</td>
              </tr>
            </table>

            <p style="margin:20px 0 0;color:#9ca3af;font-size:13px;">Te recomendamos cambiar tu contraseña después de tu primer inicio de sesión.</p>
          </td>
        </tr>

        <tr>
          <td style="background:#0f0f0f;padding:16px 32px;border-radius:0 0 8px 8px;border-top:1px solid #1f1f1f;">
            <p style="margin:0;color:#4b5563;font-size:11px;">La Escena · <strong style="color:#6b7280;">laescena.com.co</strong></p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
      })
    } catch (mailError) {
      console.error("Error sending welcome email to artist:", mailError)
      // No fallar la creación si el email falla
    }

    return NextResponse.json({
      success: true,
      artist
    })

  } 
  catch (error: any) {
    console.error("CREATE ARTIST ERROR:", error)

    return NextResponse.json(
      { error: error.message || "Error creating artist" },
      { status: 400 }
    )
  }
}
