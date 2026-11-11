export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireAdmin, AuthError } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    // Delete recipients first, then the message
    await prisma.$transaction([
      prisma.messageRecipient.deleteMany({ where: { messageId: params.id } }),
      prisma.adminMessage.delete({ where: { id: params.id } }),
    ])

    return NextResponse.json({ ok: true })

  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error("DELETE /api/admin/messages/[id]:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
