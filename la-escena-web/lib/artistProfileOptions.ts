export const COMPLEXION_OPTIONS = ["Delgada", "Atlética", "Media", "Robusta", "Plus size"] as const

export const EYE_COLOR_OPTIONS = ["Negro", "Café oscuro", "Café claro", "Miel", "Verde", "Azul", "Gris"] as const

export const HAIR_TYPE_OPTIONS = ["Liso", "Ondulado", "Crespo", "Afro"] as const

export const HAIR_LENGTH_OPTIONS = ["Rapado", "Muy corto", "Corto", "Medio", "Largo"] as const

export const HAIR_COLOR_OPTIONS = ["Negro", "Castaño oscuro", "Castaño claro", "Rubio", "Pelirrojo", "Fantasía / color creativo"] as const

export const SKILL_OPTIONS = [
  "Actuación",
  "Acrobacia",
  "Modelaje",
  "Canto",
  "Presentación / oratoria",
  "Freestyle (rap)",
  "Actuación para cámara",
] as const

export const TIPOS_CLASE_OPTIONS = ["Clases personalizadas", "Clases grupales"] as const

export const STYLE_OPTIONS = [
  "Dancehall",
  "Hip Hop",
  "Heels",
  "Salsa",
  "Bachata",
  "Contemporáneo",
  "Afro",
  "Jazz Funk",
  "Commercial",
  "Reggaetón",
] as const

export const AGENCY_PROFILE_OPTIONS = [
  "Bailarín comercial",
  "Artista urbano",
  "Artista latino",
  "Bailarín de freestyle",
  "Performer",
  "Coreógrafo",
  "Director creativo",
  "Artista integral / versátil",
  "Modelo",
] as const

export const TIPO_PERFIL_OPTIONS = [
  { value: "bailarin", label: "Bailarín/a" },
  { value: "coreografo", label: "Coreógrafo/a" },
  { value: "director", label: "Director/a artístico/a" },
  { value: "modelo", label: "Modelo" },
  { value: "actor", label: "Actor / Actriz" },
  { value: "creador-contenido", label: "Creador de contenido" },
] as const

// Estilos de danza agrupados por categoría
export type DanceStyleGroup = {
  category: string
  styles: { value: string; label: string }[]
}

export const DANCE_STYLE_GROUPS: DanceStyleGroup[] = [
  {
    category: 'Urbanos',
    styles: [
      { value: 'hip-hop',     label: 'Hip Hop' },
      { value: 'house',       label: 'House' },
      { value: 'locking',     label: 'Locking' },
      { value: 'popping',     label: 'Popping' },
      { value: 'breaking',    label: 'Breaking / Breakdance' },
      { value: 'waacking',    label: 'Waacking' },
      { value: 'voguing',     label: 'Voguing' },
      { value: 'krump',       label: 'Krump' },
      { value: 'dancehall',   label: 'Dancehall' },
      { value: 'afro',        label: 'Afro' },
      { value: 'reggaeton',   label: 'Reggaetón' },
      { value: 'heels',       label: 'Heels' },
      { value: 'commercial',  label: 'Commercial' },
      { value: 'street-jazz', label: 'Street Jazz' },
    ],
  },
  {
    category: 'Latinos',
    styles: [
      { value: 'salsa',         label: 'Salsa' },
      { value: 'bachata',       label: 'Bachata' },
      { value: 'merengue',      label: 'Merengue' },
      { value: 'cumbia',        label: 'Cumbia' },
      { value: 'champeta',      label: 'Champeta' },
      { value: 'reggaeton-l',   label: 'Reggaetón' },
      { value: 'salsa-urbana',  label: 'Salsa Urbana' },
      { value: 'mambo',         label: 'Mambo' },
      { value: 'kizomba',       label: 'Kizomba' },
      { value: 'zouk',          label: 'Zouk' },
    ],
  },
  {
    category: 'Danzas tradicionales y folclóricas',
    styles: [
      { value: 'folclor-colombiano', label: 'Folclor colombiano' },
      { value: 'cumbia-folk',        label: 'Cumbia' },
      { value: 'joropo',             label: 'Joropo' },
      { value: 'mapale',             label: 'Mapalé' },
      { value: 'bullerengue',        label: 'Bullerengue' },
      { value: 'porro',              label: 'Porro' },
      { value: 'currulao',           label: 'Currulao' },
      { value: 'tango',              label: 'Tango' },
      { value: 'flamenco',           label: 'Flamenco' },
      { value: 'danzas-espanolas',   label: 'Danzas españolas' },
    ],
  },
  {
    category: 'Académicos / Escénicos',
    styles: [
      { value: 'ballet',             label: 'Ballet' },
      { value: 'jazz',               label: 'Jazz' },
      { value: 'jazz-funk',          label: 'Jazz Funk' },
      { value: 'contemporaneo',      label: 'Contemporáneo' },
      { value: 'danza-moderna',      label: 'Danza Moderna' },
      { value: 'lyrical',            label: 'Lyrical' },
      { value: 'danza-teatro',       label: 'Danza Teatro' },
      { value: 'expresion-corporal', label: 'Expresión corporal' },
      { value: 'musical-theatre',    label: 'Musical Theatre' },
    ],
  },
  {
    category: 'Parejas / Sociales',
    styles: [
      { value: 'salsa-soc',    label: 'Salsa' },
      { value: 'bachata-soc',  label: 'Bachata' },
      { value: 'kizomba-soc',  label: 'Kizomba' },
      { value: 'zouk-soc',     label: 'Zouk' },
      { value: 'tango-soc',    label: 'Tango' },
      { value: 'merengue-soc', label: 'Merengue' },
    ],
  },
  {
    category: 'Otros',
    styles: [
      { value: 'fusion',        label: 'Fusión' },
      { value: 'improvisacion', label: 'Improvisación' },
      { value: 'freestyle',     label: 'Freestyle' },
      { value: 'coreografia',   label: 'Coreografía' },
      { value: 'danza-aerea',   label: 'Danza aérea' },
      { value: 'acrobacia',     label: 'Acrobacia' },
      { value: 'pole-dance',    label: 'Pole Dance' },
    ],
  },
]

// Versión plana para compatibilidad con código existente
export const DANCE_STYLE_OPTIONS = DANCE_STYLE_GROUPS.flatMap(g => g.styles)
