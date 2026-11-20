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

    // Sync a Sanity — si no tiene sanityId, crear el documento primero
    let sanityId = profile.sanityId

    const { hasPendingMedia, pruebasTrabajo: pruebasEnRevision, deletePruebaKeys, ...sanityData } = (revision.data ?? {}) as Record<string, any>

    if (!sanityId) {
      // Crear documento en Sanity usando los datos de la revisión
      const slug = (sanityData.name ?? "artista")
        .toLowerCase()
        .normalize("NFD").replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") + "-" + Date.now()

      const newDoc = await sanityWriteClient.create({
        _type: "artist",
        name: sanityData.name ?? "",
        slug: { _type: "slug", current: slug },
        photos: [],
        videos: [],
        category: sanityData.category ?? "bailarin",
        styles: sanityData.styles ?? [],
        description: sanityData.description ?? "",
        experience: sanityData.experience ?? 0,
        city: sanityData.city ?? "",
        age: sanityData.age ?? null,
        height: sanityData.height ?? null,
        hashtags: sanityData.hashtags ?? [],
        artistAvailability: sanityData.artistAvailability ?? true,
        visible: true,
      })

      sanityId = newDoc._id
      await prisma.artistProfile.update({
        where: { id: revision.artistId },
        data: { sanityId },
      })
    }

    const current = await sanityFreshClient.fetch(
      `*[_type == "artist" && _id == $id][0]{ photos, pendingPhotos, videos, pendingVideos, pruebasTrabajoAprobadas }`,
      { id: sanityId }
    )

    const mergedPhotos = mergePendingPhotos(current?.photos ?? [], current?.pendingPhotos ?? [])
    const mergedVideos = [...(current?.videos ?? []), ...(current?.pendingVideos ?? [])]
    const pruebasNuevas = Array.isArray(pruebasEnRevision) ? pruebasEnRevision : []
    const keysToDelete = Array.isArray(deletePruebaKeys) ? deletePruebaKeys : []
    const basePruebas = (current?.pruebasTrabajoAprobadas ?? []).filter(
      (p: any) => !keysToDelete.includes(p._key)
    )
    const mergedPruebas = [...basePruebas, ...pruebasNuevas]

    await sanityWriteClient
      .patch(sanityId)
      .set({
        ...sanityData,
        photos: mergedPhotos,
        videos: mergedVideos,
        ...(mergedPruebas.length > 0 ? { pruebasTrabajoAprobadas: mergedPruebas } : {}),
      })
      .unset(["pendingPhotos", "pendingVideos"])
      .commit()

    await prisma.artistProfile.update({
      where: { id: revision.artistId },
      data: {
        profileData: revision.data ?? {},
        status: "APPROVED",
        ...(sanityId !== profile.sanityId ? { sanityId } : {}),
        adminComment: null,
        reviewedAt: new Date(),
      },
    })

    // Marcar la revisión aprobada como APPROVED (no borrarla,
    // para que nameIsLocked funcione correctamente)
    await prisma.artistProfileRevision.update({
      where: { id: revision.id },
      data: { status: "APPROVED", reviewedAt: new Date() },
    })

    // Borrar solo las otras revisiones pendientes o rechazadas
    await prisma.artistProfileRevision.deleteMany({
      where: { artistId: revision.artistId, id: { not: revision.id } },
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("ERROR APPROVE:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
