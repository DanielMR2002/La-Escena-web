"use client"

import { useRouter } from "next/navigation"

export default function RevisionActions({ id }: { id: string }) {
  const router = useRouter()

  async function approve() {
    const res = await fetch("/api/admin/artists/revisions/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })

    if (!res.ok) {
      alert("Error al aprobar la revisión")
      return
    }

    router.refresh()
  }

  async function reject() {
    const comment = prompt("Motivo del rechazo (opcional):")
    if (comment === null) return

    const res = await fetch("/api/admin/artists/revisions/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, comment }),
    })

    if (!res.ok) {
      alert("Error al rechazar la revisión")
      return
    }

    router.refresh()
  }

  return (
    <div className="flex gap-2 pt-4 border-t border-zinc-100">
      <button
        onClick={approve}
        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
      >
        Aprobar
      </button>
      <button
        onClick={reject}
        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
      >
        Rechazar
      </button>
    </div>
  )
}
