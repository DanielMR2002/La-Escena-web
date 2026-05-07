import { getPosts } from '@/lib/sanity'
import BlogList from '@/app/components/BlogList'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog | La Escena',
  description: 'Noticias, consejos y contenido sobre arte, baile y creación de contenido.',
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <>
      {/* HERO */}
      <section className="bg-foreground py-20">
        <div className="container text-center space-y-4">
          <h1 className="font-heading text-5xl sm:text-7xl tracking-wide text-primary-foreground">
            Nuestro <span className="text-secondary">Blog</span>
          </h1>
          <p className="text-primary-foreground/60 max-w-lg mx-auto">
            Noticias, tips y tendencias del mundo del baile y el entretenimiento.
          </p>
        </div>
      </section>

      {/* POSTS */}
      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
          <BlogList posts={posts} />
        </div>
      </section>
    </>
  )
}
