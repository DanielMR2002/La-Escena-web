import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash("cliente123", 10)

  await prisma.user.create({
    data: {
      email: "cliente@agencia.com",
      password: hashedPassword,
      role: "CLIENT",
      slug: "daniel"
    }
  })

  console.log("✅ Cliente creado correctamente")
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
