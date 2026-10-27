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

async function uploadImage(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer())
  const asset = await sanityWriteClient.assets.upload("image", buffer, {
    filename: file.name,
    contentType: file.type,
  })
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } }
}

export async function POST(req: Request) {
  try {
    await requireAdmin()

    const formData = await req.formData()
    const title      = formData.get("title") as string
    const excerpt    = formData.get("excerpt") as string | null
    const bodyRaw    = formData.get("body") as string | null
    const category   = formData.get("category") as string | null
    const slugVal    = formData.get("slug") as string | null
    const file       = formData.get("file") as File | null
    const bottomFile = formData.get("bottomFile") as File | null

    if (!title?.trim()) {
      return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 })
    }

    const [mainImage, bottomImage] = await Promise.all([
      file && file.size > 0 ? uploadImage(file) : Promise.resolve(undefined),
      bottomFile && bottomFile.size > 0 ? uploadImage(bottomFile) : Promise.resolve(undefined),
    ])

    // body puede venir como JSON (Tiptap blocks) o texto plano
    let body: any[] | undefined
    if (bodyRaw?.trim()) {
      try {
        body = JSON.parse(bodyRaw)
      } catch {
        body = textToBlocks(bodyRaw)
      }
    }

    const doc: Record<string, any> = {
      _type: "internalPost",
      title: title.trim(),
      slug: { _type: "slug", current: slugVal?.trim() || slugify(title) },
      publishedAt: new Date().toISOString(),
    }

    if (excerpt?.trim()) doc.excerpt = excerpt.trim()
    if (category?.trim()) doc.category = category.trim()
    if (body?.length) doc.body = body
    if (mainImage) doc.mainImage = mainImage
    if (bottomImage) doc.bottomImage = bottomImage

    const created = await sanityWriteClient.create(doc as any)

    return NextResponse.json({ success: true, id: created._id })
  } catch (error) {
    console.error("ERROR blog-interno/create:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
