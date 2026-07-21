import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { sanityWriteClient } from "@/lib/sanity"

export async function PATCH(req: Request) {
  try {
    await requireAdmin()

    const { id, newOrder } = await req.json()
    if (!id || newOrder === undefined) {
      return NextResponse.json({ error: "Missing id or newOrder" }, { status: 400 })
    }

    await sanityWriteClient.patch(id).set({ order: newOrder }).commit()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("ERROR gallery/reorder:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
