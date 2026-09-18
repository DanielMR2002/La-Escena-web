"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, MailOpen, ChevronDown } from "lucide-react"

interface ArtistMessage {
  recipientId: string
  subject: string
  body: string
  createdAt: string
  readAt: string | null
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5 },
  }),
}

export default function MessagesList({ messages: initial }: { messages: ArtistMessage[] }) {
  const [messages, setMessages] = useState(initial)
  const [openId, setOpenId] = useState<string | null>(null)

  async function toggle(recipientId: string, readAt: string | null) {
    setOpenId(prev => (prev === recipientId ? null : recipientId))

    if (!readAt) {
      setMessages(prev =>
        prev.map(m => (m.recipientId === recipientId ? { ...m, readAt: new Date().toISOString() } : m))
      )
      window.dispatchEvent(new CustomEvent("la-escena:message-read"))
      try {
        await fetch(`/api/artist/messages/${recipientId}/read`, { method: "POST" })
      } catch {}
    }
  }

  if (messages.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-20">
        No tienes mensajes en tu buzón.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((m, i) => {
        const isRead = !!m.readAt
        const isOpen = openId === m.recipientId

        return (
          <motion.article
            key={m.recipientId}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={i}
            className={`bg-card rounded-lg border overflow-hidden transition-colors ${
              isRead ? "border-border" : "border-secondary/50"
            }`}
          >
            <button
              onClick={() => toggle(m.recipientId, m.readAt)}
              className="w-full flex items-center gap-4 px-6 py-5 text-left"
            >
              {isRead ? (
                <MailOpen size={18} className="text-muted-foreground shrink-0" />
              ) : (
                <Mail size={18} className="text-secondary shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <p className={`text-sm sm:text-base truncate ${isRead ? "text-foreground/80" : "font-semibold text-foreground"}`}>
                  {m.subject}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(m.createdAt).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {!isRead && (
                <span className="shrink-0 px-2 py-0.5 rounded-full text-[0.68rem] font-semibold bg-secondary/15 text-secondary">
                  Nuevo
                </span>
              )}

              <ChevronDown
                size={16}
                className={`shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isOpen && (
              <div className="px-6 pb-6 pt-0">
                <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap border-t border-border pt-4">
                  {m.body}
                </p>
              </div>
            )}
          </motion.article>
        )
      })}
    </div>
  )
}
