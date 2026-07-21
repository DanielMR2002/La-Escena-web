import { prisma } from "@/lib/prisma"
import { sanityWriteClient } from "@/lib/sanity"

export async function ensureAdminArtistProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { artistProfile: true },
  })

  if (!user) throw new Error("User not found")

  if (user.artistProfile?.sanityId) {
    return { profile: user.artistProfile, created: false }
  }

  let profile = user.artistProfile
  if (!profile) {
    profile = await prisma.artistProfile.create({
      data: { userId, status: "APPROVED" },
    })
  }

  const displayName = user.name || user.email
  const slugBase = displayName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

  const doc = await sanityWriteClient.create({
    _type:    "artist",
    name:     displayName,
    slug:     { _type: "slug", current: slugBase },
    visible:  false,
    featured: false,
  })

  profile = await prisma.artistProfile.update({
    where: { id: profile.id },
    data:  { sanityId: doc._id },
  })

  return { profile, created: true }
}
