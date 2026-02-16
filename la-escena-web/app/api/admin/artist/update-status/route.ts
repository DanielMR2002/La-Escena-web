export const dynamic = "force-dynamic"


import { getServerSession } from "next-auth"
import { authOptions } from "@/api/auth/[...nextauth]/route"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {

  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { artistId, status, comment } = await req.json()

  await prisma.artistProfile.update({
    where: { id: artistId },
    data: {
      status,
      adminComment: comment,
      reviewedAt: new Date()
    }
  })

  return NextResponse.json({ success: true })
}
