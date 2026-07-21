import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { sanityClient, sanityWriteClient } from "@/lib/sanity"

const VIDEO_LIMIT = 4

export async function POST(req: Request) {
  try {
    await requireAdmin()

    const { sanityId, url, title } = await req.json()

    if (!sanityId || !url) {
      return NextResponse.json({ error: "Missing sanityId or url" }, { status: 400 })
    }

    const artist = await sanityClient.fetch(
      `*[_type == "artist" && _id == $id][0]{ "count": count(videos) }`,
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
      .setIfMissing({ videos: [] })
      .append("videos", [{ _key: key, url, title: title ?? "" }])
      .commit()

    return NextResponse.json({ success: true, video: { _key: key, url, title: title ?? "" } })
  } catch (error) {
    console.error("ERROR add-video:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
