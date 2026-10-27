import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"

/* ================== CLIENTE PUBLICO (LECTURA) ================== */

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: true,
})

/* ================== CLIENTE ADMIN (ESCRITURA) ================== */

export const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

/* ================== CLIENTE LECTURA SIN CACHÉ CDN ================== */
/* Usar cuando se lee inmediatamente después de un write (evita el lag
   de replicación del CDN de Sanity, que puede tardar ~60s o más). */

export const sanityFreshClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: false,
})

/* ================== IMAGE BUILDER ================== */

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: any) {
  return builder.image(source)
}

/* ================== ARTISTAS ================== */

export async function getArtists() {
  return sanityClient.fetch(`
    *[_type == "artist" && visible == true]{
      _id,
      name,
      slug,
      city,
      category,
      agencyProfile,
      skills,
      complexion,
      eyeColor,
      hairType,
      hairLength,
      hairColor,
      styles,
      experience,
      age,
      height,
      hashtags,
      "photos": photos[]{ _key, asset, photoCategory },

      // estados reales
      artistAvailability,
      adminAvailabilityOverride,

      // campo calculado (NO FILTRA, SOLO INFORMA)
      "isAvailable": select(
        defined(adminAvailabilityOverride) => adminAvailabilityOverride,
        artistAvailability
      )
    }
  `)
}

export async function getFeaturedArtists() {
  return sanityFreshClient.fetch(`
    *[_type == "artist" && visible == true && featured == true]{
      _id,
      name,
      slug,
      city,
      category,
      agencyProfile,
      skills,
      complexion,
      eyeColor,
      hairType,
      hairLength,
      hairColor,
      esProfesor,
      styles,
      experience,
      age,
      height,
      hashtags,
      "photos": photos[]{ _key, asset, photoCategory },
      visible,
      artistAvailability,
      adminAvailabilityOverride,
      "isAvailable": select(
        defined(adminAvailabilityOverride) => adminAvailabilityOverride,
        artistAvailability
      )
    }
  `)
}

export async function getTeachingArtists() {
  return sanityClient.fetch(`
    *[_type == "artist" && visible == true && esProfesor == true]{
      _id,
      name,
      slug,
      city,
      category,
      agencyProfile,
      skills,
      complexion,
      eyeColor,
      hairType,
      hairLength,
      hairColor,
      styles,
      tiposClase,
      photos
    } | order(name asc)
  `)
}

export async function getBookPhotos() {
  return sanityClient.fetch(`
    *[_type == "artist" && visible == true && defined(photos) && count(photos) > 0]{
      _id,
      name,
      slug,
      category,
      "photos": photos[0..3]
    } | order(name asc)
  `)
}

export async function getGalleryPhotos() {
  return sanityClient.fetch(`
    *[_type == "galleryPhoto"] | order(order asc) {
      _id,
      image,
      caption,
      order
    }
  `)
}

export async function getArtistBySlug(slug: string) {
  return sanityFreshClient.fetch(
    `
    *[_type == "artist" && slug.current == $slug][0]{
      _id,
      name,
      city,
      category,
      agencyProfile,
      skills,
      complexion,
      eyeColor,
      hairType,
      hairLength,
      hairColor,
      esProfesor,
      tiposClase,
      styles,
      estilosPrincipales,
      estilosSecundarios,
      tipoPerfil,
      instagram,
      tiktok,
      youtube,
      experience,
      projectTypes,
      experienceDescription,
      age,
      height,
      hashtags,
      description,
      "slug": slug.current,
      "trayectoria": trayectoria{ aniosBailando, aniosExperiencia, edad, estatura },
      "photos": photos[]{ _key, asset, photoCategory },
      "videos": videos[]{ _key, url, title },
      genero,
      generoOtro,
      socialLinksPublic,
      "pruebasTrabajoAprobadas": pruebasTrabajoAprobadas[]{ _key, url, title, fileType }
    }
    `,
    { slug }
  )
}

/* ================== BLOG ================== */

export function textToBlocks(text: string) {
  return text.split('\n\n').filter(Boolean).map(para => ({
    _type: 'block',
    _key: Math.random().toString(36).slice(2, 10),
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2, 10), text: para.trim(), marks: [] }],
    markDefs: [],
    style: 'normal',
  }))
}

export async function getPosts() {
  return sanityClient.fetch(`
    *[_type == "post"] | order(publishedAt desc){
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      mainImage
    }
  `)
}

export async function getPostBySlug(slug: string) {
  return sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      excerpt,
      publishedAt,
      category,
      body,
      mainImage,
      bottomImage
    }`,
    { slug }
  )
}

export async function getPostById(id: string) {
  return sanityWriteClient.fetch(
    `*[_type == "post" && _id == $id][0]{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      category,
      body,
      mainImage,
      bottomImage
    }`,
    { id }
  )
}

export async function getPostCategories(): Promise<string[]> {
  const results = await sanityWriteClient.fetch(
    `array::unique(*[_type == "post" && defined(category) && category != ""].category)`
  )
  return results ?? []
}

/* ================== BLOG INTERNO ================== */

export async function getInternalPosts() {
  return sanityClient.fetch(`
    *[_type == "internalPost"] | order(publishedAt desc){
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      mainImage,
      body
    }
  `)
}

export async function getInternalPostById(id: string) {
  return sanityWriteClient.fetch(
    `*[_type == "internalPost" && _id == $id][0]{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      category,
      body,
      mainImage,
      bottomImage
    }`,
    { id }
  )
}

export async function getInternalPostCategories(): Promise<string[]> {
  const results = await sanityWriteClient.fetch(
    `array::unique(*[_type == "internalPost" && defined(category) && category != ""].category)`
  )
  return results ?? []
}

/* ================== POSTS PENDIENTES (ARTISTAS) ================== */

export async function getPendingPosts() {
  return sanityWriteClient.fetch(`
    *[_type == "post" && status == "pending"] | order(publishedAt desc){
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      authorName,
      category
    }
  `)
}

export async function getPublicPosts() {
  return sanityClient.fetch(`
    *[_type == "post" && (status == "published" || !defined(status))] | order(publishedAt desc){
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      mainImage,
      category
    }
  `)
}

/* ================== COMENTARIOS ================== */

export async function getApprovedComments(postId: string) {
  return sanityClient.fetch(
    `*[_type == "comment" && post._ref == $postId && approved == true && !defined(parentComment)] | order(createdAt asc){
      _id,
      authorName,
      body,
      createdAt,
      "replies": *[_type == "comment" && parentComment._ref == ^._id && approved == true] | order(createdAt asc){
        _id,
        authorName,
        body,
        createdAt
      }
    }`,
    { postId }
  )
}

export async function getPendingComments() {
  return sanityWriteClient.fetch(`
    *[_type == "comment" && approved == false] | order(createdAt asc){
      _id,
      authorName,
      body,
      createdAt,
      "postTitle": post->title,
      "postId": post._ref,
      "parentBody": parentComment->body
    }
  `)
}

export async function getAllComments() {
  return sanityWriteClient.fetch(`
    *[_type == "comment" && approved == true] | order(createdAt desc){
      _id,
      authorName,
      body,
      createdAt,
      "postTitle": post->title,
      "postId": post._ref,
      "parentBody": parentComment->body
    }
  `)
}
