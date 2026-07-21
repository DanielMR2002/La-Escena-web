import { NextResponse } from "next/server"
import { requireArtistOrAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sanityWriteClient } from "@/lib/sanity"

export async function DELETE(req: Request) {
  try {
    const session = await requireArtistOrAdmin()

    const { sanityId, photoKey } = await req.json()

    if (!sanityId || !photoKey) {
      return NextResponse.json({ error: "Missing sanityId or photoKey" }, { status: 400 })
    }

    if (session.user.role !== "ADMIN") {
      const profile = await prisma.artistProfile.findUnique({ where: { userId: session.user.id } })
      if (!profile || profile.sanityId !== sanityId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }
    }

    await sanityWriteClient
      .patch(sanityId)
      .unset([`photos[_key=="${photoKey}"]`])
      .commit()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("ERROR delete-photo:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
