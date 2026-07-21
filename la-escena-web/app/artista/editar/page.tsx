export const dynamic = "force-dynamic"

import Link from "next/link"
import { requireArtistOrAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sanityFreshClient } from "@/lib/sanity"
import { ensureAdminArtistProfile } from "@/services/admin-profile.service"
import EditArtistForm from "@/app/artista/EditArtistForm"
import ArtistMediaManager from "@/app/admin/artists/[id]/ArtistMediaManager"
import PhotoSlotManager from "@/app/components/PhotoSlotManager"
import ArtistVideoManager from "@/app/components/ArtistVideoManager"

export default async function EditarArtistPage() {
  const session = await requireArtistOrAdmin()
  const isAdmin = session.user.role === "ADMIN"

  let profile = await prisma.artistProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (isAdmin && !profile?.sanityId) {
    const result = await ensureAdminArtistProfile(session.user.id)
    profile = result.profile
  }

  const lastRejectedRevision = await prisma.artistProfileRevision.findFirst({
    where: { artistId: profile?.id, status: "REJECTED" },
    orderBy: { reviewedAt: "desc" },
  })

  let photos: any[] = []
  let videos: any[] = []
  let pendingPhotos: any[] = []
  let pendingVideos: any[] = []
  let sanityProfile: any = null

  if (profile?.sanityId) {
    const sanity = await sanityFreshClient.fetch(
      `*[_type == "artist" && _id == $id][0]{
        name, city, category, agencyProfile, experience, description,
        projectTypes, experienceDescription, featuredProjects,
        age, height, hashtags, cvUrl, artistAvailability,
        complexion, eyeColor, hairType, hairLength, hairColor, skills,
        esProfesor, tiposClase, styles,
        trayectoria[]{ proyecto, cliente, anio },
        photos[]{ _key, asset, photoCategory },
        "videos": videos[]{ _key, url, title },
        pendingPhotos[]{ _key, asset, photoCategory },
        "pendingVideos": pendingVideos[]{ _key, url, title }
      }`,
      { id: profile.sanityId }
    )
    if (sanity) {
      sanityProfile = sanity
      photos        = sanity.photos ?? []
      videos        = sanity.videos ?? []
      pendingPhotos = sanity.pendingPhotos ?? []
      pendingVideos = sanity.pendingVideos ?? []
    }
  }

  const hasPendingMedia = pendingPhotos.length > 0 || pendingVideos.length > 0

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>

      <Link href="/artista" style={{
        display: "inline-block", marginBottom: "24px",
        fontSize: "0.9rem", color: "#6b7280", textDecoration: "none",
      }}>
        ← Volver al perfil
      </Link>

      <h1 style={{ fontSize: "1.6rem", fontWeight: 600, margin: "0 0 4px" }}>Editar perfil</h1>
      <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "0" }}>
        Estado actual: <strong>{profile?.status}</strong>
      </p>

      <EditArtistForm
        artistId={profile?.id || ""}
        sanityId={profile?.sanityId ?? null}
        isAdmin={isAdmin}
        esProfesor={sanityProfile?.esProfesor ?? false}
        hasPendingMedia={hasPendingMedia}
        initialData={sanityProfile ?? profile?.profileData ?? {}}
        lastRejectedRevision={lastRejectedRevision}
      />

      {/* ── Fotos y videos ── */}
      {isAdmin && profile?.sanityId ? (
        <div style={{ marginTop: "40px" }}>
          <ArtistMediaManager
            sanityId={profile.sanityId}
            photos={photos}
            videos={videos}
          />
        </div>
      ) : (
        <>
          {profile?.sanityId && (
            <div style={{ marginTop: "40px" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "16px" }}>
                Mis fotos
              </h2>
              <PhotoSlotManager
                sanityId={profile.sanityId}
                photos={photos}
                pendingPhotos={pendingPhotos}
                isAdmin={isAdmin}
              />
            </div>
          )}

          {profile?.sanityId && (
            <div style={{ marginTop: "32px" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "16px" }}>
                Mis videos
              </h2>
              <ArtistVideoManager
                sanityId={profile.sanityId}
                videos={videos}
                pendingVideos={pendingVideos}
              />
            </div>
          )}
        </>
      )}

    </div>
  )
}
