import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { sanityWriteClient } from "@/lib/sanity"

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin()
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 })
    await sanityWriteClient.delete(id)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "No autorizado" }, { status: err.statusCode || 401 })
  }
}
