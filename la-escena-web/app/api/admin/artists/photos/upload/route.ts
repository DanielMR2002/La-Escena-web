import { NextResponse } from "next/server"
import { requireArtistOrAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sanityClient, sanityWriteClient } from "@/lib/sanity"
import { PHOTO_SLOT_VALUES } from "@/lib/photoSlots"

export async function POST(req: Request) {
  try {
    const session = await requireArtistOrAdmin()

    const formData      = await req.formData()
    const sanityId      = formData.get("sanityId") as string
    const file          = formData.get("file") as File | null
    const photoCategoryRaw = formData.get("photoCategory") as string | null
    const photoCategory = photoCategoryRaw ? photoCategoryRaw : null

    if (!sanityId || !file) {
      return NextResponse.json({ error: "Missing sanityId or file" }, { status: 400 })
    }

    if (photoCategory && !PHOTO_SLOT_VALUES.includes(photoCategory)) {
      return NextResponse.json({ error: "Categoría de foto inválida" }, { status: 400 })
    }

    if (session.user.role !== "ADMIN") {
      const profile = await prisma.artistProfile.findUnique({ where: { userId: session.user.id } })
      if (!profile || profile.sanityId !== sanityId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }
    }

    const artist = await sanityClient.fetch(
      `*[_type == "artist" && _id == $id][0]{ photos[]{ _key, photoCategory } }`,
      { id: sanityId }
    )

    const existingPhotos: Array<{ _key: string; photoCategory?: string }> = artist?.photos ?? []
    const existing = photoCategory ? existingPhotos.find((p) => p.photoCategory === photoCategory) : undefined

    if (!existing && existingPhotos.length >= 10) {
      return NextResponse.json({ error: "Ya se alcanzó el máximo de 10 fotos" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const asset = await sanityWriteClient.assets.upload("image", buffer, {
      filename:    file.name,
      contentType: file.type,
    })

    const key = Math.random().toString(36).slice(2, 10)
    const newPhoto = {
      _type: "image",
      _key: key,
      ...(photoCategory ? { photoCategory } : {}),
      asset: { _type: "reference", _ref: asset._id },
    }

    let patch = sanityWriteClient.patch(sanityId).setIfMissing({ photos: [] })

    if (existing) {
      // Reemplaza la foto existente de ese slot, en su misma posición
      patch = patch.insert("replace", `photos[_key=="${existing._key}"]`, [newPhoto])
    } else if (photoCategory === "headshot" && existingPhotos.length > 0) {
      // El headshot siempre debe quedar primero (es la foto principal en el catálogo)
      patch = patch.insert("before", "photos[0]", [newPhoto])
    } else {
      patch = patch.append("photos", [newPhoto])
    }

    await patch.commit()

    return NextResponse.json({ success: true, photo: newPhoto })
  } catch (error) {
    console.error("ERROR upload-photo:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
