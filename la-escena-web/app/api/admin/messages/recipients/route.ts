export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireAdmin, AuthError } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getArtists } from "@/services/artist.service"
import { sanityFreshClient, urlFor } from "@/lib/sanity"

export async function GET() {
  try {
    const session = await requireAdmin()

    // All artist profiles — no role filter; admins who also have an artist profile
    // are included once as ARTIST here and deduplicated below before the ADMIN list.
    const artistProfiles = await getArtists()

    const sanityIds = artistProfiles
      .map(a => a.sanityId)
      .filter((id): id is string => !!id)

    type SanityArtist = {
      _id: string
      name: string | null
      slug: string | null
      city: string | null
      category: string | null
      agencyProfile: string | null
      esProfesor: boolean | null
      photo: any | null
      styles: string[]
      experience: number | null
      age: number | null
      height: number | null
      hashtags: string[]
    }

    let sanityData: Record<string, SanityArtist> = {}
    if (sanityIds.length > 0) {
      const results: SanityArtist[] = await sanityFreshClient.fetch(
        `*[_type == "artist" && _id in $ids]{
          _id,
          name,
          "slug": slug.current,
          city,
          category,
          agencyProfile,
          esProfesor,
          "photo": photos[0],
          "styles": coalesce(styles, []),
          experience,
          age,
          height,
          "hashtags": coalesce(hashtags, [])
        }`,
        { ids: sanityIds }
      )
      sanityData = Object.fromEntries(results.map(r => [r._id, r]))
    }

    const artistUserIds = new Set(artistProfiles.map(a => a.userId))

    const artists = artistProfiles.map(a => {
      const s = a.sanityId ? sanityData[a.sanityId] : null
      return {
        userId:        a.userId,
        name:          s?.name ?? null,
        email:         a.user.email,
        role:          "ARTIST" as const,
        city:          s?.city ?? null,
        category:      s?.category ?? null,
        agencyProfile: s?.agencyProfile ?? null,
        esProfesor:    s?.esProfesor ?? null,
        photo:         s?.photo ?? null,
        slug:          s?.slug ?? null,
        styles:        s?.styles ?? [],
        experience:    s?.experience ?? null,
        age:           s?.age ?? null,
        height:        s?.height ?? null,
        hashtags:      s?.hashtags ?? [],
      }
    })

    // Admins — exclude self and anyone already in the artist list
    const admins = await prisma.user.findMany({
      where: {
        role: "ADMIN",
        id: {
          not:    session.user.id,
          notIn:  Array.from(artistUserIds),
        },
      },
      select: { id: true, name: true, email: true },
    })

    const adminOptions = admins.map(a => ({
      userId: a.id,
      name:   a.name,
      email:  a.email,
      role:   "ADMIN" as const,
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
