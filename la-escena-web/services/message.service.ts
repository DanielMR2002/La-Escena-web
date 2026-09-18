import { prisma } from "@/lib/prisma"
import { sendMail } from "@/lib/mailer"
import { MessageAudience } from "@prisma/client"

export async function sendAdminMessage(params: {
  sentById: string
  subject: string
  body: string
  audience: MessageAudience
  recipientUserIds?: string[]
}) {
  const { sentById, subject, body, audience, recipientUserIds } = params

  const recipients = (
    audience === "ALL"
      ? await prisma.user.findMany({
          where: { role: { in: ["ARTIST", "ADMIN"] } },
          select: { id: true, email: true },
        })
      : await prisma.user.findMany({
          where: { id: { in: recipientUserIds ?? [] } },
          select: { id: true, email: true },
        })
  ).filter(r => r.id !== sentById)

  const message = await prisma.adminMessage.create({
    data: {
      subject,
      body,
      audience,
      sentById,
      recipients: {
        create: recipients.map(r => ({ userId: r.id })),
      },
    },
  })

  const emailResults = await Promise.allSettled(
    recipients.map(r =>
      sendMail({
        to: r.email,
        subject: `Nuevo mensaje: ${subject}`,
        html: `
          <h3>Tienes un nuevo mensaje en tu buzón de La Escena</h3>
          <p><strong>${subject}</strong></p>
          <p>Ingresa a tu buzón en La Escena para leerlo.</p>
        `,
      })
    )
  )

  const emailFailures = emailResults.filter(r => r.status === "rejected").length

  return { message, recipientCount: recipients.length, emailFailures }
}

export async function listAdminMessages() {
  return prisma.adminMessage.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { recipients: true } },
    },
  })
}

export async function listArtistMessages(artistUserId: string) {
  return prisma.messageRecipient.findMany({
    where: { userId: artistUserId },
    orderBy: { message: { createdAt: "desc" } },
    include: { message: true },
  })
}

export async function countUnreadMessages(artistUserId: string) {
  return prisma.messageRecipient.count({
    where: { userId: artistUserId, readAt: null },
  })
}

export async function markMessageRead(artistUserId: string, recipientId: string) {
  const recipient = await prisma.messageRecipient.findUnique({
    where: { id: recipientId },
  })

  if (!recipient || recipient.userId !== artistUserId) {
    throw new Error("Not found")
  }

  if (recipient.readAt) return recipient

  return prisma.messageRecipient.update({
    where: { id: recipientId },
    data: { readAt: new Date() },
  })
}
