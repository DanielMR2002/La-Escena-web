export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireArtistOrAdmin, AuthError } from "@/lib/auth"
import { listArtistMessages } from "@/services/message.service"

export async function GET() {
  try {
    const session = await requireArtistOrAdmin()

    const recipients = await listArtistMessages(session.user.id)

    return NextResponse.json(
      recipients.map(r => ({
        recipientId: r.id,
        subject: r.message.subject,
        body: r.message.body,
        createdAt: r.message.createdAt,
        readAt: r.readAt,
      }))
    )

  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error("GET /api/artist/messages:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
