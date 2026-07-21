import { prisma } from "@/lib/prisma"
import { sanityWriteClient } from "@/lib/sanity"
import bcrypt from "bcrypt"

export async function createArtist(email: string, password: string) {
  const existingUser = await prisma.user.findUnique({ where: { email } })

  if (existingUser) {
    throw new Error("El email ya está registrado")
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  // 1️⃣ User + ArtistProfile en una sola transacción — siempre aparece en la lista
  const { user, artistProfile } = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email, password: hashedPassword, role: "ARTIST" },
    })

    const artistProfile = await tx.artistProfile.create({
      data: { userId: user.id, status: "APPROVED", sanityId: null },
    })

    return { user, artistProfile }
  })

  // 2️⃣ Sanity es best-effort: si falla, el artista igual queda en Prisma
  try {
    const sanityDoc = await sanityWriteClient.create({
      _type: "artist",
      name: email.split("@")[0],
      slug: {
        _type: "slug",
        current: email.split("@")[0] + "-" + Date.now(),
      },
      photos: [],
      category: "bailarin",
      styles: [],
      description: "",
      experience: 0,
      city: "",
      age: null,
      height: null,
      hashtags: [],
      artistAvailability: true,
      visible: true,
    })

    await prisma.artistProfile.update({
      where: { id: artistProfile.id },
      data: { sanityId: sanityDoc._id },
    })

    return { user, artistProfile: { ...artistProfile, sanityId: sanityDoc._id } }

  } catch (sanityError) {
    console.error("Sanity create failed — artist saved in Prisma without sanityId:", sanityError)
    return { user, artistProfile }
  }
}
