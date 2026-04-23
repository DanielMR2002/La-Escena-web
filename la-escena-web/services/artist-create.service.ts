import { prisma } from "@/lib/prisma"
import { sanityWriteClient } from "@/lib/sanity"
import bcrypt from "bcrypt"

export async function createArtist(
  email: string,
  password: string
) {
  // 🔎 1️⃣ Verificar si ya existe el email
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw new Error("El email ya está registrado")
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  // 2️⃣ Crear usuario
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "ARTIST"
    }
  })

  // 3️⃣ Crear documento completo en Sanity
  const sanityDoc = await sanityWriteClient.create({
    _type: "artist",

    // IDENTIDAD
    name: email.split("@")[0],
    slug: {
      _type: "slug",
      current: email.split("@")[0] + "-" + Date.now()
    },
    photos: [],

    // PERFIL
    category: "bailarin",
    styles: [],
    description: "",
    experience: 0,

    // FILTROS
    city: "",
    age: null,
    height: null,
    hashtags: [],

    // CONTROL
    artistAvailability: true,
    visible: true
  })

  // 4️⃣ Crear ArtistProfile
  const artistProfile = await prisma.artistProfile.create({
    data: {
      userId: user.id,
      status: "APPROVED",
      sanityId: sanityDoc._id
    }
  })

  return {
    user,
    artistProfile
  }
}