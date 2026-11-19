export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { requireArtistOrAdmin, AuthError } from "@/lib/auth"

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!
const API_TOKEN  = process.env.CLOUDFLARE_STREAM_API_TOKEN!

export async function POST(req: NextRequest) {
  try {
    await requireArtistOrAdmin()

    const { fileName, fileSize } = await req.json()

    if (!fileName || !fileSize) {
      return NextResponse.json({ error: "Missing fileName or fileSize" }, { status: 400 })
    }

    const MAX_SIZE = 2 * 1024 * 1024 * 1024 // 2 GB
    if (fileSize > MAX_SIZE) {
      return NextResponse.json({ error: "El archivo no puede superar 2 GB." }, { status: 400 })
    }

    if (!ACCOUNT_ID || !API_TOKEN) {
      return NextResponse.json({ error: "Configuración de Cloudflare incompleta." }, { status: 500 })
    }

    // TUS endpoint — no requiresignedurls so the video is publicly playable
    const cfRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/stream?direct_user=true`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Tus-Resumable": "1.0.0",
          "Upload-Length": String(fileSize),
          "Upload-Metadata": `name ${Buffer.from(fileName).toString("base64")}`,
        },
      }
    )

    if (!cfRes.ok) {
      const err = await cfRes.text()
      console.error("Cloudflare TUS init error:", cfRes.status, err)
      return NextResponse.json(
        { error: `Cloudflare error ${cfRes.status}: ${err}` },
        { status: 500 }
      )
    }

    const uploadURL = cfRes.headers.get("location")
    const uid = cfRes.headers.get("stream-media-id")

    if (!uploadURL || !uid) {
      console.error("Missing headers:", Object.fromEntries(cfRes.headers.entries()))
      return NextResponse.json({ error: "No se recibió URL de subida de Cloudflare." }, { status: 500 })
    }

    return NextResponse.json({ uid, uploadURL })

  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error("ERROR cloudflare-upload-url:", error)
    return NextResponse.json({ error: `Error interno: ${error instanceof Error ? error.message : String(error)}` }, { status: 500 })
  }
}
