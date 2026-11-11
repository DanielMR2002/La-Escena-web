"use client"

import React, { useState, useTransition, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, SlidersHorizontal, X, Plus, Trash2, ChevronDown, ChevronUp, CheckCircle, Clock } from "lucide-react"
import { urlFor } from "@/lib/sanity"
import { formatCategoryLabel } from "@/lib/artistCategories"
import Filters from "@/app/components/Filters"
import { applyArtistFilters } from "@/lib/filters/applyArtistFilters"
import { getAvailableFilterOptions } from "@/lib/filters/getAvailableFilterOptions"
import { ArtistFiltersV2, EMPTY_FILTERS } from "@/types/artistFilters"
import ShortlistActions from "./ShortlistActions"
import type { ArtistCardData, ShortlistCardData } from "./page"

// ─── Shared photo card (module-level, NOT inside render) ───────────────────
function ArtistPhotoCard({
  artist,
  action,
  dimmed,
}: {
  artist: ArtistCardData
  action?: React.ReactNode
  dimmed?: boolean
}) {
  const displayName = artist.name ?? artist.email
  const label = formatCategoryLabel(artist.agencyProfile || artist.category, artist.esProfesor)
  return (
    <div className={`relative aspect-[3/4] rounded-xl overflow-hidden border border-admin-border bg-admin-elevated transition-opacity ${dimmed ? "opacity-50" : ""}`}>
      {action && <div className="absolute top-2 right-2 z-20">{action}</div>}
      {artist.slug && (
        <Link
          href={`/artistas/${artist.slug}?from=panel`}
          onClick={e => e.stopPropagation()}
          className="absolute top-2 left-2 z-20 p-1.5 rounded-full bg-zinc-900/70 backdrop-blur text-white/70 hover:text-white transition-colors"
          title="Ver perfil"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </Link>
      )}
      {artist.photo ? (
        <Image
          src={urlFor(artist.photo).width(280).height(373).url()}
          alt={displayName}
          fill
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-3xl font-heading text-admin-muted">{displayName[0]?.toUpperCase()}</span>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/50 to-transparent pt-8 pb-3 px-3">
        <p className="font-heading text-base text-white tracking-wide truncate">{displayName}</p>
        {label && <p className="text-[11px] text-primary truncate">{label}</p>}
        {artist.city && <p className="text-[11px] text-zinc-300 truncate">{artist.city}</p>}
      </div>
    </div>
  )
}

// ─── Collapsible section header ────────────────────────────────────────────
function SectionHeader({
  label, count, collapsed, onToggle, colorClass = "text-admin-foreground", badgeClass = "bg-primary/15 text-primary",
}: {
  label: string; count: number; collapsed: boolean; onToggle: () => void
  colorClass?: string; badgeClass?: string
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between mb-5 px-4 py-3 rounded-xl border border-admin-border bg-admin-elevated hover:border-primary/50 hover:bg-admin-border transition-colors group"
    >
      <div className="flex items-center gap-3">
        <h2 className={`font-heading text-2xl tracking-wide ${colorClass}`}>{label}</h2>
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badgeClass}`}>{count}</span>
      </div>
      <span className="text-admin-muted group-hover:text-admin-foreground transition-colors">
        {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
      </span>
    </button>
  )
}

// ─── Main component ────────────────────────────────────────────────────────
export default function ClientArtistManager({
  clientId,
  assignedArtists,
  availableArtists,
  approvedShortlist,
  pendingShortlist,
}: {
  clientId: string
  assignedArtists: ArtistCardData[]
  availableArtists: ArtistCardData[]
  approvedShortlist: ShortlistCardData | null
  pendingShortlist: ShortlistCardData | null
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [toAdd, setToAdd] = useState<Set<string>>(new Set())
  const [removing, setRemoving] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)

  // Collapse states
  const [collapseApproved,  setCollapseApproved]  = useState(false)
  const [collapsePending,   setCollapsePending]   = useState(false)
  const [collapseCatalog,   setCollapseCatalog]   = useState(false)

  // Filters for available artists
  const [search, setSearch]           = useState("")
  const [filters, setFilters]         = useState<ArtistFiltersV2>(EMPTY_FILTERS)
  const [showFilters, setShowFilters] = useState(false)

  const filterOptions = useMemo(() => getAvailableFilterOptions(availableArtists as any), [availableArtists])
  const { categories, cities, styles, experienceRange, ageRange, heightRange } = filterOptions

  const activeFilterCount = [
    filters.category, filters.city,
    (filters.styles?.length ?? 0) > 0,
    filters.minExperience != null, filters.maxExperience != null,
    filters.minAge != null, filters.maxAge != null,
    filters.minHeight != null, filters.maxHeight != null,
    filters.hashtagSearch,
  ].filter(Boolean).length

  const filteredAvailable = useMemo(() => {
    let result = applyArtistFilters(availableArtists as any, filters) as ArtistCardData[]
    const q = search.trim().toLowerCase()
    if (q) result = result.filter(a =>
      (a.name ?? a.email).toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      (a.city?.toLowerCase().includes(q) ?? false)
    )
    return result
  }, [availableArtists, filters, search])

  async function removeArtist(artistId: string) {
    setRemoving(artistId)
    await fetch("/api/admin/clients/remove-artist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, artistId }),
    })
    setRemoving(null)
    startTransition(() => router.refresh())
  }

  async function addArtists() {
    if (toAdd.size === 0) return
    setAdding(true)
    for (const artistId of toAdd) {
      await fetch("/api/admin/clients/assign-artist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, artistId }),
      })
    }
    setToAdd(new Set())
    setAdding(false)
    startTransition(() => router.refresh())
  }

  function toggleAdd(userId: string) {
    setToAdd(prev => {
      const next = new Set(prev)
      next.has(userId) ? next.delete(userId) : next.add(userId)
      return next
    })
  }

  return (
    <div className="space-y-8">

      {/* ── Shortlist aprobada ─────────────────────────────────────────── */}
      {approvedShortlist && (
        <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 overflow-hidden">
          {/* header */}
          <button
            onClick={() => setCollapseApproved(v => !v)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-emerald-500/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <CheckCircle size={16} className="text-emerald-400 shrink-0" />
              <h2 className="font-heading text-2xl tracking-wide text-admin-foreground">Shortlist aprobada</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300">
                {approvedShortlist.artists.length || approvedShortlist.artistNames.length}
              </span>
              {approvedShortlist.reviewedAt && (
                <span className="text-xs text-admin-muted hidden sm:inline">
                  · Aprobada el {new Date(approvedShortlist.reviewedAt).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              )}
            </div>
            <span className="text-admin-muted group-hover:text-admin-foreground transition-colors">
              {collapseApproved ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </span>
          </button>

          {!collapseApproved && (
            <div className="px-6 pb-6">
              {approvedShortlist.artists.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {approvedShortlist.artists.map(a => (
                    <ArtistPhotoCard key={a.userId} artist={a} />
                  ))}
                </div>
              ) : (
                // fallback: solo nombres si no hay foto
                <div className="flex flex-wrap gap-1.5">
                  {approvedShortlist.artistNames.map((name, i) => (
                    <span key={i} className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full">{name}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ── Shortlist pendiente ────────────────────────────────────────── */}
      {pendingShortlist && (
        <section className="rounded-xl border border-amber-400/30 bg-amber-400/5 overflow-hidden">
          <button
            onClick={() => setCollapsePending(v => !v)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-amber-400/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-amber-400 shrink-0" />
              <h2 className="font-heading text-2xl tracking-wide text-admin-foreground">Shortlist pendiente</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300">
                {pendingShortlist.artists.length || pendingShortlist.artistNames.length}
              </span>
            </div>
            <span className="text-admin-muted group-hover:text-admin-foreground transition-colors">
              {collapsePending ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </span>
          </button>

          {!collapsePending && (
            <div className="px-6 pb-6 space-y-4">
              {pendingShortlist.artists.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {pendingShortlist.artists.map(a => (
                    <ArtistPhotoCard key={a.userId} artist={a} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {pendingShortlist.artistNames.map((name, i) => (
                    <span key={i} className="px-2.5 py-1 bg-admin-elevated text-admin-foreground text-xs rounded-full border border-admin-border">{name}</span>
                  ))}
                </div>
              )}
              {pendingShortlist.message && (
                <div>
                  <p className="text-xs font-medium text-admin-muted uppercase tracking-wide mb-1">Mensaje del cliente</p>
                  <p className="text-sm text-admin-foreground">{pendingShortlist.message}</p>
                </div>
              )}
              <p className="text-xs text-admin-muted">
                Enviada el {new Date(pendingShortlist.createdAt).toLocaleString("es-CO")}
              </p>
              <ShortlistActions id={pendingShortlist.id} />
            </div>
          )}
        </section>
      )}

      {/* ── Catálogo del cliente ───────────────────────────────────────── */}
      <section>
        <SectionHeader
          label="Catálogo del cliente"
          count={assignedArtists.length}
          collapsed={collapseCatalog}
          onToggle={() => setCollapseCatalog(v => !v)}
        />
        {!collapseCatalog && (
          assignedArtists.length === 0 ? (
            <p className="text-sm text-admin-muted px-1">Sin artistas asignados.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {assignedArtists.map(a => (
                <ArtistPhotoCard
                  key={a.userId}
                  artist={a}
                  dimmed={removing === a.userId}
                  action={
                    <button
                      onClick={() => removeArtist(a.userId)}
                      disabled={isPending || removing === a.userId}
                      className="p-1.5 rounded-full bg-zinc-900/80 backdrop-blur shadow hover:scale-110 transition-transform disabled:opacity-50"
                      title="Quitar acceso"
                    >
                      <Trash2 size={13} className="text-red-400" />
                    </button>
                  }
                />
              ))}
            </div>
          )
        )}
      </section>

      {/* ── Agregar artistas ───────────────────────────────────────────── */}
      {availableArtists.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <h2 className="font-heading text-2xl tracking-wide text-admin-foreground">Agregar al catálogo</h2>
              <span className="px-2 py-0.5 bg-primary/15 text-primary rounded-full text-xs font-semibold">
                {filteredAvailable.length}
              </span>
            </div>
            {toAdd.size > 0 && (
              <button
                onClick={addArtists}
                disabled={adding || isPending}
                className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {adding ? "Asignando..." : `Asignar ${toAdd.size} artista${toAdd.size !== 1 ? "s" : ""}`}
              </button>
            )}
          </div>

          {/* Search + filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar artista..."
                className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-admin-border bg-admin-elevated text-sm text-admin-foreground placeholder:text-admin-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <button
              onClick={() => setShowFilters(v => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 border border-admin-border rounded-lg text-sm bg-admin-elevated text-admin-foreground hover:bg-admin-border transition-colors"
            >
              <SlidersHorizontal size={13} />
              Filtros
              {activeFilterCount > 0 && (
                <span className="px-1.5 py-0.5 text-xs rounded-full bg-primary text-white font-semibold">{activeFilterCount}</span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="mb-5 p-4 bg-admin-elevated rounded-xl border border-admin-border">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-admin-foreground">Filtros avanzados</p>
                {activeFilterCount > 0 && (
                  <button onClick={() => setFilters(EMPTY_FILTERS)} className="text-xs text-admin-muted hover:text-admin-foreground flex items-center gap-1">
                    <X size={11} /> Limpiar
                  </button>
                )}
              </div>
              <div style={{
                '--background': '0 0% 8%', '--foreground': '0 0% 95%',
                '--muted': '0 0% 12%', '--muted-foreground': '0 0% 55%', '--border': '0 0% 18%',
              } as React.CSSProperties}>
                <Filters
                  categories={categories} cities={cities} styles={styles}
                  filters={filters} onFilterChange={setFilters}
                  experienceRange={experienceRange} ageRange={ageRange} heightRange={heightRange}
                  showAvailability={false}
                />
              </div>
            </div>
          )}

          {toAdd.size > 0 && (
            <p className="text-xs text-primary font-medium mb-3">
              {toAdd.size} seleccionado{toAdd.size !== 1 ? "s" : ""}
            </p>
          )}

          {filteredAvailable.length === 0 ? (
            <p className="text-sm text-admin-muted py-8 text-center">Sin resultados.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredAvailable.map(a => (
                <div
                  key={a.userId}
                  onClick={() => toggleAdd(a.userId)}
                  className={`cursor-pointer relative rounded-xl transition-all ${toAdd.has(a.userId) ? "ring-2 ring-primary" : ""}`}
                >
                  <ArtistPhotoCard
                    artist={a}
                    action={
                      toAdd.has(a.userId) ? (
                        <div className="p-1.5 rounded-full bg-primary shadow">
                          <X size={13} className="text-white" />
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-full bg-zinc-900/80 backdrop-blur shadow hover:scale-110 transition-transform">
                          <Plus size={13} className="text-primary" />
                        </div>
                      )
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
