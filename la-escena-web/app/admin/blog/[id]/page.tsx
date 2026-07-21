export const dynamic = "force-dynamic"

import { requireAdmin } from "@/lib/auth"
import { getPostById, urlFor } from "@/lib/sanity"
import EditPostForm from "./EditPostForm"
import Link from "next/link"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditBlogPostPage({ params }: Props) {
  await requireAdmin()
  const { id } = await params

  const post = await getPostById(id)

  if (!post) {
    return (
      <div>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 mb-6 transition-colors"
        >
          ← Volver al Blog
        </Link>
        <p className="text-zinc-500">Post no encontrado.</p>
      </div>
    )
  }

  const currentImageUrl = post.mainImage
    ? urlFor(post.mainImage).width(600).height(300).fit("crop").url()
    : null

  return <EditPostForm post={post} currentImageUrl={currentImageUrl} backHref="/admin/blog" />
}
