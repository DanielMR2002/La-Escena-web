import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin()

  const session = await getServerSession(authOptions)
  const { id } = await params

  // Prevent self-deletion
  const me = await prisma.user.findUnique({ where: { email: session?.user?.email ?? "" } })
  if (me?.id === id) {
    return NextResponse.json({ error: "No puedes eliminarte a ti mismo." }, { status: 400 })
  }

  const target = await prisma.user.findUnique({ where: { id } })
  if (!target || target.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin no encontrado." }, { status: 404 })
  }

  await prisma.user.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
