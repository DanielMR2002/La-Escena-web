export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"

export async function DELETE(req: Request) {
  try {
    await requireAdmin()

    const { clientId, artistId } = await req.json()

    if (!clientId || !artistId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    await prisma.clientArtistAccess.deleteMany({
      where: { clientId, artistId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("REMOVE ARTIST ERROR:", error)
    return NextResponse.json({ error: "Error removing artist" }, { status: 500 })
  }
}
