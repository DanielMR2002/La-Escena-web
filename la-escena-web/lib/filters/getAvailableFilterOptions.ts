type Artist = {
  category?: string
  city?: string
  styles?: string[]
  experienceYears?: number
}

export function getAvailableFilterOptions(artists: Artist[]) {
  const categories = new Set<string>()
  const cities = new Set<string>()
  const styles = new Set<string>()

  let minExperience: number | null = null
  let maxExperience: number | null = null

  artists.forEach(artist => {
    if (artist.category) categories.add(artist.category)
    if (artist.city) cities.add(artist.city)

    if (Array.isArray(artist.styles)) {
      artist.styles.forEach(style => styles.add(style))
    }

    if (typeof artist.experienceYears === 'number') {
      minExperience =
        minExperience === null
          ? artist.experienceYears
          : Math.min(minExperience, artist.experienceYears)

      maxExperience =
        maxExperience === null
          ? artist.experienceYears
          : Math.max(maxExperience, artist.experienceYears)
    }
  })

  return {
    categories: Array.from(categories),
    cities: Array.from(cities),
    styles: Array.from(styles),
    experienceRange:
      minExperience !== null && maxExperience !== null
        ? { min: minExperience, max: maxExperience }
        : null
  }
}
