export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireArtistOrAdmin, AuthError } from "@/lib/auth"
import { markMessageRead } from "@/services/message.service"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireArtistOrAdmin()
    const { id } = await params

    await markMessageRead(session.user.id, id)

    return NextResponse.json({ success: true })

  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof Error && error.message === "Not found") {
      return NextResponse.json({ error: "Mensaje no encontrado" }, { status: 404 })
    }
    console.error("POST /api/artist/messages/[id]/read:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
