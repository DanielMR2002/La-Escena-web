export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import Link from "next/link"
import { requireClient } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sanityClient } from "@/lib/sanity"
import ListaEditor, { type CatalogArtist } from "./ListaEditor"

type SanityArtistLite = {
  _id:      string
  name:     string
  city:     string | null
  category: string | null
  esProfesor: boolean | null
  photos:   any[]
}

export default async function ClienteListaPage() {
  let session
  try {
    session = await requireClient()
  } catch {
    redirect("/login")
  }

  const clientId = session.user.id

  const [pendingShortlist, approvedShortlist, accesses] = await Promise.all([
    prisma.clientShortlist.findFirst({
      where:   { clientId, status: "PENDING" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.clientShortlist.findFirst({
      where:   { clientId, status: "APPROVED" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.clientArtistAccess.findMany({
      where:   { clientId },
      include: { artist: { include: { artistProfile: true } } },
    }),
  ])

  const sanityIds = accesses
    .map(a => a.artist.artistProfile?.sanityId)
    .filter((id): id is string => !!id)

  let sanityMap: Record<string, SanityArtistLite> = {}
  if (sanityIds.length > 0) {
    const results: SanityArtistLite[] = await sanityClient.fetch(
      `*[_type == "artist" && _id in $ids]{ _id, name, city, category, esProfesor, photos }`,
      { ids: sanityIds }
    )
    sanityMap = Object.fromEntries(results.map(a => [a._id, a]))
  }

  const catalog: CatalogArtist[] = accesses.map(access => {
    const profile = access.artist.artistProfile
    const sanity  = profile?.sanityId ? sanityMap[profile.sanityId] : null
    return {
      id:       access.artistId,
      name:     sanity?.name     ?? access.artist.email,
      city:     sanity?.city     ?? null,
      category: sanity?.category ?? null,
      esProfesor: sanity?.esProfesor ?? null,
      photo:    sanity?.photos?.[0] ?? null,
    }
  })

  type Item = { id: string; name: string }

  function toItems(artistIds: unknown, artistNames: unknown): Item[] {
    const ids   = Array.isArray(artistIds)   ? (artistIds   as string[]) : []
    const names = Array.isArray(artistNames) ? (artistNames as string[]) : []
    return ids.map((id, i) => ({ id, name: names[i] ?? id }))
  }

  const pendingItems  = pendingShortlist  ? toItems(pendingShortlist.artistIds,  pendingShortlist.artistNames)  : null
  const approvedItems = approvedShortlist ? toItems(approvedShortlist.artistIds, approvedShortlist.artistNames) : null

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/cliente" className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors">
          ← Mis artistas
        </Link>
        <h1 className="font-heading text-4xl">Mi Lista</h1>
      </div>

      <ListaEditor
        pendingList={pendingItems}
        approvedList={approvedShortlist && !pendingShortlist ? approvedItems : null}
        pendingComment={pendingShortlist?.adminComment ?? null}
        catalog={catalog}
      />
    </div>
  )
}
