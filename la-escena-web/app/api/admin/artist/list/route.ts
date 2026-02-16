export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { getArtists } from "@/services/artist.service"

export async function GET() {
  try {
    await requireAdmin()

    const artists = await getArtists()

    return NextResponse.json(artists)

  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    )
  }
}
