import { NextResponse } from "next/server"
import { requireArtistOrAdmin } from "@/lib/auth"
import { sanityWriteClient } from "@/lib/sanity"

const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

export async function POST(req: Request) {
  try {
    await requireArtistOrAdmin()

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 })
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "File exceeds 10 MB limit" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const asset = await sanityWriteClient.assets.upload("file", buffer, {
      filename: file.name,
      contentType: "application/pdf",
    })

    return NextResponse.json({ url: asset.url })

  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("ERROR cv/upload:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
