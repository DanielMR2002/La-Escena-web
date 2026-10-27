"use client"

import { useState } from "react"

interface PendingPost {
  _id: string
  title: string
  slug: string | null
  excerpt?: string
  publishedAt: string
  authorName?: string
  category?: string
}

export default function PendingPostsClient({ posts: initial }: { posts: PendingPost[] }) {
  const [posts, setPosts] = useState(initial)
  const [loading, setLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handle = async (id: string, action: "approve" | "reject") => {
    setLoading(id + action)
    setMessage(null)
    const res = await fetch("/api/admin/blog/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    })
    setLoading(null)
    if (!res.ok) { setMessage("Error al procesar"); return }
    setPosts(p => p.filter(post => post._id !== id))
    setMessage(action === "approve" ? "Post publicado" : "Post eliminado")
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div className="space-y-4">
      {message && (
        <div className="px-4 py-3 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200">{message}</div>
      )}
      {posts.length === 0 && (
        <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
          <p className="text-zinc-500">No hay posts pendientes</p>
        </div>
      )}
      {posts.map(post => (
        <div key={post._id} className="bg-white border border-zinc-200 rounded-xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium text-zinc-900 truncate">{post.title}</p>
              <p className="text-sm text-zinc-500 mt-0.5">
                Por {post.authorName || "Artista"} · {new Date(post.publishedAt).toLocaleDateString("es-CO")}
                {post.category && <span className="ml-2 px-2 py-0.5 rounded-full bg-zinc-100 text-xs">{post.category}</span>}
              </p>
              {post.excerpt && <p className="text-sm text-zinc-600 mt-2 line-clamp-2">{post.excerpt}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handle(post._id, "approve")}
                disabled={loading !== null}
                className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading === post._id + "approve" ? "..." : "Publicar"}
              </button>
              <button
                onClick={() => handle(post._id, "reject")}
                disabled={loading !== null}
                className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {loading === post._id + "reject" ? "..." : "Rechazar"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
