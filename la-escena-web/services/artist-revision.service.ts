import { prisma } from "@/lib/prisma"
import { sanityWriteClient } from "@/lib/sanity"

export async function createArtistRevision(
  artistId: string,
  data: any
) {
  return prisma.artistProfileRevision.create({
    data: {
      artistId,
      data,
      status: "PENDING"
    }
  })
}

export async function approveRevision(revisionId: string) {
  const revision = await prisma.artistProfileRevision.findUnique({
    where: { id: revisionId }
  })

  if (!revision) {
    throw new Error("Revision not found")
  }

  await prisma.artistProfile.update({
    where: { id: revision.artistId },
    data: {
      profileData: revision.data as any
    }
  })

  await prisma.artistProfileRevision.update({
    where: { id: revisionId },
    data: {
      status: "APPROVED",
      reviewedAt: new Date()
    }
  })
}

// Usada por las subidas de fotos/videos del artista: asegura que exista
// una revisión PENDING (creándola vacía si hace falta) para que el admin
// siempre tenga una sola cosa que aprobar/rechazar, sea texto o medios.
export async function ensurePendingRevision(artistId: string) {
  const existing = await prisma.artistProfileRevision.findFirst({
    where: { artistId, status: "PENDING" },
    orderBy: { createdAt: "desc" },
  })

  if (existing) {
    const data = { ...((existing.data as Record<string, any>) ?? {}), hasPendingMedia: true }
    await prisma.artistProfileRevision.update({
      where: { id: existing.id },
      data: { data },
    })
  } else {
    await prisma.artistProfileRevision.create({
      data: {
        artistId,
        data: { hasPendingMedia: true },
        status: "PENDING",
      },
    })
  }

  await prisma.artistProfile.update({
    where: { id: artistId },
    data: {
      status: "PENDING",
      adminComment: null,
      reviewedAt: null,
    },
  })
}

export async function rejectRevision(
  revisionId: string,
  comment: string
) {
  const revision = await prisma.artistProfileRevision.update({
    where: { id: revisionId },
    data: {
      status: "REJECTED",
      adminComment: comment,
      reviewedAt: new Date()
    }
  })

  const profile = await prisma.artistProfile.update({
    where: { id: revision.artistId },
    data: {
      status: "REJECTED",
      adminComment: comment,
      reviewedAt: new Date()
    }
  })

  // Descarta cualquier foto/video que el artista haya subido para esta revisión
  if (profile.sanityId) {
    await sanityWriteClient
      .patch(profile.sanityId)
      .unset(["pendingPhotos", "pendingVideos"])
      .commit()
  }

  return revision
}

export async function getPendingRevisions() {
  return prisma.artistProfileRevision.findMany({
    where: {
      status: "PENDING"
    },
    include: {
      artist: {
        include: {
          user: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })
}


export async function getPendingRevisionsCount() {
  return prisma.artistProfileRevision.count({
    where: {
      status: "PENDING"
    }
  })
}