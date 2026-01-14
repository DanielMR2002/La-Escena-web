import { defineType, defineField } from 'sanity'

export const artist = defineType({
  name: 'artist',
  title: 'Artista',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: (Rule) => Rule.required()
    }),

    defineField({
      name: 'city',
      title: 'Ciudad',
      type: 'string'
    }),

    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Bailarín', value: 'bailarin' },
          { title: 'Coreógrafo', value: 'coreografo' },
          { title: 'Director artístico', value: 'director' },
          { title: 'Artista circense', value: 'circense' }
        ],
        layout: 'radio'
      }
    }),

    defineField({
      name: 'styles',
      title: 'Estilos',
      type: 'array',
      of: [{ type: 'string' }]
    }),

    defineField({
      name: 'experience',
      title: 'Años de experiencia',
      type: 'number'
    }),

    defineField({
  name: 'photos',
  title: 'Fotos',
  type: 'array',
  of: [
    {
      type: 'image',
      options: {
        hotspot: true
      }
    }
  ]
})
,

    defineField({
      name: 'visible',
      title: 'Visible',
      type: 'boolean',
      initialValue: true
    })
  ]
})
