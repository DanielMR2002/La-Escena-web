export type PhotoSlot = {
  value: string
  label: string
}

export const PHOTO_SLOTS: PhotoSlot[] = [
  { value: 'headshot', label: 'Headshot / Foto principal' },
  { value: 'perfil_derecho', label: 'Perfil derecho' },
  { value: 'perfil_izquierdo', label: 'Perfil izquierdo' },
  { value: 'cuerpo_entero', label: 'Cuerpo entero' },
  { value: 'expresion_1', label: 'Expresión facial 1' },
  { value: 'expresion_2', label: 'Expresión facial 2' },
  { value: 'expresion_3', label: 'Expresión facial 3' },
  { value: 'conceptual_1', label: 'Foto conceptual 1' },
  { value: 'conceptual_2', label: 'Foto conceptual 2' },
  { value: 'conceptual_3', label: 'Foto conceptual 3' },
]

export const REQUIRED_SLOTS = PHOTO_SLOTS.slice(0, 4)
export const EXPRESSION_SLOTS = PHOTO_SLOTS.slice(4, 7)
export const CONCEPTUAL_SLOTS = PHOTO_SLOTS.slice(7, 10)

export const PHOTO_SLOT_VALUES = PHOTO_SLOTS.map((s) => s.value)
