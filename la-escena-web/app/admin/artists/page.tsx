export const dynamic = "force-dynamic"

export default async function AdminArtistsPage() {

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/admin/artists/list`,
    { cache: "no-store" }
  )

  const artists = await res.json()

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
