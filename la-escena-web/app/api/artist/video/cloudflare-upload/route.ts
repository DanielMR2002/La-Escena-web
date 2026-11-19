export const dynamic = "force-dynamic"
export const maxDuration = 120 // videos can take a while to upload

import { NextRequest, NextResponse } from "next/server"
import { requireArtistOrAdmin, AuthError } from "@/lib/auth"

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!
const API_TOKEN  = process.env.CLOUDFLARE_STREAM_API_TOKEN!

const ALLOWED_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm",
]

const MAX_SIZE_BYTES = 2 * 1024 * 1024 * 1024 // 2 GB

export async function POST(req: NextRequest) {
  try {
    await requireArtistOrAdmin()

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No se recibió ningún archivo." }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido. Solo mp4, mov, avi, webm." },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "El archivo no puede superar 2 GB." },
        { status: 400 }
      )
    }

    // Upload directly to Cloudflare Stream via their multipart API
    const cfForm = new FormData()
    cfForm.append("file", file, file.name)

    const cfRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/stream`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: cfForm,
      }
    )

    if (!cfRes.ok) {
      const err = await cfRes.text()
      console.error("Cloudflare Stream upload error:", err)
      return NextResponse.json(
        { error: "Error al subir el video a Cloudflare Stream." },
        { status: 500 }
      )
    }

    const cfData = await cfRes.json()
    const video = cfData.result

    // Return the embed URL — this is what gets stored in Sanity
    // Format: https://customer-<hash>.cloudflarestream.com/<uid>/iframe
    const embedUrl = video.preview ?? `https://cloudflarestream.com/${video.uid}/iframe`

    return NextResponse.json({
      uid:      video.uid,
      url:      embedUrl,
      thumbnail: `https://customer-${video.uid}.cloudflarestream.com/${video.uid}/thumbnails/thumbnail.jpg`,
    })

  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error("ERROR cloudflare-upload:", error)
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 })
  }
}
