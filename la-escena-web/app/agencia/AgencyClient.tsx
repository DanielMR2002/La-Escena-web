'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import ArtistCard from '@/components/ArtistCard'
import Filters from '@/components/Filters'
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
  /* 🔹 Estado de filtros (SIEMPRE definido) */
  const [filters, setFilters] = useState({
    category: initialFilters?.category || '',
    city: initialFilters?.city || ''
  })

  useEffect(() => {
  setFilters({
    category: initialFilters?.category || '',
    city: initialFilters?.city || ''
  })
  }, [initialFilters.category, initialFilters.city])

  const router = useRouter()
  const searchParams = useSearchParams()

  /* 🔹 Actualizar filtros + URL */
  const updateFilters = (nextFilters: {
    city: string
    category: string
  }) => {
    const params = new URLSearchParams(searchParams.toString())

    if (nextFilters.city) {
      params.set('city', nextFilters.city)
    } else {
      params.delete('city')
    }

    if (nextFilters.category) {
      params.set('category', nextFilters.category)
    } else {
      params.delete('category')
    }

    router.push(`/agencia?${params.toString()}`)
    setFilters(nextFilters)
  }

  /* 🔹 categorías únicas */
  const categories = useMemo(() => {
    return Array.from(
      new Set(artists.map(a => a.category).filter(Boolean))
    )
  }, [artists])

  /* 🔹 ciudades únicas */
  const cities = useMemo(() => {
    return Array.from(
      new Set(artists.map(a => a.city).filter(Boolean))
    )
  }, [artists])

  /* 🔹 artistas filtrados */
  const filteredArtists = artists.filter(artist => {
    if (filters.category && artist.category !== filters.category) return false
    if (filters.city && artist.city !== filters.city) return false
    return true
  })

  /* 🔹 RENDER */
  return (
    <section className={styles.container}>
      <Filters
        categories={categories}
        cities={cities}
        filters={filters}
        onFilterChange={updateFilters}
      />

      <p>
        Filtros activos: {filters.category || '—'} / {filters.city || '—'}
      </p>
      <p>Artistas visibles: {filteredArtists.length}</p>

      <motion.div
        className={styles.grid}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
      >
        {filteredArtists.map(artist => (
          <ArtistCard key={artist._id} artist={artist} />
        ))}
      </motion.div>
    </section>
  )
}
