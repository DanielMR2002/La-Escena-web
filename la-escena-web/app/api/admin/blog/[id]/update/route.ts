import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { sanityWriteClient, textToBlocks } from "@/lib/sanity"

async function uploadImage(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer())
  const asset = await sanityWriteClient.assets.upload("image", buffer, {
    filename: file.name,
    contentType: file.type,
  })
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

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

    // body puede venir como JSON (Tiptap blocks) o texto plano
    let body: any[] = []
    if (bodyRaw?.trim()) {
      try {
        body = JSON.parse(bodyRaw)
      } catch {
        body = textToBlocks(bodyRaw)
      }
    }

    const updates: Record<string, any> = {
      title: title.trim(),
      excerpt: excerpt?.trim() ?? "",
      category: category?.trim() ?? "",
      body,
    }

    if (slugVal?.trim()) {
      updates.slug = { _type: "slug", current: slugVal.trim() }
    }

    const [mainImage, bottomImage] = await Promise.all([
      file && file.size > 0 ? uploadImage(file) : Promise.resolve(null),
      bottomFile && bottomFile.size > 0 ? uploadImage(bottomFile) : Promise.resolve(null),
    ])

    if (mainImage) updates.mainImage = mainImage
    if (bottomImage) updates.bottomImage = bottomImage

    await sanityWriteClient.patch(id).set(updates).commit()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("ERROR blog/update:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
