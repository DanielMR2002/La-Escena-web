"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CreateBlogPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const form = e.currentTarget
    const formData = new FormData(form)

    const res = await fetch("/api/admin/blog/create", {
      method: "POST",
      body: formData,
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setMessage({ type: "error", text: data.error || "Error al crear el post" })
      return
    }

    router.push(`/admin/blog/${data.id}`)
  }

  return (
    <div>
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 mb-6 transition-colors"
      >
        ← Volver al Blog
      </Link>

      <h1 className="font-heading text-4xl mb-8">Nuevo Post</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-zinc-200 p-6 max-w-2xl space-y-5">
        {message && (
          <div className={`px-4 py-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {message.text}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            type="text"
            required
            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">
            Resumen <span className="text-zinc-400">(máx. 160 caracteres)</span>
          </label>
          <textarea
            name="excerpt"
            rows={2}
            maxLength={160}
            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">
            Contenido
          </label>
          <textarea
            name="body"
            rows={12}
            placeholder="Escribe el contenido aquí. Separa los párrafos con una línea en blanco."
            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">
            Imagen principal
          </label>
          <input
            name="file"
            type="file"
            accept="image/*"
            className="w-full text-sm text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-zinc-200 file:text-xs file:font-medium file:text-zinc-600 file:bg-white hover:file:bg-zinc-50"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Publicando..." : "Publicar Post"}
        </button>
      </form>
    </div>
  )
}
