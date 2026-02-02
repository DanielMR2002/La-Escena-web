import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  const body = await req.json()

  const {
    name,
    email,
    company,
    service,
    city,
    date,
    message
  } = body

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.CONTACT_EMAIL,
      pass: process.env.CONTACT_EMAIL_PASSWORD
    }
  })

  try {
    await transporter.sendMail({
      from: `"La Escena Web" <${process.env.CONTACT_EMAIL}>`,
      to: process.env.CONTACT_EMAIL,
      subject: 'Nuevo contacto desde la web',
      html: `
        <h3>Nuevo mensaje de contacto</h3>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Empresa:</strong> ${company || '—'}</p>
        <p><strong>Servicio:</strong> ${service}</p>
        <p><strong>Ciudad:</strong> ${city}</p>
        <p><strong>Fecha:</strong> ${date || '—'}</p>
        <p><strong>Mensaje:</strong><br/>${message}</p>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
