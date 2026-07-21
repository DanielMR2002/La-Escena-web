"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

type AssignedArtist = {
  artistId: string
  email: string
}

type AvailableArtist = {
  userId: string
  email: string
}

type Props = {
  clientId: string
  assignedArtists: AssignedArtist[]
  availableArtists: AvailableArtist[]
}

export default function ClientArtistManager({ clientId, assignedArtists, availableArtists }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [toAdd, setToAdd] = useState<string[]>([])
  const [removing, setRemoving] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)

  const removeArtist = async (artistId: string) => {
    setRemoving(artistId)
    const res = await fetch("/api/admin/clients/remove-artist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, artistId })
    })
    setRemoving(null)
    if (res.ok) startTransition(() => router.refresh())
  }

  const addArtists = async () => {
    if (toAdd.length === 0) return
    setAdding(true)
    for (const artistId of toAdd) {
      await fetch("/api/admin/clients/assign-artist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, artistId })
      })
    }
    setToAdd([])
    setAdding(false)
    startTransition(() => router.refresh())
  }

  const toggleAdd = (userId: string) => {
    setToAdd(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Artistas asignados */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-3">
          <h2 className="font-semibold text-zinc-800">Artistas con acceso</h2>
          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
            {assignedArtists.length}
          </span>
        </div>

        {assignedArtists.length === 0 ? (
          <p className="text-sm text-zinc-400 px-6 py-8 text-center">
            Sin artistas asignados
          </p>
        ) : (
          <ul className="divide-y divide-zinc-50">
            {assignedArtists.map(a => (
              <li
                key={a.artistId}
                className="flex items-center justify-between px-6 py-3.5 hover:bg-zinc-50 transition-colors"
              >
                <span className="text-sm text-zinc-700">{a.email}</span>
                <button
                  onClick={() => removeArtist(a.artistId)}
                  disabled={isPending || removing === a.artistId}
                  className="px-3 py-1.5 text-xs font-medium border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {removing === a.artistId ? "Quitando..." : "Quitar acceso"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Agregar artistas */}
      {availableArtists.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100">
            <h2 className="font-semibold text-zinc-800">Agregar artistas</h2>
          </div>
          <div className="px-6 py-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
              {availableArtists.map(a => (
                <label
                  key={a.userId}
                  className="flex items-center gap-3 cursor-pointer hover:bg-zinc-50 rounded-lg px-2 py-1.5"
                >
                  <input
                    type="checkbox"
                    checked={toAdd.includes(a.userId)}
                    onChange={() => toggleAdd(a.userId)}
                    className="rounded accent-primary"
                  />
                  <span className="text-sm text-zinc-700">{a.email}</span>
                </label>
              ))}
            </div>

            {toAdd.length > 0 && (
              <button
                onClick={addArtists}
                disabled={adding || isPending}
                className="self-start px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {adding
                  ? "Asignando..."
                  : `Asignar ${toAdd.length} artista${toAdd.length !== 1 ? "s" : ""}`}
              </button>
            )}
          </div>
        </div>
      )}

      {availableArtists.length === 0 && assignedArtists.length > 0 && (
        <p className="text-sm text-zinc-400 text-center py-4">
          Todos los artistas ya tienen acceso asignado.
        </p>
      )}
    </div>
  )
}
