import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { sanityWriteClient } from "@/lib/sanity"

export async function PATCH(req: Request) {
  try {
    await requireAdmin()

    const { sanityId, featured, visible } = await req.json()
    if (!sanityId || (featured === undefined && visible === undefined)) {
      return NextResponse.json({ error: "Missing sanityId or featured/visible" }, { status: 400 })
    }

    const patch: Record<string, boolean> = {}
    if (featured !== undefined) patch.featured = featured
    if (visible  !== undefined) patch.visible  = visible

    await sanityWriteClient.patch(sanityId).set(patch).commit()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("ERROR toggle-featured:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
