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

    // Borrar primero las replies (comentarios que tienen parentComment)
    const replies = await sanityWriteClient.fetch(
      `*[_type == "comment" && post._ref == $id && defined(parentComment)]._id`,
      { id: docId }
    )
    for (const replyId of replies) {
      await sanityWriteClient.delete(replyId)
    }

    // Luego borrar los comentarios raíz
    const rootComments = await sanityWriteClient.fetch(
      `*[_type == "comment" && post._ref == $id && !defined(parentComment)]._id`,
      { id: docId }
    )
    for (const commentId of rootComments) {
      await sanityWriteClient.delete(commentId)
    }

    // Finalmente borrar el post
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
