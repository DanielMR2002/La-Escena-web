import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { sanityWriteClient } from "@/lib/sanity"

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    // Borrar tanto el documento publicado como su draft si existe
    await Promise.allSettled([
      sanityWriteClient.delete(id),
      sanityWriteClient.delete(`drafts.${id}`),
    ])

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("ERROR blog/delete:", error)
    return NextResponse.json({ error: error?.message || "Error interno del servidor" }, { status: 500 })
  }
}
