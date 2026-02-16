export const dynamic = "force-dynamic"


import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/api/auth/[...nextauth]/route"

export async function POST(req: Request) {

  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { clientId, artistId } = await req.json()

  await prisma.clientArtistAccess.create({
    data: {
      clientId,
      artistId
    }
  })

  return NextResponse.json({ success: true })
}
