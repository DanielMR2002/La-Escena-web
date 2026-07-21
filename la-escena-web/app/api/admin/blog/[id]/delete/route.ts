import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { sanityWriteClient } from "@/lib/sanity"

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    await sanityWriteClient.delete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("ERROR blog/delete:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
