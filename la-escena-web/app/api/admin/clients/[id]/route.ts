import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin()
  const { id } = await params

  const client = await prisma.user.findUnique({ where: { id } })
  if (!client || client.role !== "CLIENT") {
    return NextResponse.json({ error: "Cliente no encontrado." }, { status: 404 })
  }

  await prisma.user.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
