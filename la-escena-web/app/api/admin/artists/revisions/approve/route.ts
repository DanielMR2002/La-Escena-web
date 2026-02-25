import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    await requireAdmin()

    const { id } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: "Missing revision id" },
        { status: 400 }
      )
    }

    const revision = await prisma.artistProfileRevision.findUnique({
      where: { id }
    })

    if (!revision) {
      return NextResponse.json(
        { error: "Revision not found" },
        { status: 404 }
      )
    }

    //  Actualizar perfil principal
    await prisma.artistProfile.update({
      where: { id: revision.artistId },
      data: {
        profileData: revision.data ?? {},
        status: "APPROVED"
      }
    })

    //  Eliminar Todas las revisiones 
    await prisma.artistProfileRevision.deleteMany({
      where: {
        artistId: revision.artistId
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("ERROR APPROVE:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}