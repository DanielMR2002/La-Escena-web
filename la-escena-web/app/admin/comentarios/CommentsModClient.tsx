"use client"

import { useState } from "react"

interface PendingComment {
  _id: string
  authorName: string
  body: string
  createdAt: string
  postTitle?: string
  postId?: string
  parentBody?: string
}

export default function CommentsModClient({ comments: initial }: { comments: PendingComment[] }) {
  const [comments, setComments] = useState(initial)
  const [loading, setLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handle = async (id: string, action: "approve" | "reject") => {
    setLoading(id + action)
    setMessage(null)
    const res = await fetch("/api/admin/comments/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    })
    setLoading(null)
    if (!res.ok) { setMessage("Error al procesar"); return }
    setComments(c => c.filter(cm => cm._id !== id))
    setMessage(action === "approve" ? "Comentario aprobado" : "Comentario rechazado")
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div className="space-y-4">
      {message && (
        <div className="px-4 py-3 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200">{message}</div>
      )}
      {comments.length === 0 && (
        <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
          <p className="text-zinc-500">No hay comentarios pendientes</p>
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
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handle(cm._id, "approve")}
                disabled={loading !== null}
                className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading === cm._id + "approve" ? "..." : "Aprobar"}
              </button>
              <button
                onClick={() => handle(cm._id, "reject")}
                disabled={loading !== null}
                className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {loading === cm._id + "reject" ? "..." : "Rechazar"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
