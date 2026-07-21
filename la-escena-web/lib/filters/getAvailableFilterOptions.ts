export function getAvailableFilterOptions(artists: any[]) {
  const categories  = new Set<string>()
  const cities      = new Set<string>()
  const styles      = new Set<string>()
  const hashtags    = new Set<string>()

  let minExperience: number | null = null
  let maxExperience: number | null = null
  let minAge:        number | null = null
  let maxAge:        number | null = null
  let minHeight:     number | null = null
  let maxHeight:     number | null = null

  for (const artist of artists) {
    if (artist.agencyProfile) categories.add(artist.agencyProfile)
    if (artist.city)          cities.add(artist.city)

    if (Array.isArray(artist.styles)) {
      artist.styles.forEach((s: string) => styles.add(s))
    }

    if (Array.isArray(artist.hashtags)) {
      artist.hashtags.forEach((h: string) => hashtags.add(h))
    }

    if (artist.complexion) hashtags.add(`Complexión: ${artist.complexion}`)
    if (artist.eyeColor)   hashtags.add(`Ojos: ${artist.eyeColor}`)
    if (artist.hairType)   hashtags.add(`Cabello: ${artist.hairType}`)
    if (artist.hairLength) hashtags.add(`Largo: ${artist.hairLength}`)
    if (artist.hairColor)  hashtags.add(`Color: ${artist.hairColor}`)

    if (typeof artist.experience === 'number') {
      minExperience = minExperience === null ? artist.experience : Math.min(minExperience, artist.experience)
      maxExperience = maxExperience === null ? artist.experience : Math.max(maxExperience, artist.experience)
    }

    if (typeof artist.age === 'number') {
      minAge = minAge === null ? artist.age : Math.min(minAge, artist.age)
      maxAge = maxAge === null ? artist.age : Math.max(maxAge, artist.age)
    }

    if (typeof artist.height === 'number') {
      minHeight = minHeight === null ? artist.height : Math.min(minHeight, artist.height)
      maxHeight = maxHeight === null ? artist.height : Math.max(maxHeight, artist.height)
    }
  }

  return {
    categories:      Array.from(categories).sort(),
    cities:          Array.from(cities).sort(),
    styles:          Array.from(styles).sort(),
    hashtags:        Array.from(hashtags).sort(),
    experienceRange: minExperience !== null ? { min: minExperience, max: maxExperience! } : null,
    ageRange:        minAge        !== null ? { min: minAge,        max: maxAge!        } : null,
    heightRange:     minHeight     !== null ? { min: minHeight,     max: maxHeight!     } : null,
  }
}
