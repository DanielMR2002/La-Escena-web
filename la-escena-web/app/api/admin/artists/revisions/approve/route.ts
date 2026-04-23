import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sanityWriteClient } from "@/lib/sanity"

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

    // Obtener perfil del artista
    const profile = await prisma.artistProfile.findUnique({
      where: { id: revision.artistId }
    })

    if (!profile || !profile.sanityId) {
      return NextResponse.json(
        { error: "Artist not connected to Sanity" },
        { status: 400 }
      )
    }

    // 1️⃣ Actualizar documento en Sanity
    await sanityWriteClient
      .patch(profile.sanityId)
      .set((revision.data ?? {}) as Record<string, any>)
      .commit()

    // 2️⃣ Actualizar perfil en Prisma
    await prisma.artistProfile.update({
      where: { id: revision.artistId },
      data: {
        profileData: revision.data ?? {},
        status: "APPROVED"
      }
    })

    // 3️⃣ Eliminar todas las revisiones
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