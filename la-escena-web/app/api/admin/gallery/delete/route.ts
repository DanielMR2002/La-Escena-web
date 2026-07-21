import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { sanityWriteClient } from "@/lib/sanity"

export async function DELETE(req: Request) {
  try {
    await requireAdmin()

    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

    await sanityWriteClient.delete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("ERROR gallery/delete:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
