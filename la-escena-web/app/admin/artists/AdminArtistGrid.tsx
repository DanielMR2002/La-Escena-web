'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { urlFor } from '@/lib/sanity'
import { formatCategoryLabel } from '@/lib/artistCategories'
import Filters from '@/app/components/Filters'
import { applyArtistFilters } from '@/lib/filters/applyArtistFilters'
import { getAvailableFilterOptions } from '@/lib/filters/getAvailableFilterOptions'
import { ArtistFiltersV2, EMPTY_FILTERS } from '@/types/artistFilters'
import type { ArtistItem } from '@/app/admin/clients/ArtistCatalog'

export default function AdminArtistGrid({ artists }: { artists: ArtistItem[] }) {
  const router = useRouter()
  const [filters, setFilters]         = useState<ArtistFiltersV2>(EMPTY_FILTERS)
  const [search, setSearch]           = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filterOptions = useMemo(() => getAvailableFilterOptions(artists), [artists])
  const { categories, cities, styles, experienceRange, ageRange, heightRange } = filterOptions

  const activeFilterCount = [
    filters.category,
    filters.city,
    (filters.styles?.length ?? 0) > 0,
    filters.minExperience != null,
    filters.maxExperience != null,
    filters.minAge        != null,
    filters.maxAge        != null,
    filters.minHeight     != null,
    filters.maxHeight     != null,
    filters.hashtagSearch,
  ].filter(Boolean).length

  const filtered = useMemo(() => {
    let result = applyArtistFilters(artists, filters)
    const q = search.trim().toLowerCase()
    if (q) {
      result = result.filter((a: any) =>
        a.name?.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.city?.toLowerCase().includes(q)
      )
    }
    return result
  }, [artists, filters, search])

  return (
    <div>
      {/* Search + filter toggle */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o ciudad..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button
          onClick={() => setShowFilters(v => !v)}
          className="inline-flex items-center gap-1.5 px-3 py-2.5 border border-zinc-200 rounded-lg text-sm bg-white hover:bg-zinc-50 transition-colors font-medium"
        >
          <SlidersHorizontal size={14} />
          Filtros
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.5 text-xs rounded-full bg-primary text-white font-semibold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="mb-4 p-5 bg-white rounded-xl border border-zinc-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-zinc-700">Filtros avanzados</p>
            {activeFilterCount > 0 && (
              <button
                onClick={() => setFilters(EMPTY_FILTERS)}
                className="text-xs text-zinc-400 hover:text-zinc-700 flex items-center gap-1 transition-colors"
              >
                <X size={12} /> Limpiar
              </button>
            )}
          </div>
          <Filters
            categories={categories}
            cities={cities}
            styles={styles}
            filters={filters}
            onFilterChange={setFilters}
            experienceRange={experienceRange}
            ageRange={ageRange}
            heightRange={heightRange}
            showAvailability={false}
          />
        </div>
      )}

      <p className="text-xs text-zinc-400 mb-4">
        {artists.length === 0
          ? 'Cargando artistas...'
          : `${filtered.length} artista${filtered.length !== 1 ? 's' : ''}`}
      </p>

      {artists.length > 0 && filtered.length === 0 ? (
        <div className="py-16 text-center text-zinc-400 text-sm">
          No se encontraron artistas con esos filtros.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(artist => {
            const displayName = artist.name ?? artist.email

            return (
              <div
                key={artist.id}
                className="flex flex-col cursor-pointer group"
                onClick={() => router.push(`/admin/artists/${artist.id}`)}
              >
                {/* Photo */}
                <div className={`relative aspect-[4/5] rounded-xl overflow-hidden ${
                  artist.status === "PENDING" ? "ring-2 ring-amber-400" : ""
                }`}>
                  {artist.status === "PENDING" && (
                    <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-400 text-amber-950 shadow">
                      Pendiente
                    </span>
                  )}
                  {artist.photo ? (
                    <Image
                      src={urlFor(artist.photo).width(320).height(400).url()}
                      alt={displayName}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
                      <span className="text-4xl font-heading text-zinc-300">
                        {displayName[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 bg-white text-zinc-900 text-xs font-semibold rounded-lg shadow">
                      Ver perfil
                    </span>
                  </div>
                </div>

                {/* Name + metadata */}
                <div className="mt-2 px-0.5">
                  <p className="text-sm font-medium text-zinc-900 truncate">{displayName}</p>
                  {(artist.category || artist.city) && (
                    <p className="text-xs text-zinc-400 mt-0.5 truncate">
                      {[formatCategoryLabel(artist.agencyProfile || artist.category, artist.esProfesor), artist.city].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
