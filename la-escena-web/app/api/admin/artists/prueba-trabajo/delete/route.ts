export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { sanityWriteClient, sanityFreshClient } from "@/lib/sanity"

// El admin puede borrar directamente sin revisión
export async function DELETE(req: Request) {
  try {
    await requireAdmin()
    const { sanityId, pruebaKey } = await req.json()

    if (!sanityId || !pruebaKey) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 })
    }

    const current = await sanityFreshClient.fetch(
      `*[_type == "artist" && _id == $id][0]{ "pruebasTrabajoAprobadas": pruebasTrabajoAprobadas[]{ _key, url, title, fileType } }`,
      { id: sanityId }
    )

    const filtered = (current?.pruebasTrabajoAprobadas ?? []).filter(
      (p: any) => p._key !== pruebaKey
    )

    await sanityWriteClient
      .patch(sanityId)
      .set({ pruebasTrabajoAprobadas: filtered })
      .commit()

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Error deleting prueba (admin):", err)
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 })
  }
}
