import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function createClientWithArtists(
  email: string,
  password: string,
  artistIds: string[]
) {
  const hashedPassword = await bcrypt.hash(password, 10)

  const client = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "CLIENT"
    }
  })

  if (artistIds.length > 0) {
    await prisma.clientArtistAccess.createMany({
      data: artistIds.map((artistId) => ({
        clientId: client.id,
        artistId
      }))
    })
  }

  return client
}
