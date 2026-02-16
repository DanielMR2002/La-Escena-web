import { MetadataRoute } from 'next'
import { getPosts, getArtists } from '@/app/lib/sanity'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!

  // 📝 Blog
  const posts = await getPosts()

  const blogUrls = posts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug.current}`,
    lastModified: post.publishedAt
      ? new Date(post.publishedAt)
      : new Date(),
  }))

  // 🎭 Artistas
  const artists = await getArtists()

  const artistUrls = artists.map((artist: any) => ({
    url: `${baseUrl}/artistas/${artist.slug.current}`,
    lastModified: new Date(),
  }))

  return [
    //  Páginas estáticas
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/agencia`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/clases`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
    },

    // 🔁 Dinámicas
    ...blogUrls,
    ...artistUrls,
  ]
}
