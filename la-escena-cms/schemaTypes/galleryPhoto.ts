import { defineType, defineField } from 'sanity'

export const galleryPhoto = defineType({
  name: 'galleryPhoto',
  title: 'Foto de Galería',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'caption',
      title: 'Descripción',
      type: 'string'
    }),
    defineField({
      name: 'order',
      title: 'Orden',
      type: 'number',
      initialValue: 0
    }),
  ],
  preview: {
    select: { title: 'caption', media: 'image' }
  }
})
