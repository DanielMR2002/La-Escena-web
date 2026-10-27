"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { PenLine } from "lucide-react"

export default function BlogPublishButton() {
  const { data: session } = useSession()
  const role = (session?.user as any)?.role

  if (role !== "ARTIST" && role !== "ADMIN") return null

  return (
    <Link
      href="/artista/blog/create"
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      <PenLine size={15} />
      Publicar
    </Link>
  )
}
