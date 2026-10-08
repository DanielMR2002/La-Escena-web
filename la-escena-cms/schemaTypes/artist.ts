import { defineType, defineField } from 'sanity'

export const artist = defineType({
  name: 'artist',
  title: 'Artista',
  type: 'document',
  groups: [
    { name: 'identity',  title: 'Identidad' },
    { name: 'profile',   title: 'Perfil artístico' },
    { name: 'physical',  title: 'Físico' },
    { name: 'media',     title: 'Multimedia' },
    { name: 'admin',     title: 'Admin' },
  ],
  fields: [
    // ── IDENTITY ────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Nombre artístico',
      type: 'string',
      group: 'identity',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'identity',
      options: { source: 'name', maxLength: 96 },
    }),
    defineField({
      name: 'city',
      title: 'Ciudad',
      type: 'string',
      group: 'identity',
    }),
    defineField({
      name: 'age',
      title: 'Edad',
      type: 'number',
      group: 'identity',
    }),
    defineField({
      name: 'genero',
      title: 'Género / Identidad',
      type: 'string',
      group: 'identity',
      options: {
        list: [
          { title: 'Masculino', value: 'masculino' },
          { title: 'Femenino',  value: 'femenino' },
          { title: 'Otros',     value: 'otros' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'generoOtro',
      title: 'Género (texto libre)',
      type: 'string',
      group: 'identity',
      description: 'Solo se usa cuando género = "Otros"',
      hidden: ({ parent }) => parent?.genero !== 'otros',
    }),

    // ── PROFILE ─────────────────────────────────────────────────
    defineField({
      name: 'category',
      title: 'Categoría (legado)',
      type: 'string',
      group: 'profile',
    }),
    defineField({
      name: 'agencyProfile',
      title: '¿Cómo te gustaría ser representado?',
      type: 'array',
      group: 'profile',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Bailarín / Bailarina',     value: 'Bailarín / Bailarina' },
          { title: 'Modelo',                   value: 'Modelo' },
          { title: 'Actor / Actriz',            value: 'Actor / Actriz' },
          { title: 'Artista circense',          value: 'Artista circense' },
          { title: 'Coreógrafo / Directora',   value: 'Coreógrafo / Directora' },
          { title: 'Creador/a de contenido',   value: 'Creador/a de contenido' },
          { title: 'Músico / Cantante',        value: 'Músico / Cantante' },
        ],
        layout: 'grid',
      },
    }),
    defineField({
      name: 'tipoPerfil',
      title: 'Tipo de perfil',
      type: 'array',
      group: 'profile',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Bailarín/a',           value: 'bailarin' },
          { title: 'Modelo',               value: 'modelo' },
          { title: 'Actor/Actriz',         value: 'actor' },
          { title: 'Coreógrafo/a',         value: 'coreografo' },
          { title: 'Director/a',           value: 'director' },
          { title: 'Creador de contenido', value: 'creador-contenido' },
          { title: 'Artista circense',     value: 'circense' },
        ],
        layout: 'grid',
      },
    }),
    defineField({
      name: 'experience',
      title: 'Años de experiencia',
      type: 'number',
      group: 'profile',
    }),
    defineField({
      name: 'projectTypes',
      title: '¿En qué tipo de proyectos has trabajado?',
      type: 'text',
      group: 'profile',
    }),
    defineField({
      name: 'experienceDescription',
      title: '¿Qué experiencia tienes? (legado)',
      type: 'text',
      group: 'profile',
    }),
    defineField({
      name: 'description',
      title: 'Biografía',
      type: 'text',
      group: 'profile',
    }),
    defineField({
      name: 'estilosPrincipales',
      title: 'Estilos Principales',
      type: 'array',
      group: 'profile',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'estilosSecundarios',
      title: 'Estilos Secundarios',
      type: 'array',
      group: 'profile',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'styles',
      title: 'Estilos (legado)',
      type: 'array',
      group: 'profile',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'skills',
      title: 'Habilidades',
      type: 'array',
      group: 'profile',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'hashtags',
      title: 'Hashtags',
      type: 'array',
      group: 'profile',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'trayectoria',
      title: 'Trayectoria',
      type: 'array',
      group: 'profile',
      of: [
        defineField({
          name: 'trayectoriaItem',
          title: 'Proyecto',
          type: 'object',
          fields: [
            { name: 'proyecto', title: 'Proyecto', type: 'string' },
            { name: 'cliente',  title: 'Cliente',  type: 'string' },
            { name: 'anio',     title: 'Año',      type: 'number' },
          ],
        }),
      ],
    }),

    // ── PHYSICAL ─────────────────────────────────────────────────
    defineField({
      name: 'height',
      title: 'Estatura (cm)',
      type: 'number',
      group: 'physical',
    }),
    defineField({
      name: 'complexion',
      title: 'Complexión',
      type: 'string',
      group: 'physical',
    }),
    defineField({
      name: 'eyeColor',
      title: 'Color de ojos',
      type: 'string',
      group: 'physical',
    }),
    defineField({
      name: 'hairType',
      title: 'Tipo de cabello',
      type: 'string',
      group: 'physical',
    }),
    defineField({
      name: 'hairLength',
      title: 'Largo de cabello',
      type: 'string',
      group: 'physical',
    }),
    defineField({
      name: 'hairColor',
      title: 'Color de cabello',
      type: 'string',
      group: 'physical',
    }),

    // ── MEDIA ────────────────────────────────────────────────────
    defineField({
      name: 'photos',
      title: 'Fotos',
      type: 'array',
      group: 'media',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      group: 'media',
      of: [
        defineField({
          name: 'videoItem',
          title: 'Video',
          type: 'object',
          fields: [
            { name: 'url',   title: 'URL (YouTube)', type: 'url' },
            { name: 'title', title: 'Título',        type: 'string' },
          ],
        }),
      ],
    }),
    defineField({
      name: 'cvUrl',
      title: 'CV (URL PDF)',
      type: 'url',
      group: 'media',
    }),

    // ── REDES SOCIALES ───────────────────────────────────────────
    defineField({
      name: 'instagram',
      title: 'Instagram',
      type: 'url',
      group: 'profile',
    }),
    defineField({
      name: 'tiktok',
      title: 'TikTok',
      type: 'url',
      group: 'profile',
    }),
    defineField({
      name: 'youtube',
      title: 'YouTube',
      type: 'url',
      group: 'profile',
    }),
    defineField({
      name: 'socialLinksPublic',
      title: 'Redes sociales visibles al público',
      type: 'boolean',
      group: 'admin',
      description: 'Si está activo, instagram/tiktok/youtube serán visibles en el perfil público del artista.',
      initialValue: false,
    }),

    // ── PRUEBAS DE TRABAJO ───────────────────────────────────────
    defineField({
      name: 'pruebasTrabajo',
      title: 'Pruebas de trabajo (pendientes de aprobación)',
      type: 'array',
      group: 'admin',
      description: 'Archivos subidos por el artista (coreógrafo/director) que esperan revisión.',
      of: [
        defineField({
          name: 'pruebaItem',
          title: 'Prueba',
          type: 'object',
          fields: [
            { name: 'url',      title: 'URL',      type: 'url' },
            { name: 'title',    title: 'Nombre',   type: 'string' },
            { name: 'fileType', title: 'Tipo',     type: 'string' },
          ],
        }),
      ],
    }),
    defineField({
      name: 'pruebasTrabajoAprobadas',
      title: 'Pruebas de trabajo (aprobadas)',
      type: 'array',
      group: 'admin',
      description: 'Pruebas aprobadas por un admin. Se muestran en el perfil público.',
      of: [
        defineField({
          name: 'pruebaAprobadaItem',
          title: 'Prueba aprobada',
          type: 'object',
          fields: [
            { name: 'url',      title: 'URL',      type: 'url' },
            { name: 'title',    title: 'Nombre',   type: 'string' },
            { name: 'fileType', title: 'Tipo',     type: 'string' },
          ],
        }),
      ],
    }),

    // ── ADMIN ────────────────────────────────────────────────────
    defineField({
      name: 'artistAvailability',
      title: 'Disponible para proyectos',
      type: 'boolean',
      group: 'admin',
      initialValue: true,
    }),
    defineField({
      name: 'esProfesor',
      title: 'Es profesor',
      type: 'boolean',
      group: 'admin',
      initialValue: false,
    }),
    defineField({
      name: 'tiposClase',
      title: 'Tipos de clase',
      type: 'array',
      group: 'admin',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'userId',
      title: 'User ID (NextAuth)',
      type: 'string',
      group: 'admin',
    }),
    defineField({
      name: 'isPublished',
      title: 'Publicado',
      type: 'boolean',
      group: 'admin',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title:  'name',
      subtitle: 'city',
      media:  'photos.0',
    },
  },
})
