'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, MapPin, X, Share2, Bookmark, BookmarkCheck, Copy, Check } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import { formatCategoryLabel } from '@/lib/artistCategories'
import Filters from '@/app/components/Filters'
import { applyArtistFilters } from '@/lib/filters/applyArtistFilters'
import { ArtistFiltersV2, EMPTY_FILTERS } from '@/types/artistFilters'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4 },
  }),
}

const NON_CATEGORY_DEFAULTS: Partial<ArtistFiltersV2> = {
  city:          undefined,
  availableOnly: false,
  styles:        [],
  minExperience: undefined,
  maxExperience: undefined,
  minAge:        undefined,
  maxAge:        undefined,
  minHeight:     undefined,
  maxHeight:     undefined,
  hashtagSearch: undefined,
  selectedTags:  [],
}

export default function AgencyClient({ artists, filterOptions, initialFilters }: any) {
  const { categories, cities, styles, experienceRange, ageRange, heightRange } = filterOptions

  const [filters, setFilters] = useState<ArtistFiltersV2>({
    ...EMPTY_FILTERS,
    category: initialFilters.category || undefined,
    city:     initialFilters.city     || undefined,
  })
  const [search, setSearch]                 = useState('')
  const [showFilters, setShowFilters]       = useState(false)
  const [shortlist, setShortlist]           = useState<string[]>([])
  const [showPanel, setShowPanel]           = useState(false)
  const [copied, setCopied]                 = useState(false)
  const [sharedBanner, setSharedBanner]     = useState(false)

  // Pre-populate shortlist from URL param ?s=base64(JSON.stringify(slugs))
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const s = params.get('s')
    if (!s) return
    try {
      const slugs: string[] = JSON.parse(atob(s))
      const ids = artists
        .filter((a: any) => slugs.includes(a.slug?.current))
        .map((a: any) => a._id)
      if (ids.length > 0) {
        setShortlist(ids)
        setShowPanel(true)
        setSharedBanner(true)
      }
    } catch {}
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const filteredArtists = useMemo(() => {
    let result = applyArtistFilters(artists, filters)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter((a: any) =>
        a.name?.toLowerCase().includes(q) ||
        a.city?.toLowerCase().includes(q)
      )
    }
    return result
  }, [artists, filters, search])

  const shortlistedArtists = useMemo(
    () => artists.filter((a: any) => shortlist.includes(a._id)),
    [artists, shortlist]
  )

  const allCategories = ['Todos', ...categories]

  const toggleShortlist = (id: string) =>
    setShortlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])

  const removeFromShortlist = (id: string) => {
    setShortlist(prev => {
      const next = prev.filter(i => i !== id)
      if (next.length === 0) setShowPanel(false)
      return next
    })
  }

  const activeFilterCount = [
    filters.city,
    filters.availableOnly,
    (filters.styles?.length ?? 0) > 0,
    filters.minExperience != null,
    filters.maxExperience != null,
    filters.minAge        != null,
    filters.maxAge        != null,
    filters.minHeight     != null,
    filters.maxHeight     != null,
    filters.hashtagSearch,
    (filters.selectedTags?.length ?? 0) > 0,
  ].filter(Boolean).length

  function clearFilters() {
    setFilters(f => ({ ...f, ...NON_CATEGORY_DEFAULTS }))
  }

  function shareShortlist() {
    const slugs = shortlistedArtists
      .map((a: any) => a.slug?.current)
      .filter(Boolean)
    const encoded = btoa(JSON.stringify(slugs))
    const url = `${window.location.origin}/agencia?s=${encoded}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

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

          {/* SHARED BANNER */}
          <AnimatePresence>
            {sharedBanner && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between px-5 py-3 bg-secondary/10 border border-secondary/30 rounded-md text-sm"
              >
                <span className="text-secondary font-medium">
                  Estás viendo una shortlist compartida · {shortlist.length} artista{shortlist.length !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={() => setSharedBanner(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CATEGORY TABS */}
          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilters(f => ({ ...f, category: cat === 'Todos' ? undefined : cat }))}
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
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              onClick={() => setShowFilters(v => !v)}
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
              <button
                onClick={() => setShowPanel(v => !v)}
                className="inline-flex items-center gap-2 px-5 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-semibold hover:bg-secondary/90 transition-colors"
              >
                <Bookmark size={15} />
                Mi Shortlist · {shortlist.length}
              </button>
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
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-heading text-lg tracking-wide">Filtros avanzados</h3>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                      >
                        <X size={12} /> Limpiar filtros
                      </button>
                    )}
                  </div>
                  <Filters
                    cities={cities}
                    styles={styles}
                    categories={categories}
                    hashtags={filterOptions.hashtags}
                    filters={filters}
                    onFilterChange={setFilters}
                    experienceRange={experienceRange}
                    ageRange={ageRange}
                    heightRange={heightRange}
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
                  {/* Shortlist badge on photo */}
                  {shortlist.includes(artist._id) && (
                    <div className="absolute top-3 right-3 w-7 h-7 bg-secondary rounded-full flex items-center justify-center shadow-md">
                      <BookmarkCheck size={14} className="text-secondary-foreground" />
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-heading text-xl tracking-wide">{artist.name}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin size={14} />
                    {artist.city || 'Colombia'}
                  </div>
                  {(artist.agencyProfile || artist.category) && (
                    <p className="text-xs uppercase tracking-wider text-accent">
                      {formatCategoryLabel(artist.agencyProfile || artist.category, artist.esProfesor)}
                    </p>
                  )}
                  {Array.isArray(artist.styles) && artist.styles.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {artist.styles.slice(0, 3).map((s: string) => (
                        <span key={s} className="px-2 py-0.5 text-xs bg-muted rounded-full text-muted-foreground">
                          {s}
                        </span>
                      ))}
                    </div>
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
                      title={shortlist.includes(artist._id) ? 'Quitar de shortlist' : 'Agregar a shortlist'}
                      className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm border transition-colors ${
                        shortlist.includes(artist._id)
                          ? 'bg-secondary text-secondary-foreground border-secondary'
                          : 'border-border text-muted-foreground hover:border-secondary hover:text-secondary'
                      }`}
                    >
                      {shortlist.includes(artist._id) ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* EMPTY STATE */}
          {filteredArtists.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg mb-3">No se encontraron artistas con estos filtros.</p>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-sm underline hover:text-foreground transition-colors">
                  Limpiar filtros
                </button>
              )}
            </div>
          )}

        </div>
      </section>

      {/* SHORTLIST PANEL (slide from right) */}
      <AnimatePresence>
        {showPanel && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPanel(false)}
              className="fixed inset-0 bg-foreground/40 z-40"
            />
            {/* Drawer */}
            <motion.aside
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-background border-l border-border z-50 flex flex-col shadow-2xl"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <div className="flex items-center gap-2">
                  <Bookmark size={18} className="text-secondary" />
                  <h2 className="font-heading text-lg tracking-wide">Mi Shortlist</h2>
                  <span className="text-sm text-muted-foreground">({shortlist.length})</span>
                </div>
                <button
                  onClick={() => setShowPanel(false)}
                  className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Artist list */}
              <div className="flex-1 overflow-y-auto py-4 px-4 space-y-3">
                {shortlistedArtists.map((artist: any) => (
                  <div
                    key={artist._id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border group"
                  >
                    <div className="w-14 h-14 rounded-md overflow-hidden bg-muted flex-shrink-0 relative">
                      {artist.photos?.[0] ? (
                        <Image
                          src={urlFor(artist.photos[0]).width(112).height(112).url()}
                          alt={artist.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{artist.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {formatCategoryLabel(artist.agencyProfile || artist.category, artist.esProfesor)}{artist.city ? ` · ${artist.city}` : ''}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <Link
                        href={`/artistas/${artist.slug?.current}`}
                        className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        Ver
                      </Link>
                      <button
                        onClick={() => removeFromShortlist(artist._id)}
                        className="text-xs px-2 py-1 border border-border rounded-sm text-muted-foreground hover:border-destructive hover:text-destructive transition-colors"
                      >
                        <X size={11} className="mx-auto" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Panel footer */}
              <div className="px-6 py-5 border-t border-border space-y-3">
                <button
                  onClick={shareShortlist}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-secondary text-secondary-foreground rounded-md text-sm font-semibold hover:bg-secondary/90 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check size={15} />
                      URL copiada al portapapeles
                    </>
                  ) : (
                    <>
                      <Copy size={15} />
                      Compartir shortlist
                    </>
                  )}
                </button>
                <button
                  onClick={() => { setShortlist([]); setShowPanel(false) }}
                  className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Limpiar shortlist
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
