export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { sanityFreshClient } from "@/lib/sanity"

export async function GET() {
  try {
    await requireAdmin()
    const photos = await sanityFreshClient.fetch(`
      *[_type == "galleryPhoto"] | order(order asc) {
        _id,
        image,
        caption,
        order
      }
    `)
    return NextResponse.json(photos)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }
}
