export function getAvailableCategories(artists: any[]) {
  return Array.from(
    new Set(artists.map(a => a.category).filter(Boolean))
  )
}

export function getAvailableCities(artists: any[]) {
  return Array.from(
    new Set(artists.map(a => a.city).filter(Boolean))
  )
}

export function getAvailableStyles(artists: any[]) {
  return Array.from(
    new Set(artists.flatMap(a => a.styles || []))
  )
}
