import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: true, // 👈 IMPORTANTE
})

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: any) {
  return builder.image(source)
}

/* ================== ARTISTAS ================== */

export async function getArtists() {
  return sanityClient.fetch(`
    *[_type == "artist"]{
      _id,
      name,
      slug,
      category,
      city,
      photos
    }
  `)
}

export async function getArtistBySlug(slug: string) {
  return sanityClient.fetch(
    `
    *[_type == "artist" && slug.current == $slug][0]{
      _id,
      name,
      city,
      category,
      styles,
      experience,
      description,
      photos
    }
    `,
    { slug }
  )
}

/* ================== BLOG ================== */

export async function getPosts() {
  return sanityClient.fetch(`
    *[_type == "post"] | order(publishedAt desc){
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
    `
    *[_type == "post" && slug.current == $slug][0]{
      title,
      excerpt,
      publishedAt,
      body,
      mainImage
    }
    `,
    { slug }
  )
}
