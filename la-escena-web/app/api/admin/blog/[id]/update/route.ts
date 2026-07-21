import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { sanityWriteClient, textToBlocks } from "@/lib/sanity"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    const formData = await req.formData()
    const title   = formData.get("title") as string
    const excerpt = formData.get("excerpt") as string | null
    const body    = formData.get("body") as string | null
    const file    = formData.get("file") as File | null

    if (!title?.trim()) {
      return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 })
    }

    const updates: Record<string, any> = {
      title: title.trim(),
      excerpt: excerpt?.trim() ?? "",
      body: body?.trim() ? textToBlocks(body) : [],
    }

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const asset = await sanityWriteClient.assets.upload("image", buffer, {
        filename: file.name,
        contentType: file.type,
      })
      updates.mainImage = { _type: "image", asset: { _type: "reference", _ref: asset._id } }
    }

    await sanityWriteClient.patch(id).set(updates).commit()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("ERROR blog/update:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
