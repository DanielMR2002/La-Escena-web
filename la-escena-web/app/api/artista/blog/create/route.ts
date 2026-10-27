import { NextRequest, NextResponse } from "next/server"
import { requireArtistOrAdmin } from "@/lib/auth"
import { sanityWriteClient } from "@/lib/sanity"

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/\p{M}/gu,"").replace(/\s+/g,"-").replace(/[^\w-]/g,"").slice(0,96)
}

async function uploadImage(file: File, client: typeof sanityWriteClient) {
  const buffer = Buffer.from(await file.arrayBuffer())
  const asset = await client.assets.upload("image", buffer, { filename: file.name, contentType: file.type })
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireArtistOrAdmin()

    const formData = await req.formData()
    const title = (formData.get("title") as string)?.trim()
    if (!title) return NextResponse.json({ error: "Título requerido" }, { status: 400 })

    const slugVal = (formData.get("slug") as string)?.trim()
    const excerpt = (formData.get("excerpt") as string)?.trim() || undefined
    const category = (formData.get("category") as string)?.trim() || undefined
    const slug = slugVal || slugify(title)

    let body: any[] = []
    const bodyRaw = formData.get("body") as string | null
    if (bodyRaw) {
      try { body = JSON.parse(bodyRaw) } catch {}
    }

    let mainImage: any = undefined
    const file = formData.get("file") as File | null
    if (file && file.size > 0) {
      mainImage = await uploadImage(file, sanityWriteClient)
    }

    let bottomImage: any = undefined
    const bottomFile = formData.get("bottomFile") as File | null
    if (bottomFile && bottomFile.size > 0) {
      bottomImage = await uploadImage(bottomFile, sanityWriteClient)
    }

    const doc: any = {
      _type: "post",
      title,
      slug: { _type: "slug", current: slug },
      status: "pending",
      authorName: (session.user as any)?.name || (session.user as any)?.email || "Artista",
      authorUserId: (session.user as any)?.id || undefined,
      excerpt,
      category,
      body,
      publishedAt: new Date().toISOString(),
    }
    if (mainImage) doc.mainImage = mainImage
    if (bottomImage) doc.bottomImage = bottomImage

    await sanityWriteClient.create(doc)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "No autorizado" }, { status: err.statusCode || 401 })
  }
}
