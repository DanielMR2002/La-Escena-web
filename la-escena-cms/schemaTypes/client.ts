import { defineType, defineField } from 'sanity'

export const client = defineType({
  name: 'client',
  title: 'Cliente',
  type: 'document',

  fields: [
    defineField({
      name: 'name',
      title: 'Nombre del cliente',
      type: 'string',
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'email',
      title: 'Email',
      type: 'string'
    }),

    defineField({
      name: 'allowedArtists',
      title: 'Artistas asignados',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'artist' }] }],
      description:
        'Artistas que este cliente puede ver en su entorno privado'
    }),

    defineField({
      name: 'allowedCategories',
      title: 'Categorías permitidas',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Director artístico', value: 'director' },
          { title: 'Coreógrafo', value: 'coreografo' },
          { title: 'Bailarín', value: 'bailarin' },
          { title: 'Profesor', value: 'profesor' },
          { title: 'Artista circense', value: 'circense' }
        ]
      },
      description:
        'Limita los filtros disponibles para este cliente'
    }),

    defineField({
      name: 'active',
      title: 'Cliente activo',
      type: 'boolean',
      initialValue: true
    })
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'email'
    }
  }
})
