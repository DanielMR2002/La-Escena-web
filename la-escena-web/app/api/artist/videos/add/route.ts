import { NextResponse } from "next/server"
import { requireArtist } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sanityClient, sanityWriteClient } from "@/lib/sanity"
import { ensurePendingRevision } from "@/services/artist-revision.service"

const VIDEO_LIMIT = 4

export async function POST(req: Request) {
  try {
    const session = await requireArtist()

    const { sanityId, url, title } = await req.json()

    if (!sanityId || !url) {
      return NextResponse.json({ error: "Missing sanityId or url" }, { status: 400 })
    }

    const profile = await prisma.artistProfile.findUnique({ where: { userId: session.user.id } })
    if (!profile || profile.sanityId !== sanityId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const artist = await sanityClient.fetch(
      `*[_type == "artist" && _id == $id][0]{ "count": count(pendingVideos) }`,
      { id: sanityId }
    )

    if ((artist?.count ?? 0) >= VIDEO_LIMIT) {
      return NextResponse.json(
        { error: `Máximo ${VIDEO_LIMIT} videos por perfil` },
        { status: 400 }
      )
    }

    const key = Math.random().toString(36).slice(2, 10)

    await sanityWriteClient
      .patch(sanityId)
      .setIfMissing({ pendingVideos: [] })
      .append("pendingVideos", [{ _key: key, url, title: title ?? "" }])
      .commit()

    await ensurePendingRevision(profile.id)

    return NextResponse.json({ success: true, video: { _key: key, url, title: title ?? "" } })
  } catch (error) {
    console.error("ERROR artist add-video:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
