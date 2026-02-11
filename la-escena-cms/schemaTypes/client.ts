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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'email',
      title: 'Email',
      type: 'string'
    }),

    defineField({
      name: 'artists',
      title: 'Artistas asignados',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'artist' }]
        }
      ],
      description:
        'Artistas que este cliente puede ver en su perfil'
    }),

    defineField({
      name: 'active',
      title: 'Cliente activo',
      type: 'boolean',
      initialValue: true
    })
  ]
})
