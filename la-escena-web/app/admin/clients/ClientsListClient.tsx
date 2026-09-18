'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Mail, Clock } from 'lucide-react'

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
    `px-4 py-2.5 text-sm font-medium transition-colors border-r border-admin-border last:border-r-0 ${
      filterMode === mode
        ? mode === 'pending'
          ? 'bg-amber-400/15 text-amber-400'
          : 'bg-white/10 text-admin-foreground'
        : 'text-admin-muted hover:bg-white/5'
    }`

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* 3-button toggle group */}
        <div className="inline-flex rounded-lg border border-admin-border overflow-hidden bg-admin-elevated shrink-0">
          <button onClick={() => setFilterMode('all')} className={toggleClass('all')}>
            Todos
          </button>
          <button onClick={() => setFilterMode('pending')} className={toggleClass('pending')}>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} />
              Con revisión
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.5 text-xs rounded-full bg-amber-400/20 text-amber-400 font-semibold">
                  {pendingCount}
                </span>
              )}
            </span>
          </button>
          <button onClick={() => setFilterMode('no-pending')} className={toggleClass('no-pending')}>
            Sin revisión
          </button>
        </div>

        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-admin-border bg-admin-elevated text-sm text-admin-foreground placeholder:text-admin-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <p className="text-xs text-admin-muted uppercase tracking-wide mb-4">
        {filtered.length} cliente{filtered.length !== 1 ? 's' : ''}
      </p>

      {filtered.length === 0 ? (
        <div className="bg-admin-elevated rounded-xl border border-admin-border p-12 text-center">
          <p className="text-admin-muted text-sm">
            {search || filterMode !== 'all'
              ? 'No se encontraron clientes con esos criterios.'
              : 'No hay clientes registrados.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(c => {
            const hasPending = !!c.pendingShortlist
            const initials = (c.name ?? c.email)[0]?.toUpperCase() ?? '?'
            return (
              <div
                key={c.id}
                className={`bg-admin-elevated rounded-xl border p-5 flex flex-col gap-4 transition-colors ${
                  hasPending ? 'border-amber-400/40' : 'border-admin-border'
                }`}
              >
                {/* Header: avatar + nombre + badge */}
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-lg bg-primary flex items-center justify-center shrink-0">
                    <span className="font-heading text-xl text-white">{initials}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-xl tracking-wide text-admin-foreground truncate leading-tight">
                      {c.name ?? c.email}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-admin-muted mt-1 truncate">
                      <Mail size={11} className="shrink-0" />
                      {c.email}
                    </p>
                  </div>
                </div>

                {/* Artistas asignados */}
                <div>
                  <p className="font-heading text-4xl text-admin-foreground leading-none">{c.artistCount}</p>
                  <p className="text-xs text-admin-muted uppercase tracking-wide mt-1">Artistas asignados</p>
                </div>

                {/* Badge estado */}
                {hasPending ? (
                  <span className="self-start inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-400/15 text-amber-400 text-xs font-semibold rounded-full">
                    <Clock size={11} />
                    Shortlist pendiente
                  </span>
                ) : (
                  <span className="self-start inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-400/15 text-emerald-400 text-xs font-semibold rounded-full">
                    Al día
                  </span>
                )}

                <Link
                  href={`/admin/clients/${c.id}`}
                  className="mt-auto w-full text-center px-3 py-2.5 text-sm font-medium border border-admin-border rounded-lg text-admin-foreground hover:bg-white/5 transition-colors"
                >
                  Ver / Gestionar
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
