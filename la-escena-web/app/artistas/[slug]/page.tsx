import { notFound } from 'next/navigation'
import { getArtistBySlug } from '@/lib/sanity'
import { formatCategoryLabel } from '@/lib/artistCategories'
import type { Metadata } from 'next'
import ArtistPageClient from './ArtistPageClient'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const artist = await getArtistBySlug(slug)

  if (!artist) return { title: 'Artista no encontrado | La Escena' }

  const categoryLabel = formatCategoryLabel(artist.agencyProfile || artist.category, artist.esProfesor)

  return {
    title: `${artist.name} | ${categoryLabel} en ${artist.city} – La Escena`,
    description: artist.description?.slice(0, 150),
    openGraph: {
      title: `${artist.name} | La Escena`,
      description: artist.description,
      images: artist.photos?.[0]?.asset?.url ? [artist.photos[0].asset.url] : [],
    },
  }
}

export default async function ArtistPage({ params }: PageProps) {
  const { slug } = await params
  const artist = await getArtistBySlug(slug)

  if (!artist) notFound()

  return <ArtistPageClient artist={artist} />
}
