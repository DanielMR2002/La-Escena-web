import { NextResponse } from "next/server"
import { requireArtistOrAdmin } from "@/lib/auth"
import { sanityWriteClient } from "@/lib/sanity"

const MAX_SIZE_BYTES = 200 * 1024 * 1024 // 200 MB

const ALLOWED_TYPES: Record<string, string> = {
  "video/mp4":       "video/mp4",
  "video/quicktime": "video/quicktime",
  "video/x-msvideo": "video/x-msvideo",
  "video/webm":      "video/webm",
}

export async function POST(req: Request) {
  try {
    await requireArtistOrAdmin()

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!ALLOWED_TYPES[file.type]) {
      return NextResponse.json(
        { error: "Solo se permiten archivos de video (mp4, mov, avi, webm)." },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "El archivo no puede superar 200 MB." }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const asset = await sanityWriteClient.assets.upload("file", buffer, {
      filename: file.name,
      contentType: file.type,
    })

    return NextResponse.json({ url: asset.url })

  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("ERROR video/upload:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
