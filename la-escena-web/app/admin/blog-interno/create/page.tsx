"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"

const TiptapEditor = dynamic(() => import("@/app/components/TiptapEditor"), { ssr: false })

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .slice(0, 96)
}

export default function CreateInternalPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [bodyBlocks, setBodyBlocks] = useState<any[]>([])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const form = e.currentTarget
    const formData = new FormData(form)
    formData.set("slug", slug)
    formData.set("body", JSON.stringify(bodyBlocks))

    const res = await fetch("/api/admin/blog-interno/create", {
      method: "POST",
      body: formData,
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setMessage({ type: "error", text: data.error || "Error al crear la noticia" })
      return
    }

    router.push(`/admin/blog-interno/${data.id}`)
  }

  const inputClass = "w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-800 bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"

  return (
    <div>
      <Link
        href="/admin/blog-interno"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 mb-6 transition-colors"
      >
        ← Volver a Noticias
      </Link>

      <h1 className="font-heading text-4xl mb-8">Nueva Noticia Interna</h1>

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

        {/* Título */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            type="text"
            required
            value={title}
            onChange={e => {
              setTitle(e.target.value)
              setSlug(slugify(e.target.value))
            }}
            className={inputClass}
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">
            Slug (URL) <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={slug}
              onChange={e => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""))}
              required
              className={`${inputClass} flex-1 font-mono text-xs`}
            />
            <button
              type="button"
              onClick={() => setSlug(slugify(title))}
              className="px-3 py-2 text-xs font-medium text-zinc-700 border border-zinc-300 rounded-lg hover:bg-zinc-100 transition-colors shrink-0"
            >
              ↺ Regenerar
            </button>
          </div>
          <p className="text-xs text-zinc-400 mt-1">Slug: <span className="font-mono">{slug || "..."}</span></p>
        </div>

        {/* Resumen */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">
            Resumen <span className="text-zinc-400">(máx. 160 caracteres)</span>
          </label>
          <textarea
            name="excerpt"
            rows={2}
            maxLength={160}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">
            Categoría
          </label>
          <input
            name="category"
            type="text"
            placeholder="Ej: Noticias, Anuncios, Tips..."
            className={inputClass}
          />
        </div>

        {/* Contenido */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">
            Contenido
          </label>
          <TiptapEditor
            content={bodyBlocks}
            onChange={setBodyBlocks}
            placeholder="Escribe el contenido aquí..."
          />
        </div>

        {/* Imagen principal */}
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

        {/* Imagen al fondo */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">
            Imagen al fondo del post
          </label>
          <input
            name="bottomFile"
            type="file"
            accept="image/*"
            className="w-full text-sm text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-zinc-200 file:text-xs file:font-medium file:text-zinc-600 file:bg-white hover:file:bg-zinc-50"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Publicando..." : "Publicar Noticia"}
        </button>
      </form>
    </div>
  )
}
