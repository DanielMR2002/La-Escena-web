export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireAdmin, AuthError } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getArtists } from "@/services/artist.service"
import { sanityFreshClient } from "@/lib/sanity"

export async function GET() {
  try {
    const session = await requireAdmin()

    // Un ADMIN puede tener un ArtistProfile propio (creado al entrar a /artista) —
    // se excluye acá porque ya se agrega abajo como ADMIN, para no duplicarlo.
    const artistProfiles = (await getArtists()).filter(a => a.user.role === "ARTIST")

    const sanityIds = artistProfiles
      .map(a => a.sanityId)
      .filter((id): id is string => !!id)

    let sanityNames: Record<string, string> = {}
    if (sanityIds.length > 0) {
      const results: { _id: string; name: string }[] = await sanityFreshClient.fetch(
        `*[_type == "artist" && _id in $ids]{ _id, name }`,
        { ids: sanityIds }
      )
      sanityNames = Object.fromEntries(results.map(r => [r._id, r.name]))
    }

    const artists = artistProfiles.map(a => ({
      userId: a.userId,
      name: (a.sanityId ? sanityNames[a.sanityId] : null) ?? null,
      email: a.user.email,
      role: "ARTIST" as const,
    }))

    const admins = await prisma.user.findMany({
      where: { role: "ADMIN", id: { not: session.user.id } },
      select: { id: true, name: true, email: true },
    })

    const adminOptions = admins.map(a => ({
      userId: a.id,
      name: a.name,
      email: a.email,
      role: "ADMIN" as const,
    }))

    return NextResponse.json([...artists, ...adminOptions])

  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error("GET /api/admin/messages/recipients:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
