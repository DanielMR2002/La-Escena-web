'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, MapPin, X } from 'lucide-react'
import { urlFor } from '@/lib/sanity'
import { formatCategoryLabel } from '@/lib/artistCategories'
import { getAvailableFilterOptions } from '@/lib/filters/getAvailableFilterOptions'
import type { ArtistItem } from '@/app/admin/clients/ArtistCatalog'

type AvailabilityFilter = 'all' | 'available' | 'unavailable'

const selectClass =
  'px-3 py-2.5 rounded-lg border border-admin-border bg-admin-elevated text-sm text-admin-foreground focus:outline-none focus:ring-2 focus:ring-primary/30'

export default function AdminArtistGrid({ artists }: { artists: ArtistItem[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('')
  const [category, setCategory] = useState('')
  const [availability, setAvailability] = useState<AvailabilityFilter>('all')

  const { categories, cities } = useMemo(() => getAvailableFilterOptions(artists), [artists])

  const activeFilterCount = [city, category, availability !== 'all'].filter(Boolean).length

  const filtered = useMemo(() => {
    let result = artists

    if (city) result = result.filter(a => a.city === city)
    if (category) result = result.filter(a => a.agencyProfile === category)
    if (availability === 'available') result = result.filter(a => a.artistAvailability === true)
    if (availability === 'unavailable') result = result.filter(a => a.artistAvailability === false)

    const q = search.trim().toLowerCase()
    if (q) {
      result = result.filter((a: any) =>
        a.name?.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.city?.toLowerCase().includes(q)
      )
    }
    return result
  }, [artists, search, city, category, availability])

  function clearFilters() {
    setCity('')
    setCategory('')
    setAvailability('all')
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
          <input
            type="text"
            placeholder="Buscar por nombre o ciudad..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-admin-border bg-admin-elevated text-sm text-admin-foreground placeholder:text-admin-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <select value={city} onChange={e => setCity(e.target.value)} className={selectClass}>
          <option value="">Todas las ciudades</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={category} onChange={e => setCategory(e.target.value)} className={selectClass}>
          <option value="">Todas las categorías</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          value={availability}
          onChange={e => setAvailability(e.target.value as AvailabilityFilter)}
          className={selectClass}
        >
          <option value="all">Toda disponibilidad</option>
          <option value="available">Disponible</option>
          <option value="unavailable">No disponible</option>
        </select>
      </div>

      {/* Result count */}
      <div className="flex items-center gap-3 mb-5">
        <p className="text-xs text-admin-muted uppercase tracking-wide">
          {artists.length === 0
            ? 'Cargando artistas...'
            : `${filtered.length} resultado${filtered.length !== 1 ? 's' : ''}`}
        </p>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary/15 text-primary hover:bg-primary/25 transition-colors"
          >
            Filtros activos ({activeFilterCount})
            <X size={11} />
          </button>
        )}
      </div>

      {artists.length > 0 && filtered.length === 0 ? (
        <div className="py-16 text-center text-admin-muted text-sm">
          No se encontraron artistas con esos filtros.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(artist => {
            const displayName = artist.name ?? artist.email
            const categoryLabel = formatCategoryLabel(artist.agencyProfile || artist.category, artist.esProfesor)

            return (
              <div
                key={artist.id}
                className="flex flex-col cursor-pointer group"
                onClick={() => router.push(`/admin/artists/${artist.id}`)}
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-admin-elevated border border-admin-border">
                  {artist.status === 'PENDING' && (
                    <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-400 text-amber-950 shadow">
                      Pendiente
                    </span>
                  )}

                  {artist.artistAvailability != null && (
                    <span
                      className={`absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full text-[10px] font-semibold shadow ${
                        artist.artistAvailability
                          ? 'bg-emerald-500 text-emerald-950'
                          : 'bg-red-500 text-red-950'
                      }`}
                    >
                      {artist.artistAvailability ? 'Disponible' : 'No disponible'}
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
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl font-heading text-admin-muted">
                        {displayName[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Gradient overlay + info */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent pt-10 pb-3 px-3">
                    <p className="font-heading text-xl text-white tracking-wide truncate">{displayName}</p>
                    {categoryLabel && (
                      <p className="text-xs text-primary font-medium truncate">{categoryLabel}</p>
                    )}
                    {artist.city && (
                      <p className="flex items-center gap-1 text-xs text-zinc-300 mt-0.5 truncate">
                        <MapPin size={11} className="shrink-0" />
                        {artist.city}
                      </p>
                    )}
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg shadow">
                      Gestionar
                    </span>
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
