"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"

interface Reply {
  _id: string
  authorName: string
  body: string
  createdAt: string
}

interface Comment {
  _id: string
  authorName: string
  body: string
  createdAt: string
  replies: Reply[]
}

interface Props {
  postId: string
  initialComments: Comment[]
  isAdmin?: boolean
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })
}

export default function BlogComments({ postId, initialComments, isAdmin = false }: Props) {
  const { data: session } = useSession()
  const [comments, setComments] = useState(initialComments)
  const [body, setBody] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyBody, setReplyBody] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitComment = async (parentCommentId?: string) => {
    const text = parentCommentId ? replyBody : body
    if (!text.trim()) return
    setSending(true)
    setError(null)

    const res = await fetch("/api/comments/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, body: text, parentCommentId }),
    })

    setSending(false)

    if (!res.ok) {
      const d = await res.json()
      setError(d.error || "Error al enviar")
      return
    }

    const data = await res.json()
    const newComment = {
      _id: data.id,
      authorName: (session?.user as any)?.name || (session?.user as any)?.email || "Tú",
      body: text.trim(),
      createdAt: new Date().toISOString(),
    }

    if (parentCommentId) {
      setComments(prev => prev.map(c =>
        c._id === parentCommentId
          ? { ...c, replies: [...c.replies, newComment] }
          : c
      ))
      setReplyBody("")
      setReplyingTo(null)
    } else {
      setComments(prev => [...prev, { ...newComment, replies: [] }])
      setBody("")
    }
  }

  const deleteComment = async (id: string, parentId?: string) => {
    if (!window.confirm("¿Eliminar este comentario?")) return
    const res = await fetch("/api/admin/comments/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    if (!res.ok) return

    if (parentId) {
      setComments(prev => prev.map(c =>
        c._id === parentId
          ? { ...c, replies: c.replies.filter(r => r._id !== id) }
          : c
      ))
    } else {
      setComments(prev => prev.filter(c => c._id !== id))
    }
  }

  return (
    <section className="mt-12 pt-10 border-t border-zinc-200">
      <h2 className="text-xl font-semibold mb-6">
        Comentarios {comments.length > 0 && <span className="text-zinc-400 font-normal text-base">({comments.length})</span>}
      </h2>

      {/* Lista de comentarios */}
      {comments.length > 0 && (
        <div className="space-y-6 mb-10">
          {comments.map(cm => (
            <div key={cm._id}>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-500 shrink-0 mt-0.5">
                  {cm.authorName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-zinc-900">{cm.authorName}</span>
                    <span className="text-xs text-zinc-400">{formatDate(cm.createdAt)}</span>
                  </div>
                  <p className="text-sm text-zinc-700 leading-relaxed">{cm.body}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    {session && (
                      <button
                        onClick={() => setReplyingTo(replyingTo === cm._id ? null : cm._id)}
                        className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
                      >
                        {replyingTo === cm._id ? "Cancelar" : "Responder"}
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => deleteComment(cm._id)}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>

                  {/* Formulario de respuesta */}
                  {replyingTo === cm._id && (
                    <div className="mt-3 flex gap-2">
                      <textarea
                        value={replyBody}
                        onChange={e => setReplyBody(e.target.value)}
                        rows={2}
                        placeholder="Escribe tu respuesta..."
                        className="flex-1 px-3 py-2 text-sm border border-zinc-200 rounded-lg resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-zinc-800 bg-white"
                      />
                      <button
                        onClick={() => submitComment(cm._id)}
                        disabled={sending || !replyBody.trim()}
                        className="px-3 py-2 text-xs font-medium bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-40 shrink-0 self-end"
                      >
                        {sending ? "..." : "Enviar"}
                      </button>
                    </div>
                  )}

                  {/* Respuestas anidadas */}
                  {cm.replies.length > 0 && (
                    <div className="mt-4 space-y-3 pl-4 border-l-2 border-zinc-100">
                      {cm.replies.map(r => (
                        <div key={r._id} className="flex gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-400 shrink-0 mt-0.5">
                            {r.authorName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-medium text-xs text-zinc-900">{r.authorName}</span>
                              <span className="text-xs text-zinc-400">{formatDate(r.createdAt)}</span>
                            </div>
                            <p className="text-sm text-zinc-700 leading-relaxed">{r.body}</p>
                            {isAdmin && (
                              <button
                                onClick={() => deleteComment(r._id, cm._id)}
                                className="mt-1 text-xs text-red-400 hover:text-red-600 transition-colors"
                              >
                                Eliminar
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {comments.length === 0 && (
        <p className="text-sm text-zinc-400 mb-8">Sé el primero en comentar.</p>
      )}

      {/* Formulario nuevo comentario */}
      {session ? (
        <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-5">
          <p className="text-sm font-medium text-zinc-700 mb-3">
            Comentar como <span className="text-zinc-900">{(session?.user as any)?.name || (session?.user as any)?.email}</span>
          </p>
          {error && (
            <div className="mb-3 px-3 py-2 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">{error}</div>
          )}
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={3}
            placeholder="Escribe tu comentario..."
            className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-zinc-800 bg-white"
          />
          <button
            onClick={() => submitComment()}
            disabled={sending || !body.trim()}
            className="mt-3 px-4 py-2 text-sm font-medium bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-40"
          >
            {sending ? "Publicando..." : "Publicar comentario"}
          </button>
        </div>
      ) : (
        <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-5 text-center">
          <p className="text-sm text-zinc-500">
            <a href="/login" className="text-zinc-900 font-medium hover:underline">Inicia sesión</a>{" "}
            para dejar un comentario.
          </p>
        </div>
      )}
    </section>
  )
}
