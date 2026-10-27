import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { sanityWriteClient } from "@/lib/sanity"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Debes iniciar sesión para comentar" }, { status: 401 })

  const { postId, body, parentCommentId } = await req.json()
  if (!postId || !body?.trim()) return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })

  const doc: any = {
    _type: "comment",
    post: { _type: "reference", _ref: postId },
    authorName: session.user.name || session.user.email || "Usuario",
    authorUserId: (session.user as any).id || undefined,
    body: body.trim(),
    approved: false,
    createdAt: new Date().toISOString(),
  }
  if (parentCommentId) {
    doc.parentComment = { _type: "reference", _ref: parentCommentId }
  }

  await sanityWriteClient.create(doc)
  return NextResponse.json({ ok: true })
}
