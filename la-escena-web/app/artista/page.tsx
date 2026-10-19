export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { requireArtistOrAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sanityFreshClient } from "@/lib/sanity"
import { ensureAdminArtistProfile } from "@/services/admin-profile.service"

export default async function ArtistDashboard() {
  const session = await requireArtistOrAdmin()

  let profile = await prisma.artistProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (session.user.role === "ADMIN" && !profile?.sanityId) {
    const result = await ensureAdminArtistProfile(session.user.id)
    profile = result.profile
  }

  if (profile?.sanityId) {
    const sanity = await sanityFreshClient.fetch(
      `*[_type == "artist" && _id == $id][0]{ "slug": slug.current }`,
      { id: profile.sanityId }
    )
    if (sanity?.slug) {
      redirect(`/artistas/${sanity.slug}`)
    }
  }

  // Fallback: profile not in Sanity yet, go to edit page
  redirect("/artista/editar")
}
