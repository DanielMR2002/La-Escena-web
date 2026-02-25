export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createArtistRevision } from "@/services/artist-revision.service"

export async function POST(req: Request) {

  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ARTIST") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { artistId, data } = await req.json()

  await createArtistRevision(artistId, data)

  return NextResponse.json({ success: true })
}
