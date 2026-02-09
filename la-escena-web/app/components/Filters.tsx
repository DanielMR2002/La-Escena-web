'use client'

import styles from '../(public)/agencia/agencia.module.css'

export type FiltersState = {
  category: string
  city: string
  availableOnly: boolean
  minExperience?: number
  maxExperience?: number
}

type FiltersProps = {
  categories: string[]
  cities: string[]
  filters: FiltersState
  onFilterChange: (filters: FiltersState) => void
}

export default function Filters({
  categories,
  cities,
  filters,
  onFilterChange
}: FiltersProps) {
  return (
    <div className={styles.filters}>
      {/* Categoría */}
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

      {/* Ciudad */}
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

      {/* Disponibilidad */}
      <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input
          type="checkbox"
          checked={filters.availableOnly}
          onChange={e =>
            onFilterChange({
              ...filters,
              availableOnly: e.target.checked
            })
          }
        />
        Solo disponibles
      </label>

      {/* Experiencia mínima */}
      <input
        type="number"
        min={0}
        placeholder="Experiencia mínima (años)"
        value={filters.minExperience ?? ''}
        onChange={e =>
          onFilterChange({
            ...filters,
            minExperience: e.target.value
              ? Math.max(0, Number(e.target.value))
              : undefined
          })
        }
      />

      {/* Experiencia máxima */}
      <input
        type="number"
        min={0}
        placeholder="Experiencia máxima (años)"
        value={filters.maxExperience ?? ''}
        onChange={e =>
          onFilterChange({
            ...filters,
            maxExperience: e.target.value
              ? Math.max(0, Number(e.target.value))
              : undefined
          })
        }
      />
    </div>
  )
}
