export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { createArtist } from "@/services/artist-create.service"

export async function POST(req: Request) {
  try {
    await requireAdmin()

    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      )
    }

    const artist = await createArtist(email, password)

    return NextResponse.json({
      success: true,
      artist
    })

  } catch (error) {
    console.error("CREATE ARTIST ERROR:", error)

    return NextResponse.json(
      { error: "Error creating artist" },
      { status: 500 }
    )
  }
}
