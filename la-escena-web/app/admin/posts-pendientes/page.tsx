import { requireAdmin } from "@/lib/auth"
import { getPendingPosts } from "@/lib/sanity"
import Link from "next/link"
import PendingPostsClient from "./PendingPostsClient"

export default async function PostsPendientesPage() {
  await requireAdmin()
  const posts = await getPendingPosts()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-4xl mb-1">Posts pendientes</h1>
          <p className="text-sm text-zinc-500">Posts enviados por artistas para revisión</p>
        </div>
        <Link href="/admin" className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors">← Admin</Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
          <p className="text-zinc-500">No hay posts pendientes de revisión</p>
        </div>
      ) : (
        <PendingPostsClient posts={posts} />
      )}
    </div>
  )
}
