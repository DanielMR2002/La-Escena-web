import { defineType, defineField } from 'sanity'

export const comment = defineType({
  name: 'comment',
  title: 'Comentario',
  type: 'document',
  fields: [
    defineField({
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: [{ type: 'post' }],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'parentComment',
      title: 'Respuesta a',
      type: 'reference',
      to: [{ type: 'comment' }],
    }),
    defineField({
      name: 'authorName',
      title: 'Nombre del autor',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'authorUserId',
      title: 'ID de usuario',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Comentario',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'approved',
      title: 'Aprobado',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'createdAt',
      title: 'Fecha',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true
    }),
  ]
})
