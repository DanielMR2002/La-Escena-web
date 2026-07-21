export type ArtistFiltersV2 = {
  category?: string
  city?: string
  availableOnly?: boolean
  styles?: string[]
  minExperience?: number
  maxExperience?: number
  minAge?: number
  maxAge?: number
  minHeight?: number
  maxHeight?: number
  hashtagSearch?: string
  selectedTags?: string[]
}

export const EMPTY_FILTERS: ArtistFiltersV2 = {
  category:     undefined,
  city:         undefined,
  availableOnly: false,
  styles:       [],
  minExperience: undefined,
  maxExperience: undefined,
  minAge:        undefined,
  maxAge:        undefined,
  minHeight:     undefined,
  maxHeight:     undefined,
  hashtagSearch: undefined,
  selectedTags: [],
}
