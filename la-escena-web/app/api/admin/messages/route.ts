export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireAdmin, AuthError } from "@/lib/auth"
import { listAdminMessages } from "@/services/message.service"

export async function GET() {
  try {
    await requireAdmin()

    const messages = await listAdminMessages()

    return NextResponse.json(
      messages.map(m => ({
        id: m.id,
        subject: m.subject,
        audience: m.audience,
        recipientCount: m._count.recipients,
        createdAt: m.createdAt,
      }))
    )

  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error("GET /api/admin/messages:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
