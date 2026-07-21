import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { sanityWriteClient, textToBlocks } from "@/lib/sanity"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .slice(0, 96)
}

export async function POST(req: Request) {
  try {
    await requireAdmin()

    const formData = await req.formData()
    const title   = formData.get("title") as string
    const excerpt = formData.get("excerpt") as string | null
    const body    = formData.get("body") as string | null
    const file    = formData.get("file") as File | null

    if (!title?.trim()) {
      return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 })
    }

    let mainImage: object | undefined

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const asset = await sanityWriteClient.assets.upload("image", buffer, {
        filename: file.name,
        contentType: file.type,
      })
      mainImage = { _type: "image", asset: { _type: "reference", _ref: asset._id } }
    }

    const doc: Record<string, any> = {
      _type: "internalPost",
      title: title.trim(),
      slug: { _type: "slug", current: slugify(title) },
      publishedAt: new Date().toISOString(),
    }

    if (excerpt?.trim()) doc.excerpt = excerpt.trim()
    if (body?.trim()) doc.body = textToBlocks(body)
    if (mainImage) doc.mainImage = mainImage

    const created = await sanityWriteClient.create(doc as any)

    return NextResponse.json({ success: true, id: created._id })
  } catch (error) {
    console.error("ERROR blog-interno/create:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
