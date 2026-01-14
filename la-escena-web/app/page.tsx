import { getArtists } from '@/app/lib/sanity'



export default async function HomePage() {
  const artists = await getArtists()

  return (
    <main style={{ padding: '2rem' }}>
      <h1>La Escena</h1>
      <p>Artistas disponibles: {artists.length}</p>
    </main>
  )
}
