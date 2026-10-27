import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { sanityWriteClient } from "@/lib/sanity"

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()

    const { id, action } = await req.json()
    if (!id || !action) return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })

    if (action === "approve") {
      await sanityWriteClient.patch(id).set({ status: "published" }).commit()
    } else if (action === "reject") {
      await sanityWriteClient.delete(id)
    } else {
      return NextResponse.json({ error: "Acción inválida" }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "No autorizado" }, { status: err.statusCode || 401 })
  }
}
