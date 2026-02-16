import { prisma } from "@/lib/prisma"

export async function getClients() {
  return prisma.user.findMany({
    where: { role: "CLIENT" }
  })
}
