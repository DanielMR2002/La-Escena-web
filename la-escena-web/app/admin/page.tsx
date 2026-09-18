export const dynamic = "force-dynamic"

import Link from "next/link"
import Image from "next/image"
import { Users, Briefcase, Clock, CheckSquare } from "lucide-react"
import { getClients } from "@/services/user.service"
import { getArtists } from "@/services/artist.service"
import { getPendingRevisions, getPendingRevisionsCount } from "@/services/artist-revision.service"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sanityFreshClient, urlFor } from "@/lib/sanity"
import { formatCategoryLabel } from "@/lib/artistCategories"

const ACTIVITY = [
  { color: "bg-primary", text: "Nueva revisión enviada por un artista", time: "hace 2 horas" },
  { color: "bg-secondary", text: "Cliente creó una nueva shortlist", time: "hace 5 horas" },
  { color: "bg-emerald-500", text: "Perfil de artista aprobado", time: "hace 1 día" },
]

export default async function AdminDashboard() {
  const session = await requireAdmin()

  const [user, clients, artists, pendingRevisions, pendingRevisionsCount, pendingShortlistsCount] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    getClients(),
    getArtists(),
    getPendingRevisions(),
    getPendingRevisionsCount(),
    prisma.clientShortlist.count({ where: { status: "PENDING" } }),
  ])

  const topRevisions = pendingRevisions.slice(0, 5)
  const sanityIds = topRevisions
    .map(r => r.artist.sanityId)
    .filter((id): id is string => !!id)

  let sanityMap: Record<string, { name: string; city: string | null; agencyProfile: string | null; esProfesor: boolean | null; photo: any }> = {}
  if (sanityIds.length > 0) {
    const results = await sanityFreshClient.fetch(
      `*[_type == "artist" && _id in $ids]{ _id, name, city, agencyProfile, esProfesor, "photo": photos[0] }`,
      { ids: sanityIds }
    )
    sanityMap = Object.fromEntries(results.map((r: any) => [r._id, r]))
  }

  const displayName = (user?.name ?? session.user.email).toUpperCase()
  const today = new Date().toLocaleDateString("es-CO", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })

  const stats = [
    { label: "Total Artistas", value: artists.length, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Total Clientes", value: clients.length, icon: Briefcase, color: "text-secondary", bg: "bg-secondary/10" },
    { label: "Revisiones Pendientes", value: pendingRevisionsCount, icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Shortlists Pendientes", value: pendingShortlistsCount, icon: CheckSquare, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-1">Panel general</p>
          <h1 className="font-heading text-4xl sm:text-5xl tracking-wide text-admin-foreground">
            Bienvenido, {displayName}
          </h1>
        </div>
        <p className="text-sm text-admin-muted capitalize">{today}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-admin-elevated border border-admin-border rounded-xl p-5">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-4`}>
                <Icon size={18} className={s.color} />
              </div>
              <p className="font-heading text-5xl text-admin-foreground leading-none">{s.value}</p>
              <p className="text-xs text-admin-muted uppercase tracking-wide mt-2">{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* Content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Perfiles por revisar */}
        <div className="lg:col-span-2 bg-admin-elevated border border-admin-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-2xl tracking-wide text-admin-foreground">Perfiles por revisar</h2>
            <Link href="/admin/artists/revisions" className="text-xs text-primary hover:underline shrink-0">
              Ver todos →
            </Link>
          </div>

          {topRevisions.length === 0 ? (
            <p className="text-sm text-admin-muted py-8 text-center">No hay perfiles pendientes de revisión.</p>
          ) : (
            <div className="space-y-1">
              {topRevisions.map(rev => {
                const sanity = rev.artist.sanityId ? sanityMap[rev.artist.sanityId] : null
                const name = sanity?.name ?? rev.artist.user.email

                return (
                  <Link
                    key={rev.id}
                    href={`/admin/artists/${rev.artist.id}`}
                    className="flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-admin-border shrink-0">
                      {sanity?.photo && (
                        <Image src={urlFor(sanity.photo).width(80).height(80).url()} alt="" fill className="object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-admin-foreground truncate">{name}</p>
                      {(sanity?.agencyProfile || sanity?.city) && (
                        <p className="text-xs text-admin-muted truncate">
                          {[formatCategoryLabel(sanity?.agencyProfile, sanity?.esProfesor), sanity?.city].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-400/15 text-amber-400">
                      Pendiente
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Últimos movimientos */}
        <div className="bg-admin-elevated border border-admin-border rounded-xl p-6">
          <h2 className="font-heading text-2xl tracking-wide text-admin-foreground mb-5">Últimos movimientos</h2>
          <div className="space-y-4">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${a.color}`} />
                <div>
                  <p className="text-sm text-admin-foreground/90 leading-snug">{a.text}</p>
                  <p className="text-xs text-admin-muted mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
