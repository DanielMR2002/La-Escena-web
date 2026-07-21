import { NextResponse } from "next/server"
import { requireArtist } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sanityWriteClient } from "@/lib/sanity"
import { ensurePendingRevision } from "@/services/artist-revision.service"

export async function DELETE(req: Request) {
  try {
    const session = await requireArtist()

    const { sanityId, photoKey } = await req.json()

    if (!sanityId || !photoKey) {
      return NextResponse.json({ error: "Missing sanityId or photoKey" }, { status: 400 })
    }

    const profile = await prisma.artistProfile.findUnique({ where: { userId: session.user.id } })
    if (!profile || profile.sanityId !== sanityId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await sanityWriteClient
      .patch(sanityId)
      .unset([`pendingPhotos[_key=="${photoKey}"]`])
      .commit()

    await ensurePendingRevision(profile.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("ERROR artist delete-photo:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
