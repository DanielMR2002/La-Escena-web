export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireArtist } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// El artista NO puede borrar directamente — crea una revisión pendiente de aprobación
export async function POST(req: Request) {
  try {
    const session = await requireArtist()
    const { artistId, pruebaKey } = await req.json()

    const profile = await prisma.artistProfile.findUnique({ where: { id: artistId } })
    if (!profile || profile.userId !== session.user.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    // Buscar si ya hay una revisión pendiente para este artista
    const existingRevision = await prisma.artistProfileRevision.findFirst({
      where: { artistId, status: "PENDING" },
      orderBy: { createdAt: "desc" },
    })

    if (existingRevision) {
      // Agregar la solicitud de eliminación a la revisión existente
      const currentData = (existingRevision.data ?? {}) as Record<string, any>
      const deletePruebaKeys = currentData.deletePruebaKeys ?? []
      if (!deletePruebaKeys.includes(pruebaKey)) {
        deletePruebaKeys.push(pruebaKey)
      }
      await prisma.artistProfileRevision.update({
        where: { id: existingRevision.id },
        data: { data: { ...currentData, deletePruebaKeys } },
      })
    } else {
      // Crear nueva revisión solo para la eliminación
      await prisma.artistProfileRevision.create({
        data: {
          artistId,
          status: "PENDING",
          data: { deletePruebaKeys: [pruebaKey] },
        },
      })
    }

    return NextResponse.json({ success: true, message: "Solicitud enviada para aprobación" })
  } catch (err) {
    console.error("Error requesting prueba deletion:", err)
    return NextResponse.json({ error: "Error al solicitar eliminación" }, { status: 500 })
  }
}
