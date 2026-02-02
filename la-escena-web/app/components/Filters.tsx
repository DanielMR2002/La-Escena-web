'use client'

import styles from '../(public)/agencia/agencia.module.css'
import { Dispatch, SetStateAction } from 'react'

type FiltersState = {
  category: string
  city: string
}

type FiltersProps = {
  categories: string[]
  cities: string[]
  filters: {
    category: string
    city: string
  }
  onFilterChange: (filters: {
    category: string
    city: string
  }) => void
}


export default function Filters({
  categories,
  cities,
  filters,
  onFilterChange
}: FiltersProps) {

  return (
    <div className={styles.filters}>
      <select
       value={filters.category}
       onChange={e =>
        onFilterChange({
         ...filters,
         category: e.target.value
        })
       }
      >
        <option value="">Todas las categorías</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <select
       value={filters.city}
       onChange={e =>
        onFilterChange({
        ...filters,
        city: e.target.value
        })
       }
      >
        <option value="">Todas las ciudades</option>
        {cities.map(city => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>
  )
}

