import Link from 'next/link'
import { getPosts, urlFor } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <section style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h1>Blog</h1>

      {posts.length === 0 && <p>No hay publicaciones aún.</p>}

      <ul style={{ marginTop: '2rem' }}>
        {posts.map((post: any) => (
          <li key={post.slug.current} style={{ marginBottom: '2rem' }}>
            <h2>{post.title}</h2>

            {post.mainImage && (
              <img
                src={urlFor(post.mainImage).width(600).url()}
                alt={post.title}
                style={{ width: '100%', borderRadius: 8 }}
              />
            )}

            <p>{post.excerpt}</p>

            {post.slug?.current && (
              <Link href={`/blog/${post.slug.current}`}>
                Leer más
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

