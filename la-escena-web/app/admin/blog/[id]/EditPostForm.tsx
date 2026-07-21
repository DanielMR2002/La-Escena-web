"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Post {
  _id: string
  title: string
  slug: string | null
  excerpt?: string
  body?: any[]
}

interface Props {
  post: Post
  currentImageUrl: string | null
  backHref: string
  updateEndpoint?: string
  deleteEndpoint?: string
}

function blocksToText(blocks: any[] | undefined): string {
  if (!blocks?.length) return ""
  return blocks
    .map(b => b.children?.map((c: any) => c.text || "").join("") || "")
    .join("\n\n")
}

export default function EditPostForm({
  post,
  currentImageUrl,
  backHref,
  updateEndpoint,
  deleteEndpoint,
}: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const resolvedUpdate = updateEndpoint ?? `/api/admin/blog/${post._id}/update`
  const resolvedDelete = deleteEndpoint ?? `/api/admin/blog/${post._id}/delete`

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)

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

  return (
    <div>
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 mb-6 transition-colors"
      >
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

        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            type="text"
            required
            defaultValue={post.title}
            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {post.slug && (
          <p className="text-xs text-zinc-400">
            Slug: <span className="font-mono">{post.slug}</span>
          </p>
        )}

        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">
            Resumen <span className="text-zinc-400">(máx. 160 caracteres)</span>
          </label>
          <textarea
            name="excerpt"
            rows={2}
            maxLength={160}
            defaultValue={post.excerpt ?? ""}
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
            defaultValue={blocksToText(post.body)}
            placeholder="Separa los párrafos con una línea en blanco."
            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">
            Imagen principal
          </label>
          {currentImageUrl && (
            <img
              src={currentImageUrl}
              alt="Imagen actual"
              className="w-full max-w-sm rounded-lg mb-2 object-cover"
            />
          )}
          <input
            name="file"
            type="file"
            accept="image/*"
            className="w-full text-sm text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-zinc-200 file:text-xs file:font-medium file:text-zinc-600 file:bg-white hover:file:bg-zinc-50"
          />
          {currentImageUrl && (
            <p className="text-xs text-zinc-400 mt-1">
              Selecciona un archivo para reemplazar la imagen actual.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  )
}
