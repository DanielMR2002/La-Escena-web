'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, MapPin, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import Filters, { FiltersState } from '@/app/components/Filters'
import { applyArtistFilters } from '@/lib/filters/applyArtistFilters'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4 },
  }),
}

export default function AgencyClient({ artists, filterOptions, initialFilters }: any) {

  const [filters, setFilters] = useState<FiltersState>({
    category: initialFilters.category || '',
    city: initialFilters.city || '',
    availableOnly: false,
  })
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [shortlist, setShortlist] = useState<string[]>([])

  const filteredArtists = useMemo(() => {
    let result = applyArtistFilters(artists, filters)
    if (search) {
      result = result.filter((a: any) =>
        a.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.city?.toLowerCase().includes(search.toLowerCase())
      )
    }
    return result
  }, [artists, filters, search])

  const { categories, cities } = filterOptions
  const allCategories = ['Todos', ...categories]

  const toggleShortlist = (id: string) => {
    setShortlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const activeFilterCount = [
    filters.city,
    filters.availableOnly,
    filters.minExperience != null,
    filters.maxExperience != null,
  ].filter(Boolean).length

  return (
    <>
      {/* HEADER */}
      <section className="bg-foreground py-20">
        <div className="container text-center space-y-4">
          <h1 className="font-heading text-5xl sm:text-7xl tracking-wide text-primary-foreground">
            Nuestro <span className="text-secondary">Talento</span>
          </h1>
          <p className="text-primary-foreground/60 max-w-lg mx-auto">
            Explora el catálogo y filtra por estilo, ciudad, experiencia y más. Arma tu shortlist en minutos.
          </p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container space-y-8">

          {/* CATEGORY TABS */}
          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilters(f => ({ ...f, category: cat === 'Todos' ? '' : cat }))}
                className={`px-5 py-2 text-sm font-medium uppercase tracking-wide rounded-sm transition-colors ${
                  (cat === 'Todos' && !filters.category) || filters.category === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* SEARCH + FILTER TOGGLE */}
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nombre o ciudad..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-5 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors"
            >
              <SlidersHorizontal size={16} />
              Filtros
              {activeFilterCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground font-semibold">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {shortlist.length > 0 && (
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-semibold">
                Shortlist: {shortlist.length}
              </div>
            )}
          </div>

          {/* FILTER PANEL */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="p-6 bg-card rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading text-lg tracking-wide">Filtros avanzados</h3>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={() => setFilters(f => ({ ...f, city: '', availableOnly: false, minExperience: undefined, maxExperience: undefined }))}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                      >
                        <X size={12} /> Limpiar
                      </button>
                    )}
                  </div>
                  <Filters
                    categories={categories}
                    cities={cities}
                    filters={filters}
                    onFilterChange={setFilters}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* RESULTS COUNT */}
          <p className="text-sm text-muted-foreground">
            {filteredArtists.length} artista{filteredArtists.length !== 1 ? 's' : ''} encontrado{filteredArtists.length !== 1 ? 's' : ''}
          </p>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtists.map((artist: any, i: number) => (
              <motion.div
                key={artist._id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[4/5] bg-muted relative overflow-hidden">
                  {artist.photos?.[0] ? (
                    <Image
                      src={urlFor(artist.photos[0]).width(500).height(600).url()}
                      alt={artist.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-sm">
                      Sin imagen
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-heading text-xl tracking-wide">{artist.name}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin size={14} />
                    {artist.city || 'Colombia'}
                  </div>
                  {artist.category && (
                    <p className="text-xs uppercase tracking-wider text-accent">{artist.category}</p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Link
                      href={`/artistas/${artist.slug?.current}`}
                      className="flex-1 py-2 text-center text-xs font-semibold uppercase tracking-wider bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors"
                    >
                      Ver Perfil
                    </Link>
                    <button
                      onClick={() => toggleShortlist(artist._id)}
                      className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm border transition-colors ${
                        shortlist.includes(artist._id)
                          ? 'bg-secondary text-secondary-foreground border-secondary'
                          : 'border-border text-muted-foreground hover:border-accent'
                      }`}
                    >
                      {shortlist.includes(artist._id) ? '✓' : '+'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* EMPTY STATE */}
          {filteredArtists.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">No se encontraron artistas con estos filtros.</p>
            </div>
          )}

        </div>
      </section>
    </>
  )
}
