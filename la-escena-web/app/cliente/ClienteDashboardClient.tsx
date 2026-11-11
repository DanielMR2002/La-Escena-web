'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, CheckSquare, Square, Send, Clock, ChevronDown, ChevronUp } from 'lucide-react'
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

type Props = {
  artists: ArtistCard[]
  isPending: boolean
  approvedIds: string[]
  pendingComment: string | null
}

export default function ClienteDashboardClient({ artists, isPending, approvedIds, pendingComment }: Props) {
  const [filters, setFilters]         = useState<ArtistFiltersV2>(EMPTY_FILTERS)
  const [search, setSearch]           = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selected, setSelected]       = useState<Set<string>>(new Set())
  const [hydrated, setHydrated]         = useState(false)

  useEffect(() => {
    setSelected(new Set(approvedIds))
    setHydrated(true)
  }, [])
  const [submitting, setSubmitting]   = useState(false)
  const [submitted, setSubmitted]     = useState(false)
  const [showList, setShowList]         = useState(false)

  const hasChanges = hydrated && (
    selected.size !== approvedIds.length ||
    approvedIds.some(id => !selected.has(id))
  )

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

  function toggleArtist(id: string) {
    if (isPending) return
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function handleSubmit() {
    if (selected.size === 0) return
    setSubmitting(true)
    try {
      const selectedArtists = artists.filter(a => selected.has(a.artistId))
      const res = await fetch('/api/cliente/shortlist/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artistIds:   selectedArtists.map(a => a.artistId),
          artistNames: selectedArtists.map(a => a.name),
        }),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      alert('Error al enviar. Intenta nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-24">
        <div className="inline-flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-8 py-6">
          <Send size={24} className="text-green-500" />
          <div className="text-left">
            <p className="font-semibold text-zinc-800">Lista enviada para revisión</p>
            <p className="text-sm text-zinc-500 mt-0.5">El equipo de La Escena revisará tu selección pronto.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Banner: en revisión */}
      {isPending && (
        <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <Clock size={18} className="text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-zinc-700">Tu lista está en revisión</p>
            <p className="text-sm text-zinc-500">No puedes modificar tu selección mientras esté pendiente de aprobación.</p>
            {pendingComment && (
              <p className="text-sm text-zinc-600 mt-2 pt-2 border-t border-amber-200">
                <span className="font-medium">Comentario del equipo:</span> {pendingComment}
              </p>
            )}
          </div>
        </div>
      )}


      {/* Mi Lista — colapsable, arriba del catálogo */}
      {hydrated && (
        <div className="mb-6 border border-zinc-200 rounded-xl overflow-hidden bg-white">
          <button
            onClick={() => setShowList(v => !v)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="font-heading text-lg">Mi Lista</span>
              {isPending && (
                <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full">
                  <Clock size={11} /> En revisión
                </span>
              )}
              {!isPending && selected.size > 0 && (
                <span className="text-xs font-medium px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-full">
                  {selected.size} artista{selected.size !== 1 ? 's' : ''}
                </span>
              )}
              {!isPending && selected.size === 0 && (
                <span className="text-xs text-zinc-400">Ningún artista seleccionado</span>
              )}
            </div>
            {showList ? <ChevronUp size={18} className="text-zinc-400" /> : <ChevronDown size={18} className="text-zinc-400" />}
          </button>

          {showList && (
            <div className="border-t border-zinc-100 p-5">
              {isPending && pendingComment && (
                <p className="text-sm text-zinc-600 mb-4 pb-4 border-b border-zinc-100">
                  <span className="font-medium">Comentario del equipo:</span> {pendingComment}
                </p>
              )}
              {selected.size === 0 && !isPending ? (
                <p className="text-sm text-zinc-400 text-center py-6">Selecciona artistas del catálogo para armarla</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {artists
                    .filter(a => selected.has(a.artistId))
                    .map(artist => (
                      <div key={artist.artistId} className="bg-zinc-50 rounded-xl border border-zinc-200 overflow-hidden flex flex-col">
                        {artist.photo ? (
                          <div className="relative h-28 w-full">
                            <Image src={urlFor(artist.photo).width(320).height(180).url()} alt={artist.name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="h-28 w-full bg-zinc-100 flex items-center justify-center">
                            <span className="font-heading text-3xl text-zinc-300">{artist.name[0]?.toUpperCase()}</span>
                          </div>
                        )}
                        <div className="p-3 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-zinc-800 truncate">{artist.name}</p>
                            <p className="text-xs text-zinc-500 truncate">
                              {[formatCategoryLabel(artist.agencyProfile || artist.category, artist.esProfesor), artist.city].filter(Boolean).join(' · ') || '—'}
                            </p>
                          </div>
                          {!isPending && (
                            <button
                              onClick={() => toggleArtist(artist.artistId)}
                              className="shrink-0 p-1 text-zinc-300 hover:text-red-500 transition-colors"
                              title="Quitar de la lista"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

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
        {!isPending && hasChanges && (
          <span className="ml-2 text-primary font-medium">· {selected.size} seleccionado{selected.size !== 1 ? 's' : ''}</span>
        )}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-28">
          {filtered.map(artist => {
            const isSelected = selected.has(artist.artistId)
            return (
              <div
                key={artist.artistId}
                onClick={() => toggleArtist(artist.artistId)}
                className={`relative bg-white rounded-xl shadow-sm border-2 overflow-hidden flex flex-col transition-all ${
                  isPending
                    ? 'border-zinc-200 cursor-default'
                    : isSelected
                    ? 'border-zinc-200 cursor-pointer'
                    : 'border-zinc-200 cursor-pointer hover:border-zinc-300'
                }`}
              >
                {/* Checkbox indicador */}
                {!isPending && (
                  <div className="absolute top-3 left-3 z-10">
                    {isSelected
                      ? <CheckSquare size={22} className="text-primary drop-shadow" fill="white" />
                      : <Square size={22} className="text-white drop-shadow" />
                    }
                  </div>
                )}

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
                    <div className="mt-auto pt-4" onClick={e => e.stopPropagation()}>
                      <Link href={`/artistas/${artist.slug}?from=panel`}>
                        <span className="px-4 py-1.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-red-700 transition-colors">
                          Ver perfil
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}



      {/* Barra flotante para enviar */}
      {!isPending && hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4 bg-gradient-to-t from-zinc-100 to-transparent pointer-events-none">
          <div className="pointer-events-auto bg-white border border-zinc-200 shadow-xl rounded-2xl px-6 py-4 flex items-center gap-6">
            <div>
              <p className="font-semibold text-zinc-800 text-sm">{selected.size} artista{selected.size !== 1 ? 's' : ''} seleccionado{selected.size !== 1 ? 's' : ''}</p>
              <p className="text-xs text-zinc-400">El equipo revisará tu lista y te confirmará</p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Send size={15} />
              {submitting ? 'Enviando...' : 'Enviar lista'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
