import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const { action, adminComment } = await req.json()

    if (!["APPROVED", "REJECTED"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const shortlist = await prisma.clientShortlist.update({
      where: { id },
      data: {
        status:       action,
        adminComment: adminComment?.trim() || null,
        reviewedAt:   new Date(),
      },
    })

    return NextResponse.json({ success: true, status: shortlist.status })
  } catch (error) {
    console.error("Shortlist review error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
