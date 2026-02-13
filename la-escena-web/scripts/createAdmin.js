import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import "dotenv/config"

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10)

  await prisma.user.create({
    data: {
      email: "admin@agencia.com",
      password: hashedPassword,
      role: "ADMIN"
    }
  })

  console.log("✅ Admin creado correctamente")
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
