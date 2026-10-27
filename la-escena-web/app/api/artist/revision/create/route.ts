export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireArtist } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await requireArtist()

    const { artistId, data } = await req.json()

    // Verificar que el perfil pertenece al usuario
    const profile = await prisma.artistProfile.findUnique({
      where: {
        id: artistId
      }
    })

    if (!profile || profile.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    // Si ya hay una revisión aprobada, eliminar el nombre de los datos
    // para que no pueda modificarse aunque el cliente lo envíe
    const hasApprovedRevision = (await prisma.artistProfileRevision.count({
      where: { artistId: profile.id, status: "APPROVED" },
    })) > 0

    if (hasApprovedRevision && data?.name !== undefined) {
      delete data.name
    }

    await prisma.artistProfileRevision.create({
      data: {
        artistId: profile.id,
        data,
        status: "PENDING"
      }
    })

    await prisma.artistProfile.update({
      where: { id: profile.id },
      data: {
        status: "PENDING",
        adminComment: null,
        reviewedAt: null,
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Error creating revision:", error)

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}