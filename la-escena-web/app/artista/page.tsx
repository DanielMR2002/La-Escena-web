export const dynamic = "force-dynamic"

import { requireArtist } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import EditArtistForm from "./EditArtistForm"

export default async function ArtistDashboard() {

  const session = await requireArtist()

  const profile = await prisma.artistProfile.findUnique({
    where: {
      userId: session.user.id
    }
  })

  const lastRejectedRevision = await prisma.artistProfileRevision.findFirst({
    where: {
      artistId: profile?.id,
      status: "REJECTED"
    },
    orderBy: {
      reviewedAt: "desc"
    }
  })

  return (
    <div style={{ padding: "40px" }}>
      <h1>Panel del Artista</h1>

      <p>
        Estado actual: <strong>{profile?.status}</strong>
      </p>

      <EditArtistForm
        artistId={profile?.id || ""}
        initialData={profile?.profileData || {}}
        lastRejectedRevision={lastRejectedRevision}
      />
    </div>
  )
}