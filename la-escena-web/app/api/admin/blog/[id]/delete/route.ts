import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { sanityWriteClient } from "@/lib/sanity"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    // El id puede venir del URL param o del body
    let docId = id
    try {
      const body = await req.json()
      if (body?.id) docId = body.id
    } catch {}

    if (!docId) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 })
    }

    await sanityWriteClient.delete(docId)

    // Intentar borrar el draft si existe
    try {
      await sanityWriteClient.delete(`drafts.${docId}`)
    } catch {}

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("ERROR blog/delete:", error)
    return NextResponse.json(
      { error: error?.message || "Error interno del servidor" },
      { status: error?.statusCode || 500 }
    )
  }
}
