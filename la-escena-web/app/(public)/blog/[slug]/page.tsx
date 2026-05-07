import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'
import { getPostBySlug, urlFor } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import styles from '@/styles/blog.module.css'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return { title: 'Post no encontrado | La Escena' }
  }

  return {
    title: `${post.title} | La Escena`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.mainImage
        ? [{
            url: urlFor(post.mainImage).width(1200).height(630).url(),
            width: 1200,
            height: 630,
          }]
        : [],
    },
  }
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return (
      <section className="py-20 bg-background">
        <div className="container max-w-3xl text-center space-y-4">
          <h1 className="font-heading text-4xl tracking-wide">
            Post no encontrado
          </h1>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
          >
            <ArrowLeft size={16} /> Volver al blog
          </Link>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* HERO */}
      <section className="bg-foreground py-20">
        <div className="container max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-secondary transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Volver al blog
          </Link>
          <div className="flex items-center gap-3 mb-4">
            {post.category && (
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-secondary/20 text-secondary rounded-full">
                {post.category}
              </span>
            )}
            {post.publishedAt && (
              <span className="flex items-center gap-1.5 text-xs text-primary-foreground/40">
                <Calendar size={12} />
                {new Date(post.publishedAt).toLocaleDateString('es-CO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl tracking-wide text-primary-foreground">
            {post.title}
          </h1>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="py-16 bg-background">
        <div className="container max-w-3xl">
          {post.mainImage && (
            <div className="mb-10 rounded-lg overflow-hidden">
              <img
                src={urlFor(post.mainImage).width(800).height(400).fit('crop').url()}
                alt={post.title}
                className="w-full"
              />
            </div>
          )}
          <div className={styles.content}>
            <PortableText value={post.body} />
          </div>
        </div>
      </section>
    </>
  )
}
