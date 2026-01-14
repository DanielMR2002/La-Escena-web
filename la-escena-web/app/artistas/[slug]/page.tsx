import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getArtistBySlug, urlFor } from '@/app/lib/sanity'
import type { Metadata } from 'next'
import { motion } from 'framer-motion'
import ArtistPageClient from './ArtistPageClient'



type PageProps = {
  params: {
    slug: string
  }
}

/* 🔥 SEO DINÁMICO */
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { slug } = await params
  const artist = await getArtistBySlug(slug)

  if (!artist) {
    return {
      title: 'Artista no encontrado | La Escena'
    }
  }

  return {
    title: `${artist.name} | ${artist.category} en ${artist.city} – La Escena`,
    description: artist.description?.slice(0, 150),
    openGraph: {
      title: `${artist.name} | La Escena`,
      description: artist.description,
      images: artist.photos?.[0]?.asset?.url
        ? [artist.photos[0].asset.url]
        : []
    }
  }
}

export default async function ArtistPage({ params }: PageProps) {
  const { slug } = await params 
  const artist = await getArtistBySlug(slug)

  if (!artist) {
    notFound()
  }

    return (
    <ArtistPageClient>
     {/* HERO */}
     <section style={{ marginBottom: '3rem' }}>
       {artist.photos?.[0] && (
          <Image
            src={urlFor(artist.photos[0]).width(1200).height(600).url()}
            alt={artist.name}
            width={1200}
            height={600}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '520px',
              borderRadius: '16px',
              objectFit: 'cover',
              marginBottom: '1.5rem'
            }}
         />
       )}

        <h1
         style={{
         fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
         fontWeight: 500
        }}
        >
         {artist.name}
        </h1>

        <p style={{ color: '#666', marginTop: '0.5rem' }}>
         {artist.category} · {artist.city}
        </p>
      </section>

     {/* INFO */}
     <section style={{ maxWidth: '720px', marginBottom: '3rem' }}>
       {artist.description && (
          <p style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
            {artist.description}
         </p>
        )}

        <p style={{ marginTop: '1.5rem', color: '#555' }}>
         <strong>Experiencia:</strong> {artist.experience} años
       </p>

        {artist.styles?.length > 0 && (
          <p style={{ marginTop: '0.5rem', color: '#555' }}>
            <strong>Estilos:</strong> {artist.styles.join(', ')}
         </p>
       )}
     </section>

     {/* GALERÍA */}
      {artist.photos?.length > 1 && (
       <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem'
         }}
       >
         {artist.photos.slice(1).map((photo: any) => (
            <Image
              key={photo._key}
             src={urlFor(photo).width(600).height(400).url()}
             alt={artist.name}
             width={600}
             height={400}
             style={{
                width: '100%',
                height: 'auto',
               borderRadius: '12px',
               objectFit: 'cover'
              }}
           />
          ))}
       </section>
     )}
    </ArtistPageClient>
  )

}
