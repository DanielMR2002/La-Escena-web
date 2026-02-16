export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"

export default async function AdminArtistsPage() {
  const artists = await prisma.artistProfile.findMany({
    include: {
      user: true
    }
  })

  return (
    <div>
      <h1>Artistas</h1>

      {artists.map((artist: any) => (
        <div key={artist.id}>
          <p>Email: {artist.user.email}</p>
          <p>Estado: {artist.status}</p>
        </div>
      ))}
    </div>
  )
}
