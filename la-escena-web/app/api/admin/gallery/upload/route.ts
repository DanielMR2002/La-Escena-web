import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { sanityWriteClient } from "@/lib/sanity"

export async function POST(req: Request) {
  try {
    await requireAdmin()

    const formData = await req.formData()
    const file     = formData.get("file") as File | null
    const caption  = (formData.get("caption") as string) || ""
    const order    = parseInt((formData.get("order") as string) || "0", 10)

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const asset = await sanityWriteClient.assets.upload("image", buffer, {
      filename:    file.name,
      contentType: file.type,
    })

    const doc = await sanityWriteClient.create({
      _type:   "galleryPhoto",
      image:   { _type: "image", asset: { _type: "reference", _ref: asset._id } },
      caption: caption || undefined,
      order,
    })

    return NextResponse.json({ success: true, photo: doc })
  } catch (error) {
    console.error("ERROR gallery/upload:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
