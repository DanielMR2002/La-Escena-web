import { prisma } from "@/lib/prisma"


const clients = await prisma.user.findMany({
  where: { role: "CLIENT" }
})
