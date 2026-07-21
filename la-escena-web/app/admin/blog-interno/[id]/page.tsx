export const dynamic = "force-dynamic"

import { requireAdmin } from "@/lib/auth"
import { getInternalPostById, urlFor } from "@/lib/sanity"
import EditPostForm from "@/app/admin/blog/[id]/EditPostForm"
import Link from "next/link"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditInternalPostPage({ params }: Props) {
  await requireAdmin()
  const { id } = await params

  const post = await getInternalPostById(id)

  if (!post) {
    return (
      <div>
        <Link
          href="/admin/blog-interno"
          className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 mb-6 transition-colors"
        >
          ← Volver a Noticias
        </Link>
        <p className="text-zinc-500">Noticia no encontrada.</p>
      </div>
    )
  }

  const currentImageUrl = post.mainImage
    ? urlFor(post.mainImage).width(600).height(300).fit("crop").url()
    : null

  return (
    <EditPostForm
      post={post}
      currentImageUrl={currentImageUrl}
      backHref="/admin/blog-interno"
      updateEndpoint={`/api/admin/blog-interno/${post._id}/update`}
      deleteEndpoint={`/api/admin/blog-interno/${post._id}/delete`}
    />
  )
}
