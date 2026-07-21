export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { requireClient } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sanityClient } from "@/lib/sanity"
import ClienteDashboardClient, { type ArtistCard } from "./ClienteDashboardClient"

type SanityArtist = {
  _id: string
  name: string
  slug: { current: string }
  city: string
  category: string
  agencyProfile: string | null
  esProfesor: boolean | null
  experience: number
  age: number
  height: number
  styles: string[]
  hashtags: string[]
  photos: any[]
  artistAvailability: string | null
  adminAvailabilityOverride: string | null
}

export default async function ClienteDashboard() {
  let session
  try {
    session = await requireClient()
  } catch {
    redirect("/login")
  }

  const accesses = await prisma.clientArtistAccess.findMany({
    where: { clientId: session.user.id },
    include: { artist: { include: { artistProfile: true } } },
  })

  const sanityIds = accesses
    .map(a => a.artist.artistProfile?.sanityId)
    .filter((id): id is string => !!id)

  let sanityMap: Record<string, SanityArtist> = {}
  if (sanityIds.length > 0) {
    const results: SanityArtist[] = await sanityClient.fetch(
      `*[_type == "artist" && _id in $ids]{
        _id, name, slug, city, category, agencyProfile, esProfesor, experience, age, height,
        styles, hashtags, photos, artistAvailability, adminAvailabilityOverride
      }`,
      { ids: sanityIds }
    )
    sanityMap = Object.fromEntries(results.map(a => [a._id, a]))
  }

  const artists: ArtistCard[] = accesses.map(access => {
    const profile = access.artist.artistProfile
    const sanity  = profile?.sanityId ? sanityMap[profile.sanityId] : null
    const data    = profile?.profileData as Record<string, any> | null
    const rawAvailability = sanity?.adminAvailabilityOverride ?? sanity?.artistAvailability

    return {
      artistId:     access.artistId,
      name:         sanity?.name        ?? data?.name     ?? access.artist.email,
      city:         sanity?.city        ?? data?.city,
      category:     sanity?.category    ?? data?.category,
      agencyProfile: sanity?.agencyProfile ?? data?.agencyProfile,
      esProfesor:   sanity?.esProfesor   ?? data?.esProfesor,
      experience:   sanity?.experience  ?? data?.experience,
      age:          sanity?.age         ?? data?.age,
      height:       sanity?.height      ?? data?.height,
      styles:       sanity?.styles      ?? data?.styles   ?? [],
      hashtags:     sanity?.hashtags    ?? data?.hashtags ?? [],
      photo:        sanity?.photos?.[0] ?? null,
      slug:         sanity?.slug?.current,
      availability: rawAvailability as ArtistCard['availability'],
    }
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-4xl mb-1">Mis Artistas</h1>
        <p className="text-zinc-500 text-sm">{session.user.email}</p>
      </div>

      {accesses.length === 0 ? (
        <div className="text-center py-24 text-zinc-400">
          <p className="text-lg">No tienes artistas asignados aún.</p>
          <p className="text-sm mt-2">Contacta a La Escena para gestionar tu acceso.</p>
        </div>
      ) : (
        <ClienteDashboardClient artists={artists} />
      )}
    </div>
  )
}
