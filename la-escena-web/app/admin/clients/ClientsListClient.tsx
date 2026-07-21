'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Users, Clock } from 'lucide-react'

export type ClientListItem = {
  id: string
  name: string | null
  email: string
  createdAt: string
  artistCount: number
  pendingShortlist: {
    id: string
    artistNames: string[]
    createdAt: string
  } | null
}

type FilterMode = 'all' | 'pending' | 'no-pending'

export default function ClientsListClient({ clients }: { clients: ClientListItem[] }) {
  const [search, setSearch]           = useState('')
  const [filterMode, setFilterMode]   = useState<FilterMode>('all')

  const pendingCount = useMemo(() => clients.filter(c => c.pendingShortlist).length, [clients])

  const filtered = useMemo(() => {
    return clients.filter(c => {
      if (filterMode === 'pending'    && !c.pendingShortlist) return false
      if (filterMode === 'no-pending' &&  c.pendingShortlist) return false
      const q = search.trim().toLowerCase()
      if (!q) return true
      return (
        (c.name?.toLowerCase().includes(q) ?? false) ||
        c.email.toLowerCase().includes(q)
      )
    })
  }, [clients, search, filterMode])

  const toggleClass = (mode: FilterMode) =>
    `px-4 py-2.5 text-sm font-medium transition-colors border-r border-zinc-200 last:border-r-0 ${
      filterMode === mode
        ? mode === 'pending'
          ? 'bg-amber-50 text-amber-700'
          : 'bg-zinc-100 text-zinc-800'
        : 'text-zinc-500 hover:bg-zinc-50'
    }`

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* 3-button toggle group */}
        <div className="inline-flex rounded-lg border border-zinc-200 overflow-hidden bg-white shrink-0">
          <button onClick={() => setFilterMode('all')} className={toggleClass('all')}>
            Todos
          </button>
          <button onClick={() => setFilterMode('pending')} className={toggleClass('pending')}>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} />
              Con revisión pendiente
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700 font-semibold">
                  {pendingCount}
                </span>
              )}
            </span>
          </button>
          <button onClick={() => setFilterMode('no-pending')} className={toggleClass('no-pending')}>
            Sin revisión pendiente
          </button>
        </div>
      </div>

      <p className="text-sm text-zinc-400 mb-4">
        {filtered.length} cliente{filtered.length !== 1 ? 's' : ''}
      </p>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
          <p className="text-zinc-400 text-sm">
            {search || filterMode !== 'all'
              ? 'No se encontraron clientes con esos criterios.'
              : 'No hay clientes registrados.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(c => {
            const hasPending = !!c.pendingShortlist
            return (
              <div
                key={c.id}
                className={`bg-white rounded-xl border p-5 flex flex-col gap-3 transition-shadow hover:shadow-md ${
                  hasPending
                    ? 'border-amber-300 ring-1 ring-amber-200'
                    : 'border-zinc-200'
                }`}
              >
                {/* Header: nombre + badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-zinc-900 truncate leading-tight">
                      {c.name ?? c.email}
                    </p>
                    {c.name && (
                      <p className="text-xs text-zinc-400 mt-0.5 truncate">{c.email}</p>
                    )}
                  </div>
                  {hasPending && (
                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                      <Clock size={11} />
                      Pendiente
                    </span>
                  )}
                </div>

                {/* Artistas asignados */}
                <div className="flex items-center gap-1.5">
                  <Users size={13} className="text-zinc-400 shrink-0" />
                  <span className="text-xs text-zinc-500">
                    {c.artistCount} artista{c.artistCount !== 1 ? 's' : ''} asignado{c.artistCount !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Preview shortlist pendiente */}
                {hasPending && (
                  <div className="px-3 py-2 bg-amber-50 rounded-lg text-xs text-amber-800 leading-relaxed">
                    <span className="font-medium">Shortlist: </span>
                    {c.pendingShortlist!.artistNames.join(', ')}
                  </div>
                )}

                {/* Footer: fecha + acción */}
                <div className="flex items-center justify-between mt-auto pt-1">
                  <p className="text-xs text-zinc-400">
                    {new Date(c.createdAt).toLocaleDateString('es-CO', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </p>
                  <Link
                    href={`/admin/clients/${c.id}`}
                    className="px-3 py-1.5 text-xs font-medium border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
                  >
                    Ver / Gestionar →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
