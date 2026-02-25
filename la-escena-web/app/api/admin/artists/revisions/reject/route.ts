export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { rejectRevision } from "@/services/artist-revision.service"

export async function POST(req: Request) {
  try {
    await requireAdmin()

    const { id, comment } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: "Missing revision id" },
        { status: 400 }
      )
    }

    await rejectRevision(id, comment)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Reject error:", error)

    return NextResponse.json(
      { error: "Error rejecting revision" },
      { status: 500 }
    )
  }
}