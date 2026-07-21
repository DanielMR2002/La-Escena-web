import { NextResponse } from "next/server"
import { requireClient } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await requireClient()
    const { artistIds, artistNames, message } = await req.json()

    if (!Array.isArray(artistIds) || artistIds.length === 0) {
      return NextResponse.json({ error: "No artists selected" }, { status: 400 })
    }

    const existing = await prisma.clientShortlist.findFirst({
      where: { clientId: session.user.id, status: "PENDING" },
    })

    const shortlist = existing
      ? await prisma.clientShortlist.update({
          where: { id: existing.id },
          data: { artistIds, artistNames, message: message ?? null },
        })
      : await prisma.clientShortlist.create({
          data: {
            clientId:    session.user.id,
            artistIds,
            artistNames,
            message:     message ?? null,
          },
        })

    return NextResponse.json({
      shortlist: {
        id:           shortlist.id,
        status:       shortlist.status,
        adminComment: shortlist.adminComment,
        artistNames:  shortlist.artistNames,
        createdAt:    shortlist.createdAt.toISOString(),
      },
    })
  } catch (error) {
    console.error("Shortlist submit error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
