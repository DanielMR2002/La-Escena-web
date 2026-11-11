'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Search, AlertTriangle, SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react'
import { urlFor } from '@/lib/sanity'
import { formatCategoryLabel } from '@/lib/artistCategories'
import Filters from '@/app/components/Filters'
import { applyArtistFilters } from '@/lib/filters/applyArtistFilters'
import { getAvailableFilterOptions } from '@/lib/filters/getAvailableFilterOptions'
import { ArtistFiltersV2, EMPTY_FILTERS } from '@/types/artistFilters'

type AgencyArtist = {
  id:            string
  sanityId:      string | null
  name:          string | null
  email:         string
  slug:          string | null
  photo:         any
  city:          string | null
  category:      string | null
  agencyProfile: string | null
  esProfesor:    boolean | null
  styles:        string[]
  experience:    number | null
  age:           number | null
  height:        number | null
  hashtags:      string[]
  featured:      boolean
  visible:       boolean
}

export default function AdminAgenciaPage() {
  const [artists, setArtists]                   = useState<AgencyArtist[]>([])
  const [loading, setLoading]                   = useState(true)
  const [featured, setFeatured]                 = useState<Record<string, boolean>>({})
  const [initialFeatured, setInitialFeatured]   = useState<Record<string, boolean>>({})
  const [visible, setVisible]                   = useState<Record<string, boolean>>({})
  const [initialVisible, setInitialVisible]     = useState<Record<string, boolean>>({})
  const [saving, setSaving]                     = useState(false)
  const [collapseAgency, setCollapseAgency]     = useState(false)

  // filters
  const [search, setSearch]           = useState('')
  const [filters, setFilters]         = useState<ArtistFiltersV2>(EMPTY_FILTERS)
  const [showFilters, setShowFilters] = useState(false)

  function loadArtists() {
    return fetch('/api/admin/artists/list')
      .then(r => r.json())
      .then((data: AgencyArtist[]) => {
        const withSanity = data.filter(a => a.sanityId)
        const featuredMap: Record<string, boolean> = {}
        const visibleMap:  Record<string, boolean> = {}
        for (const a of withSanity) {
          featuredMap[a.sanityId!] = a.featured
          visibleMap[a.sanityId!]  = a.visible
        }
        setArtists(withSanity)
        setFeatured(featuredMap)
        setInitialFeatured(featuredMap)
        setVisible(visibleMap)
        setInitialVisible(visibleMap)
        setLoading(false)
      })
  }

  useEffect(() => { loadArtists() }, [])

  const hasChanges =
    Object.keys(featured).some(id => featured[id] !== initialFeatured[id]) ||
    Object.keys(visible).some(id => visible[id] !== initialVisible[id])

  async function handleSave() {
    setSaving(true)
    const changedIds = new Set([
      ...Object.keys(featured).filter(id => featured[id] !== initialFeatured[id]),
      ...Object.keys(visible).filter(id => visible[id] !== initialVisible[id]),
    ])
    await Promise.all(
      Array.from(changedIds).map(sanityId => {
        const body: Record<string, unknown> = { sanityId }
        if (featured[sanityId] !== initialFeatured[sanityId]) body.featured = featured[sanityId]
        if (visible[sanityId]  !== initialVisible[sanityId])  body.visible  = visible[sanityId]
        return fetch('/api/admin/agencia/toggle-featured', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      })
    )
    await loadArtists()
    setSaving(false)
  }

  const filterOptions = useMemo(() => getAvailableFilterOptions(artists as any), [artists])
  const { categories, cities, styles, experienceRange, ageRange, heightRange } = filterOptions

  const activeFilterCount = [
    filters.category, filters.city,
    (filters.styles?.length ?? 0) > 0,
    filters.minExperience != null, filters.maxExperience != null,
    filters.minAge != null, filters.maxAge != null,
    filters.minHeight != null, filters.maxHeight != null,
    filters.hashtagSearch,
  ].filter(Boolean).length

  const filtered = useMemo(() => {
    let result = applyArtistFilters(artists as any, filters) as AgencyArtist[]
    const q = search.trim().toLowerCase()
    if (q) result = result.filter(a =>
      (a.name ?? a.email).toLowerCase().includes(q) ||
      (a.city?.toLowerCase().includes(q) ?? false)
    )
    return result
  }, [artists, filters, search])

  const inAgency = filtered.filter(a => featured[a.sanityId!])
  const toAdd    = filtered.filter(a => !featured[a.sanityId!])

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-1">
            {Object.values(featured).filter(Boolean).length} en agencia
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl tracking-wide text-admin-foreground">Agencia</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o ciudad..."
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
        <div className="mb-6 p-4 bg-admin-elevated rounded-xl border border-admin-border">
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

      {loading ? (
        <p className="text-center text-admin-muted py-16 text-sm">Cargando artistas...</p>
      ) : (
        <div className="space-y-10">

          {/* En agencia ahora — colapsable */}
          <section>
            <button
              onClick={() => setCollapseAgency(v => !v)}
              className="w-full flex items-center justify-between mb-4 px-4 py-3 rounded-xl border border-admin-border bg-admin-elevated hover:border-primary/50 hover:bg-admin-border transition-colors group"
            >
              <h2 className="font-heading text-2xl tracking-wide text-admin-foreground">
                En agencia ahora ({inAgency.length})
              </h2>
              <span className="text-admin-muted group-hover:text-admin-foreground transition-colors">
                {collapseAgency ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              </span>
            </button>

            {!collapseAgency && (
              inAgency.length === 0 ? (
                <p className="text-sm text-admin-muted px-1">Ningún artista en agencia todavía.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {inAgency.map(a => {
                    const notVisible = !visible[a.sanityId!]
                    const displayName = a.name ?? a.email
                    const label = formatCategoryLabel(a.agencyProfile || a.category, a.esProfesor)
                    return (
                      <div key={a.sanityId} className="flex flex-col gap-2">
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-admin-border bg-admin-elevated">
                          {/* X button */}
                          <button
                            onClick={() => setFeatured(prev => ({ ...prev, [a.sanityId!]: false }))}
                            className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-zinc-900/80 backdrop-blur shadow hover:scale-110 transition-transform"
                            title="Quitar de Agencia"
                          >
                            <X size={13} className="text-white" />
                          </button>
                          {/* Ver perfil */}
                          {a.slug && (
                            <Link
                              href={`/artistas/${a.slug}?from=panel`}
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
                          {notVisible && (
                            <span className="absolute bottom-14 left-2 z-20 flex items-center gap-1 text-[10px] font-medium text-amber-400 bg-amber-400/20 backdrop-blur px-1.5 py-0.5 rounded">
                              <AlertTriangle size={10} /> No visible
                            </span>
                          )}
                          {a.photo ? (
                            <Image src={urlFor(a.photo).width(280).height(373).url()} alt={displayName} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-3xl font-heading text-admin-muted">{displayName[0]?.toUpperCase()}</span>
                            </div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/50 to-transparent pt-8 pb-3 px-3">
                            <p className="font-heading text-base text-white tracking-wide truncate">{displayName}</p>
                            {label && <p className="text-[11px] text-primary truncate">{label}</p>}
                            {a.city && <p className="text-[11px] text-zinc-300 truncate">{a.city}</p>}
                          </div>
                        </div>
                        {notVisible && (
                          <button
                            onClick={() => setVisible(prev => ({ ...prev, [a.sanityId!]: true }))}
                            className="text-xs font-medium text-primary hover:underline text-center"
                          >
                            Activar visibilidad
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            )}
          </section>

          {/* Agregar artistas */}
          <section>
            <h2 className="font-heading text-2xl tracking-wide text-admin-foreground mb-4">
              Agregar artistas ({toAdd.length})
            </h2>
            {toAdd.length === 0 ? (
              <p className="text-sm text-admin-muted">No hay más artistas disponibles.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {toAdd.map(a => {
                  const displayName = a.name ?? a.email
                  const label = formatCategoryLabel(a.agencyProfile || a.category, a.esProfesor)
                  return (
                    <div key={a.sanityId} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-admin-border bg-admin-elevated">
                      <button
                        onClick={() => setFeatured(prev => ({ ...prev, [a.sanityId!]: true }))}
                        className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-zinc-900/80 backdrop-blur shadow hover:scale-110 transition-transform"
                        title="Agregar a Agencia"
                      >
                        <Plus size={13} className="text-primary" />
                      </button>
                      {a.slug && (
                        <Link
                          href={`/artistas/${a.slug}?from=panel`}
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
                      {a.photo ? (
                        <Image src={urlFor(a.photo).width(280).height(373).url()} alt={displayName} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-3xl font-heading text-admin-muted">{displayName[0]?.toUpperCase()}</span>
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/50 to-transparent pt-8 pb-3 px-3">
                        <p className="font-heading text-base text-white tracking-wide truncate">{displayName}</p>
                        {label && <p className="text-[11px] text-primary truncate">{label}</p>}
                        {a.city && <p className="text-[11px] text-zinc-300 truncate">{a.city}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
