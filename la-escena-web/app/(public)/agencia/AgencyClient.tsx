'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import ArtistCard from '@/app/components/ArtistCard'
import Filters, { FiltersState } from '@/app/components/Filters'
import { applyArtistFilters } from '@/lib/filters/applyArtistFilters'
import styles from './agencia.module.css'

type AgencyClientProps = {
  artists: any[]
  filterOptions: {
    categories: string[]
    cities: string[]
    styles: string[]
    experienceRange: { min: number; max: number } | null
  }
  initialFilters: {
    city: string
    category: string
  }
}

export default function AgencyClient({
  artists,
  filterOptions,
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

  const { categories, cities } = filterOptions

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
