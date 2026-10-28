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

    let docId = id
    try {
      const body = await req.json()
      if (body?.id) docId = body.id
    } catch {}

    if (!docId) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 })
    }

    // Primero borrar todos los comentarios que referencian este post
    const comments = await sanityWriteClient.fetch(
      `*[_type == "comment" && post._ref == $id]._id`,
      { id: docId }
    )
    for (const commentId of comments) {
      await sanityWriteClient.delete(commentId)
    }

    // Borrar el post
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
