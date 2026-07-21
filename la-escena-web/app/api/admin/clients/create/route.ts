export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { createClientWithArtists } from "@/services/client.service"

export async function POST(req: Request) {
  try {
    await requireAdmin()

    const body = await req.json()
    console.log("BODY:", body)

    const { name, email, password, artistIds } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      )
    }

    const client = await createClientWithArtists(
      email,
      password,
      artistIds || [],
      name || undefined
    )

    console.log("CLIENT CREATED:", client)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("CREATE CLIENT ERROR:", error)

    return NextResponse.json(
      { error: "Error creating client" },
      { status: 500 }
    )
  }
}
