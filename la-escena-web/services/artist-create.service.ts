import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function createArtist(
  email: string,
  password: string
) {
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "ARTIST",
      artistProfile: {
        create: {
          status: "PENDING"
        }
      }
    },
    include: {
      artistProfile: true
    }
  })

  return user
}
