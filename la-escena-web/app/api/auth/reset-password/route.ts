import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
  const { token, password } = await req.json()

  if (!token || !password) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 })
  }

  const record = await prisma.passwordResetToken.findUnique({ where: { token } })

  if (!record) {
    return NextResponse.json({ error: 'Link inválido o ya utilizado' }, { status: 400 })
  }

  if (record.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({ where: { token } })
    return NextResponse.json({ error: 'El link ha expirado. Solicita uno nuevo.' }, { status: 400 })
  }

  const hashed = await bcrypt.hash(password, 10)

  await prisma.user.update({
    where: { id: record.userId },
    data: { password: hashed },
  })

  await prisma.passwordResetToken.delete({ where: { token } })

  return NextResponse.json({ ok: true })
}
