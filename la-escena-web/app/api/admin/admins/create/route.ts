import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  try {
    await requireAdmin()

    const { name, email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { name: name?.trim() || null, email, password: hashed, role: "ADMIN" },
    })

    return NextResponse.json({ success: true, userId: user.id })
  } catch (error) {
    console.error("ERROR admins/create:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
