'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { urlFor } from '@/lib/sanity'
import { formatCategoryLabel } from '@/lib/artistCategories'
import Filters from '@/app/components/Filters'
import { applyArtistFilters } from '@/lib/filters/applyArtistFilters'
import { getAvailableFilterOptions } from '@/lib/filters/getAvailableFilterOptions'
import { ArtistFiltersV2, EMPTY_FILTERS } from '@/types/artistFilters'

export type ArtistCard = {
  artistId:     string
  name:         string
  city?:        string
  category?:    string
  agencyProfile?: string
  esProfesor?:  boolean | null
  experience?:  number
  age?:         number
  height?:      number
  styles?:      string[]
  hashtags?:    string[]
  photo?:       any
  slug?:        string
  availability?: 'disponible' | 'no disponible' | 'por confirmar'
}

const AVAILABILITY_LABEL: Record<string, string> = {
  disponible:      'Disponible',
  'no disponible': 'No disponible',
  'por confirmar': 'Por confirmar',
}

const AVAILABILITY_COLOR: Record<string, string> = {
  disponible:      'bg-green-100 text-green-700',
  'no disponible': 'bg-red-100 text-red-700',
  'por confirmar': 'bg-yellow-100 text-yellow-700',
}

export default function ClienteDashboardClient({ artists }: { artists: ArtistCard[] }) {
  const [filters, setFilters]         = useState<ArtistFiltersV2>(EMPTY_FILTERS)
  const [search, setSearch]           = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filterOptions = useMemo(() => getAvailableFilterOptions(artists), [artists])
  const { categories, cities, styles, experienceRange, ageRange, heightRange } = filterOptions

  const filtered = useMemo(() => {
    let result = applyArtistFilters(artists, filters)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter((a: any) =>
        a.name?.toLowerCase().includes(q) || a.city?.toLowerCase().includes(q)
      )
    }
    return result
  }, [artists, filters, search])

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

  return (
    <div>
      {/* Búsqueda + toggle filtros */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o ciudad..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button
          onClick={() => setShowFilters(v => !v)}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-zinc-200 rounded-lg text-sm font-medium bg-white hover:bg-zinc-50 transition-colors"
        >
          <SlidersHorizontal size={15} />
          Filtros
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.5 text-xs rounded-full bg-primary text-white font-semibold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Panel de filtros */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mb-4"
          >
            <div className="p-6 bg-white rounded-xl border border-zinc-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg tracking-wide">Filtros avanzados</h3>
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
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-sm text-zinc-500 mb-4">
        {filtered.length} artista{filtered.length !== 1 ? 's' : ''}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-24 text-zinc-400">
          <p>No se encontraron artistas con esos filtros.</p>
          {activeFilterCount > 0 && (
            <button
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="text-sm underline mt-2 hover:text-zinc-600 transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
          {filtered.map(artist => (
            <div
              key={artist.artistId}
              className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden flex flex-col"
            >
              {artist.photo ? (
                <div className="relative h-52 w-full">
                  <Image
                    src={urlFor(artist.photo).width(480).height(320).url()}
                    alt={artist.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-52 w-full bg-zinc-100 flex items-center justify-center">
                  <span className="font-heading text-5xl text-zinc-300">{artist.name[0]?.toUpperCase()}</span>
                </div>
              )}

              <div className="p-5 flex flex-col flex-1">
                <h2 className="font-heading text-xl leading-tight mb-1">{artist.name}</h2>
                <p className="text-sm text-zinc-500">
                  {[formatCategoryLabel(artist.agencyProfile || artist.category, artist.esProfesor), artist.city].filter(Boolean).join(' · ')}
                  {artist.experience != null && ` · ${artist.experience} años exp.`}
                </p>
                {artist.availability && AVAILABILITY_LABEL[artist.availability] && (
                  <span className={`mt-2 self-start text-xs font-medium px-2.5 py-1 rounded-full ${AVAILABILITY_COLOR[artist.availability]}`}>
                    {AVAILABILITY_LABEL[artist.availability]}
                  </span>
                )}
                {artist.slug && (
                  <Link href={`/artistas/${artist.slug}?from=panel`} className="mt-auto inline-block pt-4">
                    <span className="px-4 py-1.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-red-700 transition-colors">
                      Ver perfil
                    </span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
