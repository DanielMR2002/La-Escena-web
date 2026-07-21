import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { sanityWriteClient } from "@/lib/sanity"

export async function DELETE(req: Request) {
  try {
    await requireAdmin()

    const { sanityId, videoKey } = await req.json()

    if (!sanityId || !videoKey) {
      return NextResponse.json({ error: "Missing sanityId or videoKey" }, { status: 400 })
    }

    await sanityWriteClient
      .patch(sanityId)
      .unset([`videos[_key=="${videoKey}"]`])
      .commit()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("ERROR delete-video:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
