import { requireAdmin } from "@/lib/auth"
import { getAllComments } from "@/lib/sanity"
import Link from "next/link"
import CommentsModClient from "./CommentsModClient"

export default async function ComentariosPage() {
  await requireAdmin()
  const comments = await getAllComments()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-4xl mb-1">Comentarios</h1>
          <p className="text-sm text-zinc-500">Gestiona los comentarios publicados en el blog</p>
        </div>
        <Link href="/admin" className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors">← Admin</Link>
      </div>

      <CommentsModClient comments={comments} />
    </div>
  )
}
