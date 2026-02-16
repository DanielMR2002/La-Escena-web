import { notFound } from 'next/navigation'
import { getPostBySlug, urlFor } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import styles from '@/styles/blog.module.css'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

/* ================== SEO POR POST ================== */
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {

  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post no encontrado | La Escena'
    }
  }

  return {
    title: `${post.title} | La Escena`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.mainImage
        ? [{
            url: urlFor(post.mainImage)
              .width(1200)
              .height(630)
              .url(),
            width: 1200,
            height: 630
          }]
        : []
    }
  }
}

/* ================== PAGE ================== */
interface Props {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) return notFound()

  return (
    <article style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
      <h1>{post.title}</h1>

      <p style={{ marginTop: '0.5rem', color: '#777', fontSize: '0.9rem' }}>
        Publicado el{' '}
        {new Date(post.publishedAt).toLocaleDateString('es-CO', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </p>

      {post.mainImage && (
        <img
          src={urlFor(post.mainImage)
            .width(800)
            .height(400)
            .fit('crop')
            .url()}
          alt={post.title}
          style={{
            width: '100%',
            marginTop: '1.5rem',
            borderRadius: 12
          }}
        />
      )}

      <div className={styles.content}>
        <PortableText value={post.body} />
      </div>
    </article>
  )
}
