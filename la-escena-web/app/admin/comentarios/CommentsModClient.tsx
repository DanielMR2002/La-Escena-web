"use client"

import { useState } from "react"

interface CommentItem {
  _id: string
  authorName: string
  body: string
  createdAt: string
  postTitle?: string
  parentBody?: string
}

export default function CommentsModClient({ comments: initial }: { comments: CommentItem[] }) {
  const [comments, setComments] = useState(initial)
  const [loading, setLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Eliminar este comentario?")) return
    setLoading(id)
    const res = await fetch("/api/admin/comments/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    setLoading(null)
    if (!res.ok) { setMessage("Error al eliminar"); return }
    setComments(c => c.filter(cm => cm._id !== id))
    setMessage("Comentario eliminado")
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div className="space-y-4">
      {message && (
        <div className="px-4 py-3 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200">{message}</div>
      )}
      {comments.length === 0 && (
        <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
          <p className="text-zinc-500">No hay comentarios publicados aún</p>
        </div>
      )}
      {comments.map(cm => (
        <div key={cm._id} className="bg-white border border-zinc-200 rounded-xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-zinc-900 text-sm">{cm.authorName}</span>
                <span className="text-zinc-400 text-xs">·</span>
                <span className="text-zinc-500 text-xs">{new Date(cm.createdAt).toLocaleDateString("es-CO")}</span>
                {cm.postTitle && (
                  <>
                    <span className="text-zinc-400 text-xs">en</span>
                    <span className="text-xs text-zinc-500 truncate max-w-[180px]">{cm.postTitle}</span>
                  </>
                )}
              </div>
              {cm.parentBody && (
                <p className="text-xs text-zinc-400 italic border-l-2 border-zinc-200 pl-2 mb-2 line-clamp-1">
                  Respondiendo a: {cm.parentBody}
                </p>
              )}
              <p className="text-sm text-zinc-700">{cm.body}</p>
            </div>
            <button
              onClick={() => handleDelete(cm._id)}
              disabled={loading === cm._id}
              className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 shrink-0"
            >
              {loading === cm._id ? "..." : "Eliminar"}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
