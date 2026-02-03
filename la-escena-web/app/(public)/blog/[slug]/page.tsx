import { notFound } from 'next/navigation'
import { getPostBySlug, urlFor } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import styles from '@/styles/blog.module.css'


export const dynamic = 'force-dynamic'

interface Props {
  params: { slug: string }
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
          src={urlFor(post.mainImage).width(800).height(400).fit('crop').url()}
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

