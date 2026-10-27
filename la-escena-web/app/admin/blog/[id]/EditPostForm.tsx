"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"

const TiptapEditor = dynamic(() => import("@/app/components/TiptapEditor"), { ssr: false })

interface Post {
  _id: string
  title: string
  slug: string | null
  excerpt?: string
  category?: string
  body?: any[]
}

interface Props {
  post: Post
  currentImageUrl: string | null
  currentBottomImageUrl: string | null
  backHref: string
  updateEndpoint?: string
  deleteEndpoint?: string
  existingCategories?: string[]
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .slice(0, 96)
}

export default function EditPostForm({
  post,
  currentImageUrl,
  currentBottomImageUrl,
  backHref,
  updateEndpoint,
  deleteEndpoint,
  existingCategories = [],
}: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [title, setTitle] = useState(post.title)
  const [slug, setSlug] = useState(post.slug ?? "")
  const [bodyBlocks, setBodyBlocks] = useState<any[]>(post.body ?? [])

  const resolvedUpdate = updateEndpoint ?? `/api/admin/blog/${post._id}/update`
  const resolvedDelete = deleteEndpoint ?? `/api/admin/blog/${post._id}/delete`

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    formData.set("slug", slug)
    formData.set("body", JSON.stringify(bodyBlocks))

    const res = await fetch(resolvedUpdate, {
      method: "PATCH",
      body: formData,
    })

    const data = await res.json()
    setSaving(false)

    if (!res.ok) {
      setMessage({ type: "error", text: data.error || "Error al guardar" })
      return
    }

    setMessage({ type: "success", text: "Guardado correctamente" })
  }

  const handleDelete = async () => {
    if (!window.confirm("¿Eliminar este post? Esta acción no se puede deshacer.")) return
    setDeleting(true)
    const res = await fetch(resolvedDelete, { method: "DELETE" })
    setDeleting(false)
    if (!res.ok) {
      setMessage({ type: "error", text: "Error al eliminar el post" })
      return
    }
    router.push(backHref)
  }

  const inputClass = "w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-800 bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"

  return (
    <div>
      <Link href={backHref} className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 mb-6 transition-colors">
        ← Volver
      </Link>

      <div className="flex items-start justify-between mb-8">
        <h1 className="font-heading text-4xl">Editar Post</h1>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          {deleting ? "Eliminando..." : "Eliminar post"}
        </button>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-zinc-200 p-6 max-w-2xl space-y-5">
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
            onChange={e => setTitle(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Slug editable */}
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
              className="px-3 py-2 text-xs font-medium border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors shrink-0"
              title="Regenerar slug desde el título"
            >
              ↺ Regenerar
            </button>
          </div>
          <p className="text-xs text-zinc-400 mt-1">URL del post: /blog/<span className="font-mono">{slug || "..."}</span></p>
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
            defaultValue={post.excerpt ?? ""}
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
            list="category-suggestions"
            defaultValue={post.category ?? ""}
            placeholder="Ej: Noticias, Tips, Tendencias..."
            className={inputClass}
          />
          <datalist id="category-suggestions">
            {existingCategories.map(cat => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
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
          {currentImageUrl && (
            <img src={currentImageUrl} alt="Imagen actual" className="w-full max-w-sm rounded-lg mb-2 object-cover" />
          )}
          <input
            name="file"
            type="file"
            accept="image/*"
            className="w-full text-sm text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-zinc-200 file:text-xs file:font-medium file:text-zinc-600 file:bg-white hover:file:bg-zinc-50"
          />
          {currentImageUrl && (
            <p className="text-xs text-zinc-400 mt-1">Selecciona un archivo para reemplazar la imagen actual.</p>
          )}
        </div>

        {/* Imagen al fondo */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">
            Imagen al fondo del post
          </label>
          {currentBottomImageUrl && (
            <img src={currentBottomImageUrl} alt="Imagen al fondo" className="w-full max-w-sm rounded-lg mb-2 object-cover" />
          )}
          <input
            name="bottomFile"
            type="file"
            accept="image/*"
            className="w-full text-sm text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-zinc-200 file:text-xs file:font-medium file:text-zinc-600 file:bg-white hover:file:bg-zinc-50"
          />
          {currentBottomImageUrl && (
            <p className="text-xs text-zinc-400 mt-1">Selecciona un archivo para reemplazar la imagen al fondo.</p>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  )
}
