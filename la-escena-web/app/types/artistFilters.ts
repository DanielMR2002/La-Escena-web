export type ArtistFiltersV2 = {
  category?: string
  city?: string

  styles?: string[]
  minExperience?: number
  maxExperience?: number

  availableOnly?: boolean
}
