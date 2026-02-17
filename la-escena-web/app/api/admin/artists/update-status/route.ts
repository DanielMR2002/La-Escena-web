export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { updateArtistStatus } from "@/services/artist.service"
import { ArtistStatus } from "@prisma/client"

export async function POST(req: Request) {
  try {
    await requireAdmin()

    const { artistId, status, comment } = await req.json()

    await updateArtistStatus(
      artistId,
      status as ArtistStatus,
      comment
    )

    return NextResponse.json({ success: true })

  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    )
  }
}
