'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import ArtistCard from '@/components/ArtistCard'
import Filters, { FiltersState } from '@/components/Filters'
import { applyArtistFilters } from '@/lib/filters/applyArtistFilters'
import styles from './agencia.module.css'

type AgencyClientProps = {
  artists: any[]
  initialFilters: {
    city: string
    category: string
  }
}

export default function AgencyClient({
  artists,
  initialFilters
}: AgencyClientProps) {
  const [filters, setFilters] = useState<FiltersState>({
    category: initialFilters.category || '',
    city: initialFilters.city || '',
    availableOnly: false
  })

  const filteredArtists = useMemo(
    () => applyArtistFilters(artists, filters),
    [artists, filters]
  )

  const categories = useMemo(
    () => Array.from(new Set(artists.map(a => a.category).filter(Boolean))),
    [artists]
  )

  const cities = useMemo(
    () => Array.from(new Set(artists.map(a => a.city).filter(Boolean))),
    [artists]
  )

  return (
    <section className={styles.container}>
      <Filters
        categories={categories}
        cities={cities}
        filters={filters}
        onFilterChange={setFilters}
      />

      <p>Artistas visibles: {filteredArtists.length}</p>

      <motion.div
        className={styles.grid}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {filteredArtists.map(artist => (
          <ArtistCard key={artist._id} artist={artist} />
        ))}
      </motion.div>
    </section>
  )
}
