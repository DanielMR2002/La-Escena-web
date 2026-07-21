import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sanityFreshClient, sanityWriteClient } from "@/lib/sanity"

function mergePendingPhotos(current: any[], pending: any[]) {
  let result = [...current]
  for (const p of pending) {
    const category = p.photoCategory as string | undefined
    if (category) {
      const idx = result.findIndex((x) => x.photoCategory === category)
      if (idx >= 0) {
        result[idx] = p
        continue
      }
      if (category === "headshot" && result.length > 0) {
        result = [p, ...result]
        continue
      }
    }
    result.push(p)
  }
  return result
}

export async function POST(req: Request) {
  try {
    await requireAdmin()

    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "Missing revision id" }, { status: 400 })
    }

    const revision = await prisma.artistProfileRevision.findUnique({
      where: { id }
    })

    if (!revision) {
      return NextResponse.json({ error: "Revision not found" }, { status: 404 })
    }

    const profile = await prisma.artistProfile.findUnique({
      where: { id: revision.artistId }
    })

    if (!profile) {
      return NextResponse.json({ error: "Artist profile not found" }, { status: 404 })
    }

    // Sync a Sanity solo si el artista ya está conectado
    if (profile.sanityId) {
      const { hasPendingMedia, ...sanityData } = (revision.data ?? {}) as Record<string, any>

      const current = await sanityFreshClient.fetch(
        `*[_type == "artist" && _id == $id][0]{ photos, pendingPhotos, videos, pendingVideos }`,
        { id: profile.sanityId }
      )

      const mergedPhotos = mergePendingPhotos(current?.photos ?? [], current?.pendingPhotos ?? [])
      const mergedVideos = [...(current?.videos ?? []), ...(current?.pendingVideos ?? [])]

      await sanityWriteClient
        .patch(profile.sanityId)
        .set({
          ...sanityData,
          photos: mergedPhotos,
          videos: mergedVideos,
        })
        .unset(["pendingPhotos", "pendingVideos"])
        .commit()
    }

    await prisma.artistProfile.update({
      where: { id: revision.artistId },
      data: {
        profileData: revision.data ?? {},
        status: "APPROVED",
        adminComment: null,
        reviewedAt: new Date(),
      },
    })

    await prisma.artistProfileRevision.deleteMany({
      where: { artistId: revision.artistId },
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("ERROR APPROVE:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
