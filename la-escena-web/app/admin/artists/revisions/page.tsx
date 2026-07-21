export const dynamic = "force-dynamic"

import { requireAdmin } from "@/lib/auth"
import { getPendingRevisions } from "@/services/artist-revision.service"
import { sanityFreshClient, urlFor } from "@/lib/sanity"
import Image from "next/image"
import Link from "next/link"
import RevisionActions from "./RevisionActions"
import RevisionChanges from "./RevisionChanges"

type SanityPreview = {
  _id:    string
  name:   string | null
  photos: any[] | null
}

export default async function AdminArtistRevisionsPage() {
  await requireAdmin()

  const revisions = await getPendingRevisions()

  const sanityIds = revisions
    .map((r) => r.artist.sanityId)
    .filter((id): id is string => !!id)

  let sanityMap: Record<string, SanityPreview> = {}
  if (sanityIds.length > 0) {
    const results: SanityPreview[] = await sanityFreshClient.fetch(
      `*[_type == "artist" && _id in $ids]{ _id, name, photos }`,
      { ids: sanityIds }
    )
    sanityMap = Object.fromEntries(results.map((a) => [a._id, a]))
  }

  return (
    <div>
      <Link
        href="/admin/artists"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 mb-6 transition-colors"
      >
        ← Volver a Artistas
      </Link>

      <h1 className="font-heading text-4xl mb-8">Revisiones Pendientes</h1>

      {revisions.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
          <p className="text-zinc-400 text-sm">No hay revisiones pendientes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {revisions.map((revision) => {
            const data = revision.data as Record<string, string>
            const sanity = revision.artist.sanityId ? sanityMap[revision.artist.sanityId] : undefined
            const displayName = data?.name || sanity?.name || revision.artist.user.email
            const photo = sanity?.photos?.[0]

            return (
              <div key={revision.id} className="bg-white rounded-xl border border-zinc-200 overflow-hidden flex flex-col">
                <div className="relative aspect-[4/3]">
                  {photo ? (
                    <Image
                      src={urlFor(photo).width(400).height(300).url()}
                      alt={displayName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
                      <span className="text-4xl font-heading text-zinc-300">
                        {displayName?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                    PENDIENTE
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <p className="font-medium text-zinc-800">{displayName}</p>
                  <p className="text-xs text-zinc-400 mt-0.5 mb-4">
                    {new Date(revision.createdAt).toLocaleString("es-CO")}
                  </p>

                  <div className="mb-2">
                    <RevisionChanges data={data} />
                  </div>

                  <div className="mt-auto pt-4">
                    <RevisionActions id={revision.id} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
