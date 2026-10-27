"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"

const TiptapEditor = dynamic(() => import("@/app/components/TiptapEditor"), { ssr: false })

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/\p{M}/gu,"").replace(/\s+/g,"-").replace(/[^\w-]/g,"").slice(0,96)
}

export default function ArtistaCreatePostPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [bodyBlocks, setBodyBlocks] = useState<any[]>([])

  const inputClass = "w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-800 bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    formData.set("slug", slug || slugify(title))
    formData.set("body", JSON.stringify(bodyBlocks))

    const res = await fetch("/api/artista/blog/create", { method: "POST", body: formData })
    const data = await res.json()
    setSaving(false)

    if (!res.ok) {
      setMessage({ type: "error", text: data.error || "Error al enviar" })
      return
    }

    setMessage({ type: "success", text: "Post enviado para revisión. El equipo lo publicará pronto." })
    setTimeout(() => router.push("/artista"), 2500)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/artista" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 mb-6 transition-colors">
        ← Volver al portal
      </Link>

      <h1 className="font-heading text-3xl mb-2">Crear publicación</h1>
      <p className="text-sm text-zinc-500 mb-8">Tu publicación será revisada por el equipo antes de aparecer en el blog.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
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
              if (!slug) setSlug(slugify(e.target.value))
            }}
            className={inputClass}
            placeholder="Título de tu publicación"
          />
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
            placeholder="Breve descripción de tu publicación"
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
            className={inputClass}
            placeholder="Ej: Tips, Tendencias, Mi experiencia..."
          />
        </div>

        {/* Contenido */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">
            Contenido <span className="text-red-500">*</span>
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
            Imagen principal (opcional)
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
            Imagen al fondo del post (opcional)
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
          disabled={saving}
          className="w-full px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Enviando..." : "Enviar para revisión"}
        </button>
      </form>
    </div>
  )
}
