import { prisma } from "@/lib/prisma"

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

export async function rejectRevision(
  revisionId: string,
  comment: string
) {
  return prisma.artistProfileRevision.update({
    where: { id: revisionId },
    data: {
      status: "REJECTED",
      adminComment: comment,
      reviewedAt: new Date()
    }
  })
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