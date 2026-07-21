import { prisma } from "@/lib/prisma"

export async function getClients() {
  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    include: {
      clientAccess: true,
      clientShortlists: {
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // Clients with pending shortlist first, preserving relative order within each group
  return clients.sort((a, b) =>
    (b.clientShortlists.length > 0 ? 1 : 0) - (a.clientShortlists.length > 0 ? 1 : 0)
  )
}

export async function getClientById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      clientAccess: {
        include: {
          artist: {
            include: { artistProfile: true }
          }
        }
      },
      clientShortlists: {
        where: { status: { in: ["PENDING", "APPROVED"] } },
        orderBy: { createdAt: "desc" },
      },
    }
  })
}
