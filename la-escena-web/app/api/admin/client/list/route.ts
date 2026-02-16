export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { getClients } from "@/services/user.service"

export async function GET() {
  try {
    await requireAdmin()

    const clients = await getClients()

    return NextResponse.json(clients)

  } catch {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    )
  }
}
