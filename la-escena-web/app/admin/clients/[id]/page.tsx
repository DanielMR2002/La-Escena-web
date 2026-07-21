export const dynamic = "force-dynamic"

import Link from "next/link"
import { notFound } from "next/navigation"
import { CheckCircle, Clock } from "lucide-react"
import { requireAdmin } from "@/lib/auth"
import { getClientById } from "@/services/user.service"
import { getArtists } from "@/services/artist.service"
import ClientArtistManager from "./ClientArtistManager"
import ShortlistActions from "./ShortlistActions"

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()

  const { id } = await params

  const [client, allArtists] = await Promise.all([
    getClientById(id),
    getArtists()
  ])

  if (!client || client.role !== "CLIENT") notFound()

  const assignedArtistUserIds = new Set(client.clientAccess.map(a => a.artistId))

  const assignedArtists = client.clientAccess.map(a => ({
    artistId: a.artistId,
    email: a.artist.email
  }))

  const availableArtists = allArtists
    .filter(a => !assignedArtistUserIds.has(a.userId))
    .map(a => ({ userId: a.userId, email: a.user.email }))

  const pendingShortlist  = client.clientShortlists.find(s => s.status === "PENDING")  ?? null
  const approvedShortlist = client.clientShortlists.find(s => s.status === "APPROVED") ?? null

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/clients"
          className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          ← Volver a Clientes
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="font-heading text-4xl mb-1">
          {client.name ?? 'Cliente'}
        </h1>
        <p className="text-zinc-500 text-sm">{client.email}</p>
        <p className="text-xs text-zinc-400 mt-1">
          Creado el {new Date(client.createdAt).toLocaleDateString("es-CO", {
            day: "numeric", month: "long", year: "numeric"
          })}
        </p>
      </div>

      {/* Shortlist aprobada */}
      {approvedShortlist && (
        <div className="mb-8 bg-green-50 rounded-xl border border-green-300 p-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={16} className="text-green-600 shrink-0" />
            <h2 className="font-semibold text-zinc-800">Shortlist aprobada</h2>
            {approvedShortlist.reviewedAt && (
              <span className="ml-auto text-xs text-zinc-400">
                Aprobada el {new Date(approvedShortlist.reviewedAt).toLocaleDateString("es-CO", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(approvedShortlist.artistNames as string[]).map((name, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-green-100 text-green-800 text-xs rounded-full"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Shortlist pendiente */}
      {pendingShortlist && (
        <div className="mb-8 bg-white rounded-xl border border-amber-300 ring-1 ring-amber-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-amber-500 shrink-0" />
            <h2 className="font-semibold text-zinc-800">Shortlist pendiente de revisión</h2>
          </div>

          <div className="mb-3">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1.5">
              Artistas solicitados
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(pendingShortlist.artistNames as string[]).map((name, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-zinc-100 text-zinc-700 text-xs rounded-full"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>

          {pendingShortlist.message && (
            <div className="mb-3">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1">
                Mensaje del cliente
              </p>
              <p className="text-sm text-zinc-600">{pendingShortlist.message}</p>
            </div>
          )}

          <p className="text-xs text-zinc-400 mb-1">
            Enviada el {new Date(pendingShortlist.createdAt).toLocaleString("es-CO")}
          </p>

          <ShortlistActions id={pendingShortlist.id} />
        </div>
      )}

      <ClientArtistManager
        clientId={client.id}
        assignedArtists={assignedArtists}
        availableArtists={availableArtists}
      />
    </div>
  )
}
