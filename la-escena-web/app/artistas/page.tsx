import { getArtists } from '@/lib/sanity'
import Link from 'next/link'

export default async function ArtistasPage() {
  const artists = await getArtists()

  return (
   <main>
    <h1 style={{
     fontSize: 'clamp(2rem, 4vw, 2.6rem)',
     marginBottom: '0.25rem'
    }}>
    Artistas
    </h1>
    <p
    style={{
     fontSize: '1.05rem',
     lineHeight: 1.8,
     color: '#333',
     marginBottom: '2rem'
    }}
    >
    Descubre artistas por ciudad, categoría y estilo. Explora talentos
    destacados y encuentra al artista ideal para tu evento.
    </p>
    <ul>
      {artists.map((artist: any) => (
        <li key={artist._id}>
          <Link href={`/artistas/${artist.slug.current}`}>
            {artist.name}
          </Link>
        </li>
      ))}
    </ul>
   </main>
  )
}
