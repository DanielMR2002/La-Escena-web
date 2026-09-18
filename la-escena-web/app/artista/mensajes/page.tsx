export const dynamic = "force-dynamic"

import { requireArtistOrAdmin } from "@/lib/auth"
import { listArtistMessages } from "@/services/message.service"
import MessagesList from "@/app/artista/MessagesList"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Buzón | Portal Artista",
}

export default async function ArtistMessagesPage() {
  const session = await requireArtistOrAdmin()

  const recipients = await listArtistMessages(session.user.id)

  const messages = recipients.map(r => ({
    recipientId: r.id,
    subject: r.message.subject,
    body: r.message.body,
    createdAt: r.message.createdAt.toISOString(),
    readAt: r.readAt ? r.readAt.toISOString() : null,
  }))

  return (
    <>
      <section className="bg-foreground py-20">
        <div className="container text-center space-y-4">
          <h1 className="font-heading text-5xl sm:text-7xl tracking-wide text-primary-foreground">
            Mi <span className="text-secondary">Buzón</span>
          </h1>
          <p className="text-primary-foreground/60 max-w-lg mx-auto">
            Mensajes enviados por el equipo de La Escena.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
          <MessagesList messages={messages} />
        </div>
      </section>
    </>
  )
}
