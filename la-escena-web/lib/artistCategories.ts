export const ARTIST_CATEGORIES = ["Bailarín"] as const

export function formatCategoryLabel(
  category?: string | string[] | null,
  esProfesor?: boolean | null
): string {
  const label = Array.isArray(category)
    ? category.filter(Boolean).join(' · ')
    : (category ?? '')
  if (!label) return esProfesor ? 'Profesor' : ''
  return esProfesor ? `${label} · Profesor` : label
}
