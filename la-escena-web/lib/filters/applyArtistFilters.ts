import { ArtistFiltersV2 } from '@/types/artistFilters'

function normalizeTag(value: string) {
  return value.trim().toLowerCase().replace(/^#/, '')
}

const PHYSICAL_ATTRIBUTE_PREFIXES: Array<{ prefix: string; field: string }> = [
  { prefix: 'Complexión: ', field: 'complexion' },
  { prefix: 'Ojos: ',       field: 'eyeColor' },
  { prefix: 'Cabello: ',    field: 'hairType' },
  { prefix: 'Largo: ',      field: 'hairLength' },
  { prefix: 'Color: ',      field: 'hairColor' },
]

export function applyArtistFilters(artists: any[], filters: ArtistFiltersV2) {
  return artists.filter(artist => {

    if (filters.category && artist.agencyProfile !== filters.category) return false

    if (filters.city && artist.city !== filters.city) return false

    if (filters.styles && filters.styles.length > 0) {
      if (!filters.styles.some(s => artist.styles?.includes(s))) return false
    }

    if (typeof filters.minExperience === 'number' && (artist.experience ?? 0) < filters.minExperience) return false
    if (typeof filters.maxExperience === 'number' && (artist.experience ?? 0) > filters.maxExperience) return false

    if (typeof filters.minAge === 'number' && (artist.age ?? 0) < filters.minAge) return false
    if (typeof filters.maxAge === 'number' && (artist.age ?? Infinity) > filters.maxAge) return false

    if (typeof filters.minHeight === 'number' && (artist.height ?? 0) < filters.minHeight) return false
    if (typeof filters.maxHeight === 'number' && (artist.height ?? Infinity) > filters.maxHeight) return false

    if (filters.hashtagSearch?.trim()) {
      const term = filters.hashtagSearch.trim().toLowerCase().replace(/^#/, '')
      if (!artist.hashtags?.some((h: string) => h.toLowerCase().replace(/^#/, '').includes(term))) return false
    }

    if (filters.selectedTags && filters.selectedTags.length > 0) {
      const matchesSelection = filters.selectedTags.some(tag => {
        const known = PHYSICAL_ATTRIBUTE_PREFIXES.find(pf => tag.startsWith(pf.prefix))
        if (known) {
          const value = tag.slice(known.prefix.length)
          return normalizeTag(String(artist[known.field] ?? '')) === normalizeTag(value)
        }

        const wanted = normalizeTag(tag)
        const matchesCategory = Boolean(artist.agencyProfile) && normalizeTag(artist.agencyProfile) === wanted
        const matchesHashtag = Array.isArray(artist.hashtags) && artist.hashtags.some((h: string) => normalizeTag(h) === wanted)
        return matchesCategory || matchesHashtag
      })
      if (!matchesSelection) return false
    }

    if (filters.availableOnly && artist.isAvailable !== true) return false

    return true
  })
}
