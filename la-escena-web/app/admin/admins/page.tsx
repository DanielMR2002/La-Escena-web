export const dynamic = "force-dynamic"

import Link from "next/link"
import Image from "next/image"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sanityClient, urlFor } from "@/lib/sanity"

export default async function AdminAdminsPage() {
  await requireAdmin()

  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    include: { artistProfile: true },
    orderBy: { createdAt: "asc" },
  })

  const sanityIds = admins
    .map(a => a.artistProfile?.sanityId)
    .filter((id): id is string => !!id)

  const photoMap: Record<string, string> = {}
  if (sanityIds.length > 0) {
    const results: { _id: string; photo: any }[] = await sanityClient.fetch(
      `*[_type == "artist" && _id in $ids]{ _id, "photo": photos[0] }`,
      { ids: sanityIds }
    )
    for (const r of results) {
      if (r.photo) photoMap[r._id] = urlFor(r.photo).width(56).height(56).url()
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-4xl">Admins</h1>
        <Link href="/admin/admins/create">
          <button className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-red-700 transition-colors">
            + Crear Admin
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 divide-y divide-zinc-100">
        {admins.map(admin => {
          const sanityId  = admin.artistProfile?.sanityId
          const photoUrl  = sanityId ? (photoMap[sanityId] ?? null) : null
          const initials  = (admin.name ?? admin.email)[0]?.toUpperCase() ?? "A"

          return (
            <div key={admin.id} className="flex items-center gap-4 px-6 py-4">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-200 flex items-center justify-center shrink-0">
                {photoUrl ? (
                  <Image src={photoUrl} alt={admin.name ?? admin.email} width={40} height={40} className="object-cover w-full h-full" />
                ) : (
                  <span className="text-sm font-semibold text-zinc-500">{initials}</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900">{admin.name ?? <span className="text-zinc-400">Sin nombre</span>}</p>
                <p className="text-xs text-zinc-400">{admin.email}</p>
              </div>

              {/* Date */}
              <p className="text-xs text-zinc-400 shrink-0">
                {new Date(admin.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}
              </p>

              {/* Profile badge */}
              {sanityId ? (
                <Link href={`/admin/artists/${admin.artistProfile?.id}`} className="shrink-0">
                  <span className="px-2.5 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">Con perfil</span>
                </Link>
              ) : (
                <span className="shrink-0 px-2.5 py-1 text-xs bg-zinc-100 text-zinc-500 rounded-full">Sin perfil</span>
              )}
            </div>
          )
        })}

        {admins.length === 0 && (
          <p className="text-center text-zinc-400 py-12 text-sm">No hay administradores.</p>
        )}
      </div>
    </div>
  )
}
