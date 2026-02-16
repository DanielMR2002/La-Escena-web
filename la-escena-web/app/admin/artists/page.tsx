export const dynamic = "force-dynamic"

import { getArtists } from "@/services/artist.service"
import { requireAdmin } from "@/lib/auth"

export default async function AdminArtistsPage() {

  await requireAdmin()

  const artists = await getArtists()

  return (
    <div>
      <h1>Artistas</h1>

      {artists.map((artist) => (
        <div key={artist.id}>
          <p>Email: {artist.user.email}</p>
          <p>Estado: {artist.status}</p>
        </div>
      ))}
    </div>
  )
}
