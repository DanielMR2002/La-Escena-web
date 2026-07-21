export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { getArtists } from "@/services/artist.service"
import { sanityFreshClient } from "@/lib/sanity"

type SanityArtist = {
  _id:        string
  name:       string
  slug:       string
  city:       string | null
  category:   string | null
  agencyProfile: string | null
  esProfesor: boolean | null
  styles:     string[]
  experience: number | null
  age:        number | null
  height:     number | null
  hashtags:   string[]
  photos:     any[]
  featured:   boolean | null
  visible:    boolean | null
}

export async function GET() {
  try {
    await requireAdmin()

    const artists = await getArtists()

    const sanityIds = artists
      .map(a => a.sanityId)
      .filter((id): id is string => !!id)

    let sanityMap: Record<string, SanityArtist> = {}
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
          styles,
          experience,
          age,
          height,
          hashtags,
          photos,
          featured,
          visible
        }`,
        { ids: sanityIds }
      )
      sanityMap = Object.fromEntries(results.map(a => [a._id, a]))
    }

    const enriched = artists.map(a => {
      const sanity = a.sanityId ? (sanityMap[a.sanityId] ?? null) : null
      return {
        id:         a.id,
        userId:     a.userId,
        email:      a.user.email,
        sanityId:   a.sanityId ?? null,
        name:       sanity?.name       ?? null,
        slug:       sanity?.slug       ?? null,
        city:       sanity?.city       ?? null,
        category:   sanity?.category   ?? null,
        agencyProfile: sanity?.agencyProfile ?? null,
        esProfesor: sanity?.esProfesor ?? false,
        styles:     sanity?.styles     ?? [],
        experience: sanity?.experience ?? null,
        age:        sanity?.age        ?? null,
        height:     sanity?.height     ?? null,
        hashtags:   sanity?.hashtags   ?? [],
        photo:      sanity?.photos?.[0] ?? null,
        featured:   sanity?.featured    ?? false,
        visible:    sanity?.visible     ?? false,
        status:     a.status,
      }
    })

    return NextResponse.json(enriched)

  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }
}
