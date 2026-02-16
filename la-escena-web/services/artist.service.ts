import { prisma } from "@/app/lib/prisma"
import { ArtistStatus } from "@prisma/client"

export async function getArtists() {
  return prisma.artistProfile.findMany({
    include: { user: true }
  })
}

export async function updateArtistStatus(
  artistId: string,
  status: ArtistStatus,
  comment?: string
) {
  return prisma.artistProfile.update({
    where: { id: artistId },
    data: {
      status,
      adminComment: comment,
      reviewedAt: new Date()
    }
  })
}

