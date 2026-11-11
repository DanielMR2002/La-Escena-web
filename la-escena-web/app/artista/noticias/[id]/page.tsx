export const dynamic = "force-dynamic"

import { requireArtistOrAdmin } from "@/lib/auth"
import { getInternalPostById, urlFor } from "@/lib/sanity"
import { PortableText } from "@portabletext/react"
import { Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"
import styles from "@/styles/blog.module.css"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function NoticiaDetailPage({ params }: Props) {
  await requireArtistOrAdmin()
  const { id } = await params

  const post = await getInternalPostById(id)
  if (!post) notFound()

  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(500).fit("crop").url()
    : null

  return (
    <>
      <section className="bg-foreground py-20">
        <div className="container max-w-3xl">
          <Link
            href="/artista/noticias"
            className="inline-flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-secondary transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Volver a noticias
          </Link>
          {post.publishedAt && (
            <span className="flex items-center gap-1.5 text-xs text-primary-foreground/40 mb-4">
              <Calendar size={12} />
              {new Date(post.publishedAt).toLocaleDateString("es-CO", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </span>
          )}
          <h1 className="font-heading text-4xl sm:text-5xl tracking-wide text-primary-foreground">
            {post.title}
          </h1>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container max-w-3xl">
          {imageUrl && (
            <div className="mb-10 rounded-lg overflow-hidden">
              <img src={imageUrl} alt={post.title} className="w-full" />
            </div>
          )}
          {post.excerpt && (
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}
          {post.body && post.body.length > 0 && (
            <div className={styles.content}>
              <PortableText value={post.body} />
            </div>
          )}
          <div className="mt-12 pt-8 border-t border-zinc-200">
            {post.authorName && (
              <div className="mb-6 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-zinc-200 flex items-center justify-center text-sm font-bold text-zinc-600">
                  {post.authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-zinc-400 uppercase tracking-wider">(Autor)</p>
                  <p className="text-sm font-medium text-zinc-800">{post.authorName}</p>
                </div>
              </div>
            )}
            <Link
              href="/artista/noticias"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} /> Volver a noticias
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
