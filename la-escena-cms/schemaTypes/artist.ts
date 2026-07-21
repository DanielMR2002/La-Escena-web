import { defineType, defineField } from 'sanity'

export const artist = defineType({
  name: 'artist',
  title: 'Artista',
  type: 'document',

  groups: [
    { name: 'identity', title: 'Identidad' },
    { name: 'profile', title: 'Perfil artístico' },
    { name: 'physicalAttributes', title: 'Características físicas' },
    { name: 'filters', title: 'Filtros / Búsqueda' },
    { name: 'admin', title: 'Control administrativo' }
  ],

  fields: [
    /* ─────────────────────────────
       IDENTIDAD
    ───────────────────────────── */

    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      group: 'identity',
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'identity',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'photos',
      title: 'Fotos',
      type: 'array',
      group: 'identity',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'photoCategory',
              title: 'Categoría de foto',
              type: 'string',
              options: {
                list: [
                  { title: 'Headshot / Foto principal', value: 'headshot' },
                  { title: 'Perfil derecho', value: 'perfil_derecho' },
                  { title: 'Perfil izquierdo', value: 'perfil_izquierdo' },
                  { title: 'Cuerpo entero', value: 'cuerpo_entero' },
                  { title: 'Expresión facial 1', value: 'expresion_1' },
                  { title: 'Expresión facial 2', value: 'expresion_2' },
                  { title: 'Expresión facial 3', value: 'expresion_3' },
                  { title: 'Foto conceptual 1', value: 'conceptual_1' },
                  { title: 'Foto conceptual 2', value: 'conceptual_2' },
                  { title: 'Foto conceptual 3', value: 'conceptual_3' },
                ]
              }
            })
          ]
        }
      ],
      validation: Rule => Rule.max(10)
    }),

    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      group: 'identity',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'url',   title: 'URL (YouTube / Vimeo)', type: 'url' }),
            defineField({ name: 'title', title: 'Título',                type: 'string' })
          ]
        }
      ],
      validation: Rule => Rule.max(4)
    }),

    defineField({
      name: 'pendingPhotos',
      title: 'Fotos pendientes de aprobación',
      type: 'array',
      group: 'identity',
      description: 'Fotos subidas por el artista, esperando revisión del admin. Al aprobar se mueven a "Fotos".',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'photoCategory',
              title: 'Categoría de foto',
              type: 'string',
              options: {
                list: [
                  { title: 'Headshot / Foto principal', value: 'headshot' },
                  { title: 'Perfil derecho', value: 'perfil_derecho' },
                  { title: 'Perfil izquierdo', value: 'perfil_izquierdo' },
                  { title: 'Cuerpo entero', value: 'cuerpo_entero' },
                  { title: 'Expresión facial 1', value: 'expresion_1' },
                  { title: 'Expresión facial 2', value: 'expresion_2' },
                  { title: 'Expresión facial 3', value: 'expresion_3' },
                  { title: 'Foto conceptual 1', value: 'conceptual_1' },
                  { title: 'Foto conceptual 2', value: 'conceptual_2' },
                  { title: 'Foto conceptual 3', value: 'conceptual_3' },
                ]
              }
            })
          ]
        }
      ]
    }),

    defineField({
      name: 'pendingVideos',
      title: 'Videos pendientes de aprobación',
      type: 'array',
      group: 'identity',
      description: 'Videos agregados por el artista, esperando revisión del admin. Al aprobar se mueven a "Videos".',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'url',   title: 'URL (YouTube / Vimeo)', type: 'url' }),
            defineField({ name: 'title', title: 'Título',                type: 'string' })
          ]
        }
      ]
    }),

    /* ─────────────────────────────
       PERFIL ARTÍSTICO
    ───────────────────────────── */

    defineField({
      name: 'category',
      title: 'Categoría principal',
      type: 'string',
      group: 'profile',
      options: {
        list: [
          { title: 'Bailarín', value: 'Bailarín' }
        ],
        layout: 'radio'
      },
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'styles',
      title: 'Estilos',
      type: 'array',
      group: 'profile',
      of: [{ type: 'string' }]
    }),

    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      group: 'profile'
    }),

    defineField({
      name: 'trayectoria',
      title: 'Trayectoria',
      type: 'array',
      group: 'profile',
      of: [{
        type: 'object',
        name: 'entrada',
        title: 'Entrada',
        fields: [
          defineField({ name: 'proyecto', title: 'Proyecto', type: 'string' }),
          defineField({ name: 'cliente',  title: 'Cliente',  type: 'string' }),
          defineField({ name: 'anio',     title: 'Año',      type: 'number' }),
        ]
      }]
    }),

    defineField({
      name: 'experience',
      title: 'Años de experiencia',
      type: 'number',
      group: 'profile',
      validation: Rule => Rule.min(0)
    }),

    defineField({
      name: 'projectTypes',
      title: '¿En qué tipo de proyectos has trabajado?',
      type: 'string',
      group: 'profile',
    }),

    defineField({
      name: 'experienceDescription',
      title: '¿Qué experiencia tienes?',
      type: 'text',
      group: 'profile',
    }),

    defineField({
      name: 'featuredProjects',
      title: 'Proyectos destacados',
      type: 'text',
      group: 'profile',
    }),

    defineField({
      name: 'skills',
      title: 'Habilidades',
      type: 'array',
      group: 'profile',
      of: [{ type: 'string' }],
      description: 'Ej: Actuación, Acrobacia, Modelaje... incluye también habilidades libres agregadas por el artista'
    }),

    defineField({
      name: 'agencyProfile',
      title: 'Perfil dentro de la agencia',
      type: 'string',
      group: 'profile',
      options: {
        list: [
          { title: 'Bailarín comercial', value: 'Bailarín comercial' },
          { title: 'Artista urbano', value: 'Artista urbano' },
          { title: 'Artista latino', value: 'Artista latino' },
          { title: 'Bailarín de freestyle', value: 'Bailarín de freestyle' },
          { title: 'Performer', value: 'Performer' },
          { title: 'Coreógrafo', value: 'Coreógrafo' },
          { title: 'Director creativo', value: 'Director creativo' },
          { title: 'Artista integral / versátil', value: 'Artista integral / versátil' },
          { title: 'Modelo', value: 'Modelo' },
        ]
      }
    }),

    /* ─────────────────────────────
       CARACTERÍSTICAS FÍSICAS
    ───────────────────────────── */

    defineField({
      name: 'complexion',
      title: 'Complexión',
      type: 'string',
      group: 'physicalAttributes',
      options: {
        list: [
          { title: 'Delgada', value: 'Delgada' },
          { title: 'Atlética', value: 'Atlética' },
          { title: 'Media', value: 'Media' },
          { title: 'Robusta', value: 'Robusta' },
          { title: 'Plus size', value: 'Plus size' },
        ]
      }
    }),

    defineField({
      name: 'eyeColor',
      title: 'Color de ojos',
      type: 'string',
      group: 'physicalAttributes',
      options: {
        list: [
          { title: 'Negro', value: 'Negro' },
          { title: 'Café oscuro', value: 'Café oscuro' },
          { title: 'Café claro', value: 'Café claro' },
          { title: 'Miel', value: 'Miel' },
          { title: 'Verde', value: 'Verde' },
          { title: 'Azul', value: 'Azul' },
          { title: 'Gris', value: 'Gris' },
        ]
      }
    }),

    defineField({
      name: 'hairType',
      title: 'Tipo de cabello',
      type: 'string',
      group: 'physicalAttributes',
      options: {
        list: [
          { title: 'Liso', value: 'Liso' },
          { title: 'Ondulado', value: 'Ondulado' },
          { title: 'Crespo', value: 'Crespo' },
          { title: 'Afro', value: 'Afro' },
        ]
      }
    }),

    defineField({
      name: 'hairLength',
      title: 'Largo del cabello',
      type: 'string',
      group: 'physicalAttributes',
      options: {
        list: [
          { title: 'Rapado', value: 'Rapado' },
          { title: 'Muy corto', value: 'Muy corto' },
          { title: 'Corto', value: 'Corto' },
          { title: 'Medio', value: 'Medio' },
          { title: 'Largo', value: 'Largo' },
        ]
      }
    }),

    defineField({
      name: 'hairColor',
      title: 'Color de cabello',
      type: 'string',
      group: 'physicalAttributes',
      options: {
        list: [
          { title: 'Negro', value: 'Negro' },
          { title: 'Castaño oscuro', value: 'Castaño oscuro' },
          { title: 'Castaño claro', value: 'Castaño claro' },
          { title: 'Rubio', value: 'Rubio' },
          { title: 'Pelirrojo', value: 'Pelirrojo' },
          { title: 'Fantasía / color creativo', value: 'Fantasía / color creativo' },
        ]
      }
    }),

    /* ─────────────────────────────
       FILTROS / BÚSQUEDA
    ───────────────────────────── */

    defineField({
      name: 'city',
      title: 'Ciudad',
      type: 'string',
      group: 'filters'
    }),

    defineField({
      name: 'age',
      title: 'Edad',
      type: 'number',
      group: 'filters'
    }),

    defineField({
      name: 'height',
      title: 'Estatura (cm)',
      type: 'number',
      group: 'filters'
    }),

    defineField({
      name: 'hashtags',
      title: 'Hashtags',
      type: 'array',
      group: 'filters',
      of: [{ type: 'string' }]
    }),

    defineField({
      name: 'cvUrl',
      title: 'CV (URL PDF)',
      type: 'url',
      group: 'filters',
    }),

    /* ─────────────────────────────
       CONTROL ADMINISTRATIVO
    ───────────────────────────── */

    defineField({
      name: 'artistAvailability',
      title: 'Disponibilidad del artista',
      type: 'boolean',
      group: 'filters',
      initialValue: true,
      description: 'El artista indica si está disponible actualmente'
    }),

    defineField({
      name: 'adminAvailabilityOverride',
      title: 'Forzar disponibilidad (admin)',
      type: 'boolean',
      group: 'admin',
      description:
        'Si se define, sobrescribe la disponibilidad indicada por el artista'
    }),

    defineField({
      name: 'visible',
      title: 'Visible en Agencia',
      type: 'boolean',
      group: 'admin',
      initialValue: true
    }),

    defineField({
      name: 'featured',
      title: 'Destacado en Agencia',
      type: 'boolean',
      group: 'admin',
      initialValue: false,
      description: 'Si está activo, aparece en la página pública de Agencia',
    }),

    defineField({
      name: 'esProfesor',
      title: 'Es profesor',
      type: 'boolean',
      group: 'admin',
      initialValue: false,
      description: 'Si está activo, el artista aparece en la página pública de Clases'
    }),

    defineField({
      name: 'tiposClase',
      title: 'Tipos de clase que ofrece',
      type: 'array',
      group: 'admin',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Clases personalizadas', value: 'Clases personalizadas' },
          { title: 'Clases grupales', value: 'Clases grupales' },
        ]
      },
      description: 'Solo aplica si "Es profesor" está activo'
    }),

    defineField({
      name: 'updatedAt',
      title: 'Última actualización',
      type: 'datetime',
      group: 'admin',
      readOnly: true,
    })
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'photos.0'
    }
  }
})
