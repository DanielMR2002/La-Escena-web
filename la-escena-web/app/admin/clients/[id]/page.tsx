export const dynamic = "force-dynamic"

import Link from "next/link"
import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { getClientById } from "@/services/user.service"
import { getArtists } from "@/services/artist.service"
import { sanityFreshClient } from "@/lib/sanity"
import ClientArtistManager from "./ClientArtistManager"
import ShortlistActions from "./ShortlistActions"
import DeleteClientButton from "./DeleteClientButton"

type SanityArtistData = {
  _id: string
  name: string | null
  slug: string | null
  city: string | null
  category: string | null
  agencyProfile: string | null
  esProfesor: boolean | null
  photo: any | null
}

export type ArtistCardData = {
  userId: string
  email: string
  sanityId: string | null
  name: string | null
  slug: string | null
  city: string | null
  category: string | null
  agencyProfile: string | null
  esProfesor: boolean | null
  photo: any | null
}

export type ShortlistCardData = {
  id: string
  status: "PENDING" | "APPROVED"
  createdAt: Date
  reviewedAt: Date | null
  message: string | null
  artists: ArtistCardData[]  // enriched
  artistNames: string[]      // fallback if no sanity data
}

async function enrichArtists(
  artists: { userId: string; email: string; sanityId: string | null }[]
): Promise<ArtistCardData[]> {
  const sanityIds = artists.map(a => a.sanityId).filter((id): id is string => !!id)
  let sanityMap: Record<string, SanityArtistData> = {}
  if (sanityIds.length > 0) {
    const results: SanityArtistData[] = await sanityFreshClient.fetch(
      `*[_type == "artist" && _id in $ids]{
        _id, name, "slug": slug.current, city, category,
        agencyProfile, esProfesor, "photo": photos[0]
      }`,
      { ids: sanityIds }
    )
    sanityMap = Object.fromEntries(results.map(r => [r._id, r]))
  }
  return artists.map(a => {
    const s = a.sanityId ? (sanityMap[a.sanityId] ?? null) : null
    return {
      userId:        a.userId,
      email:         a.email,
      sanityId:      a.sanityId,
      name:          s?.name         ?? null,
      slug:          s?.slug         ?? null,
      city:          s?.city         ?? null,
      category:      s?.category     ?? null,
      agencyProfile: s?.agencyProfile ?? null,
      esProfesor:    s?.esProfesor   ?? null,
      photo:         s?.photo        ?? null,
    }
  })
}

async function enrichShortlist(
  shortlist: { id: string; status: string; createdAt: Date; reviewedAt: Date | null; message: string | null; artistIds: any; artistNames: any },
  allArtists: { userId: string; user: { email: string }; sanityId: string | null }[]
): Promise<ShortlistCardData> {
  const ids = (shortlist.artistIds as string[]) ?? []
  const artistRaw = allArtists
    .filter(a => ids.includes(a.userId))
    .map(a => ({ userId: a.userId, email: a.user.email, sanityId: a.sanityId ?? null }))
  const artists = await enrichArtists(artistRaw)
  return {
    id:          shortlist.id,
    status:      shortlist.status as "PENDING" | "APPROVED",
    createdAt:   shortlist.createdAt,
    reviewedAt:  shortlist.reviewedAt,
    message:     shortlist.message,
    artists,
    artistNames: (shortlist.artistNames as string[]) ?? [],
  }
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params

  const [client, allArtists] = await Promise.all([getClientById(id), getArtists()])
  if (!client || client.role !== "CLIENT") notFound()

  const assignedArtistUserIds = new Set(client.clientAccess.map(a => a.artistId))

  const assignedRaw = client.clientAccess.map(a => ({
    userId:   a.artistId,
    email:    a.artist.email,
    sanityId: a.artist.artistProfile?.sanityId ?? null,
  }))

  const availableRaw = allArtists
    .filter(a => !assignedArtistUserIds.has(a.userId))
    .map(a => ({
      userId:   a.userId,
      email:    a.user.email,
      sanityId: a.sanityId ?? null,
    }))

  const pendingShortlistRaw  = client.clientShortlists.find(s => s.status === "PENDING")  ?? null
  const approvedShortlistRaw = client.clientShortlists.find(s => s.status === "APPROVED") ?? null

  const [assignedArtists, availableArtists, pendingShortlist, approvedShortlist] = await Promise.all([
    enrichArtists(assignedRaw),
    enrichArtists(availableRaw),
    pendingShortlistRaw  ? enrichShortlist(pendingShortlistRaw,  allArtists) : Promise.resolve(null),
    approvedShortlistRaw ? enrichShortlist(approvedShortlistRaw, allArtists) : Promise.resolve(null),
  ])

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/clients" className="text-sm text-admin-muted hover:text-admin-foreground transition-colors">
          ← Volver a Clientes
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-heading text-4xl sm:text-5xl tracking-wide text-admin-foreground mb-1">
              {client.name ?? 'Cliente'}
            </h1>
            <p className="text-admin-muted text-sm">{client.email}</p>
            <p className="text-xs text-admin-muted mt-1">
              Creado el {new Date(client.createdAt).toLocaleDateString("es-CO", {
                day: "numeric", month: "long", year: "numeric"
              })}
            </p>
          </div>
          <DeleteClientButton clientId={client.id} clientName={client.name ?? client.email} />
        </div>
      </div>

      <ClientArtistManager
        clientId={client.id}
        assignedArtists={assignedArtists}
        availableArtists={availableArtists}
        approvedShortlist={approvedShortlist}
        pendingShortlist={pendingShortlist}
      />
    </div>
  )
}
