"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

export default function CreateSanityProfileButton({ artistProfileId }: { artistProfileId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCreate = async () => {
    setLoading(true)
    setError("")

    const res = await fetch(`/api/admin/artists/${artistProfileId}/create-sanity`, {
      method: "POST",
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Error al crear perfil en Sanity")
      return
    }

    startTransition(() => router.refresh())
  }

  return (
    <div className="mt-4 flex flex-col gap-2">
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <button
        onClick={handleCreate}
        disabled={loading || isPending}
        className="self-start px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
      >
        {loading || isPending ? "Creando..." : "Crear perfil en Sanity"}
      </button>
    </div>
  )
}
