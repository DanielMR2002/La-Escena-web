"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function InboxNavLink() {
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    fetch("/api/me")
      .then(r => r.json())
      .then(data => setUnread(data.unreadMessages ?? 0))
      .catch(() => {})
  }, [])

  useEffect(() => {
    function handleRead() {
      setUnread(prev => Math.max(0, prev - 1))
    }
    window.addEventListener("la-escena:message-read", handleRead)
    return () => window.removeEventListener("la-escena:message-read", handleRead)
  }, [])

  return (
    <Link href="/artista/mensajes" className="relative text-sm text-zinc-300 hover:text-white transition-colors">
      Buzón
      {unread > 0 && (
        <span className="absolute -top-2 -right-3 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-primary text-[0.65rem] font-bold text-white">
          {unread}
        </span>
      )}
    </Link>
  )
}
