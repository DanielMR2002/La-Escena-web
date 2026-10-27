import { defineType, defineField } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      options: {
        list: [
          { title: 'Publicado', value: 'published' },
          { title: 'Pendiente de revisión', value: 'pending' },
        ],
        layout: 'radio'
      },
      initialValue: 'published'
    }),
    defineField({
      name: 'authorName',
      title: 'Autor (nombre)',
      type: 'string',
    }),
    defineField({
      name: 'authorUserId',
      title: 'Autor (ID de usuario)',
      type: 'string',
    }),
    defineField({
      name: 'excerpt',
      title: 'Resumen',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.max(160)
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagen principal',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'bottomImage',
      title: 'Imagen al fondo',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'body',
      title: 'Contenido',
      type: 'array',
      of: [{ type: 'block' }]
    })
  ]
})
