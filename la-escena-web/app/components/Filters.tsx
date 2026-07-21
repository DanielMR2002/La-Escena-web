'use client'

import { ArtistFiltersV2 } from '@/types/artistFilters'

type Range = { min: number; max: number } | null

type FiltersProps = {
  cities:           string[]
  styles:           string[]
  filters:          ArtistFiltersV2
  onFilterChange:   (filters: ArtistFiltersV2) => void
  experienceRange:  Range
  ageRange:         Range
  heightRange:      Range
  categories?:      string[]
  hashtags?:        string[]
  showAvailability?: boolean
}

function RangeInputs({
  label,
  unit,
  minKey,
  maxKey,
  range,
  filters,
  onChange,
}: {
  label:    string
  unit:     string
  minKey:   keyof ArtistFiltersV2
  maxKey:   keyof ArtistFiltersV2
  range:    Range
  filters:  ArtistFiltersV2
  onChange: (f: ArtistFiltersV2) => void
}) {
  if (!range) return null
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
        {label} <span className="normal-case">({unit})</span>
      </p>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={range.min}
          max={range.max}
          placeholder="Desde"
          value={(filters[minKey] as number | undefined) ?? ''}
          onChange={e => onChange({ ...filters, [minKey]: e.target.value ? Number(e.target.value) : undefined })}
          className="w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <span className="text-muted-foreground text-sm shrink-0">–</span>
        <input
          type="number"
          min={range.min}
          max={range.max}
          placeholder="Hasta"
          value={(filters[maxKey] as number | undefined) ?? ''}
          onChange={e => onChange({ ...filters, [maxKey]: e.target.value ? Number(e.target.value) : undefined })}
          className="w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </div>
  )
}

export default function Filters({
  cities,
  styles,
  filters,
  onFilterChange,
  experienceRange,
  ageRange,
  heightRange,
  categories,
  hashtags,
  showAvailability = true,
}: FiltersProps) {

  const showTagChips = hashtags !== undefined
  const tagOptions = showTagChips
    ? Array.from(new Set([...(categories ?? []), ...(hashtags ?? [])])).sort()
    : []
  const selectedTags = filters.selectedTags ?? []

  function toggle(field: keyof ArtistFiltersV2, value: string) {
    const current = (filters[field] as string[] | undefined) ?? []
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    onFilterChange({ ...filters, [field]: next })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

      {/* CATEGORÍA — opcional, oculta cuando ya se muestran los chips combinados */}
      {!showTagChips && categories && categories.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Categoría</p>
          <select
            value={filters.category ?? ''}
            onChange={e => onFilterChange({ ...filters, category: e.target.value || undefined })}
            className="w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todas las categorías</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      )}

      {/* CIUDAD */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Ciudad</p>
        <select
          value={filters.city ?? ''}
          onChange={e => onFilterChange({ ...filters, city: e.target.value || undefined })}
          className="w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Todas las ciudades</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* DISPONIBILIDAD — opcional */}
      {showAvailability && (
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.availableOnly ?? false}
              onChange={e => onFilterChange({ ...filters, availableOnly: e.target.checked })}
              className="w-4 h-4 accent-primary"
            />
            Solo disponibles
          </label>
        </div>
      )}

      {/* EXPERIENCIA */}
      <RangeInputs
        label="Experiencia" unit="años"
        minKey="minExperience" maxKey="maxExperience"
        range={experienceRange} filters={filters} onChange={onFilterChange}
      />

      {/* EDAD */}
      <RangeInputs
        label="Edad" unit="años"
        minKey="minAge" maxKey="maxAge"
        range={ageRange} filters={filters} onChange={onFilterChange}
      />

      {/* ESTATURA */}
      <RangeInputs
        label="Estatura" unit="cm"
        minKey="minHeight" maxKey="maxHeight"
        range={heightRange} filters={filters} onChange={onFilterChange}
      />

      {/* ESTILOS — chips multi-select */}
      {styles.length > 0 && (
        <div className="md:col-span-2 xl:col-span-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Estilos</p>
          <div className="flex flex-wrap gap-2">
            {styles.map(style => {
              const active = filters.styles?.includes(style)
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => toggle('styles', style)}
                  className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                  }`}
                >
                  {style}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* HASHTAGS / CATEGORÍAS */}
      <div className="md:col-span-2 xl:col-span-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
          {showTagChips ? 'Hashtags / Categorías' : 'Hashtags'}
        </p>
        <input
          type="text"
          placeholder="#rubios, #acrobacias..."
          value={filters.hashtagSearch ?? ''}
          onChange={e => onFilterChange({ ...filters, hashtagSearch: e.target.value || undefined })}
          className="w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Escribe un término para filtrar por etiquetas del artista.
        </p>

        {showTagChips && (
          <>
            {selectedTags.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Seleccionados
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map(tag => (
                    <button
                      key={`selected-${tag}`}
                      type="button"
                      onClick={() => toggle('selectedTags', tag)}
                      className="px-3 py-1 text-xs font-medium rounded-full border bg-primary text-primary-foreground border-primary transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {tagOptions.map(tag => {
                const active = selectedTags.includes(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggle('selectedTags', tag)}
                    className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                      active
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>

    </div>
  )
}
