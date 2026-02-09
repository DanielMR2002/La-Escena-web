import { ArtistFiltersV2 } from '@/types/artistFilters'

export function applyArtistFilters(
  artists: any[],
  filters: ArtistFiltersV2
) {
  return artists.filter(artist => {
    // Categoría
    if (filters.category && artist.category !== filters.category) {
      return false
    }

    // Ciudad
    if (filters.city && artist.city !== filters.city) {
      return false
    }

    // Estilos (multi-select)
    if (
      filters.styles &&
      filters.styles.length > 0 &&
      !filters.styles.some(style =>
        artist.styles?.includes(style)
      )
    ) {
      return false
    }

    // Experiencia mínima
    if (
      typeof filters.minExperience === 'number' &&
      (artist.experience ?? 0) < filters.minExperience
    ) {
      return false
    }

    // Experiencia máxima
    if (
      typeof filters.maxExperience === 'number' &&
      (artist.experience ?? 0) > filters.maxExperience
    ) {
      return false
    }

    // Disponibilidad
    if (filters.availableOnly && artist.isAvailable !== true) {
      return false
    }

    return true
  })
}
