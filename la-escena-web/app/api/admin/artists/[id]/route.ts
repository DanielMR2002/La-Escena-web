import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin()
  const { id } = await params

  const profile = await prisma.artistProfile.findUnique({ where: { id } })
  if (!profile) {
    return NextResponse.json({ error: "Artista no encontrado." }, { status: 404 })
  }

  // Eliminar el usuario asociado (cascade eliminará el perfil)
  await prisma.user.delete({ where: { id: profile.userId } })

  return NextResponse.json({ ok: true })
}
