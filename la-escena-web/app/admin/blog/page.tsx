export const dynamic = "force-dynamic"

import Link from "next/link"
import { requireAdmin } from "@/lib/auth"
import { getPosts } from "@/lib/sanity"

export default async function AdminBlogPage() {
  await requireAdmin()

  const posts = await getPosts()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-4xl">Blog</h1>
        <Link href="/admin/blog/create">
          <button className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-red-700 transition-colors">
            + Nuevo Post
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50">
              <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide px-6 py-4">
                Título
              </th>
              <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide px-6 py-4">
                Fecha
              </th>
              <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide px-6 py-4">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post: any) => (
              <tr key={post._id} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-zinc-800">{post.title}</p>
                  {post.excerpt && (
                    <p className="text-xs text-zinc-400 mt-0.5 max-w-sm truncate">{post.excerpt}</p>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-500 whitespace-nowrap">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </td>
                <td className="px-6 py-4">
                  <Link href={`/admin/blog/${post._id}`}>
                    <button className="px-3 py-1.5 text-xs font-medium border border-zinc-300 rounded-lg hover:bg-zinc-100 transition-colors">
                      Editar
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {posts.length === 0 && (
          <p className="text-center text-zinc-400 py-12 text-sm">
            No hay posts publicados aún.
          </p>
        )}
      </div>
    </div>
  )
}
