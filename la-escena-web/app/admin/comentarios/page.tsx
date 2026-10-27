import { requireAdmin } from "@/lib/auth"
import { getPendingComments } from "@/lib/sanity"
import Link from "next/link"
import CommentsModClient from "./CommentsModClient"

export default async function ComentariosPage() {
  await requireAdmin()
  const comments = await getPendingComments()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-4xl mb-1">Comentarios pendientes</h1>
          <p className="text-sm text-zinc-500">Aprueba o rechaza los comentarios del blog</p>
        </div>
        <Link href="/admin" className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors">← Admin</Link>
      </div>

      {comments.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
          <p className="text-zinc-500">No hay comentarios pendientes</p>
        </div>
      ) : (
        <CommentsModClient comments={comments} />
      )}
    </div>
  )
}
