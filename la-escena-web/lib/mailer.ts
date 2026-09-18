import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.CONTACT_EMAIL,
    pass: process.env.CONTACT_EMAIL_PASSWORD,
  },
})

export async function sendMail(options: { to: string; subject: string; html: string }) {
  return transporter.sendMail({
    from: `"La Escena Web" <${process.env.CONTACT_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  })
}
