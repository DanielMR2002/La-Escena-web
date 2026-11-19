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

    // Request a one-time direct upload URL from Cloudflare Stream
    const cfRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/stream/direct_upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maxDurationSeconds: 3600,
          expiry: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          meta: { name: fileName },
        }),
      }
    )

    if (!cfRes.ok) {
      const err = await cfRes.text()
      console.error("Cloudflare direct_upload error:", err)
      return NextResponse.json({ error: "No se pudo generar la URL de subida." }, { status: 500 })
    }

    const cfData = await cfRes.json()
    const { uid, uploadURL } = cfData.result

    return NextResponse.json({ uid, uploadURL })

  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error("ERROR cloudflare-upload-url:", error)
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 })
  }
}
