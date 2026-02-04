import { defineType, defineField } from 'sanity'

export const artist = defineType({
  name: 'artist',
  title: 'Artista',
  type: 'document',

  groups: [
    { name: 'identity', title: 'Identidad' },
    { name: 'profile', title: 'Perfil artístico' },
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
          options: { hotspot: true }
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
          { title: 'Director artístico', value: 'director' },
          { title: 'Coreógrafo', value: 'coreografo' },
          { title: 'Bailarín', value: 'bailarin' },
          { title: 'Profesor', value: 'profesor' },
          { title: 'Artista circense', value: 'circense' }
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
      name: 'experience',
      title: 'Años de experiencia',
      type: 'number',
      group: 'profile'
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
      name: 'availability',
      title: 'Disponibilidad',
      type: 'boolean',
      group: 'filters',
      initialValue: true
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
