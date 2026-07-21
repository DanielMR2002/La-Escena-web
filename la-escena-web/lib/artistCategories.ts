export const ARTIST_CATEGORIES = ["Bailarín"] as const

export function formatCategoryLabel(
  category?: string | null,
  esProfesor?: boolean | null
): string {
  if (!category) return esProfesor ? "Profesor" : ""
  return esProfesor ? `${category} · Profesor` : category
}
