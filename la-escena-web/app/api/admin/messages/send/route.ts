export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireAdmin, AuthError } from "@/lib/auth"
import { sendAdminMessage } from "@/services/message.service"

export async function POST(req: Request) {
  try {
    const session = await requireAdmin()

    const { subject, body, audience, recipientUserIds } = await req.json()

    if (!subject?.trim() || !body?.trim()) {
      return NextResponse.json({ error: "Falta asunto o mensaje" }, { status: 400 })
    }

    if (audience !== "ALL" && audience !== "SELECTED") {
      return NextResponse.json({ error: "Audiencia inválida" }, { status: 400 })
    }

    if (audience === "SELECTED" && (!Array.isArray(recipientUserIds) || recipientUserIds.length === 0)) {
      return NextResponse.json({ error: "Selecciona al menos un destinatario" }, { status: 400 })
    }

    const result = await sendAdminMessage({
      sentById: session.user.id,
      subject: subject.trim(),
      body: body.trim(),
      audience,
      recipientUserIds,
    })

    return NextResponse.json({
      success: true,
      recipientCount: result.recipientCount,
      emailFailures: result.emailFailures,
    })

  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error("POST /api/admin/messages/send:", error)
    return NextResponse.json({ error: "Error interno al enviar el mensaje" }, { status: 500 })
  }
}
