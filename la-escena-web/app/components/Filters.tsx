'use client'

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
    <div className="flex flex-col gap-6">

      {/* FILAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* CATEGORÍA */}
        <select
          value={filters.category}
          onChange={e =>
            onFilterChange({
              ...filters,
              category: e.target.value
            })
          }
          className="px-4 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* CIUDAD */}
        <select
          value={filters.city}
          onChange={e =>
            onFilterChange({
              ...filters,
              city: e.target.value
            })
          }
          className="px-4 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Todas las ciudades</option>
          {cities.map(city => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        {/* EXPERIENCIA MIN */}
        <input
          type="number"
          min={0}
          placeholder="Exp. mínima"
          value={filters.minExperience ?? ''}
          onChange={e =>
            onFilterChange({
              ...filters,
              minExperience: e.target.value
                ? Math.max(0, Number(e.target.value))
                : undefined
            })
          }
          className="px-4 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* EXPERIENCIA MAX */}
        <input
          type="number"
          min={0}
          placeholder="Exp. máxima"
          value={filters.maxExperience ?? ''}
          onChange={e =>
            onFilterChange({
              ...filters,
              maxExperience: e.target.value
                ? Math.max(0, Number(e.target.value))
                : undefined
            })
          }
          className="px-4 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* CHECKBOX */}
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={filters.availableOnly}
          onChange={e =>
            onFilterChange({
              ...filters,
              availableOnly: e.target.checked
            })
          }
          className="w-4 h-4"
        />
        Solo disponibles
      </label>

    </div>
  )
}