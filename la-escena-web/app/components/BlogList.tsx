'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight } from 'lucide-react'

interface Post {
  slug: { current: string }
  title: string
  excerpt?: string
  publishedAt?: string
  category?: string
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
}

export default function BlogList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-20">
        No hay publicaciones aún.
      </p>
    )
  }

  return (
    <div className="space-y-8">
      {posts.map((post, i) => (
        <motion.article
          key={post.slug.current}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={i}
          className="group"
        >
          <Link
            href={`/blog/${post.slug.current}`}
            className="block p-8 bg-card rounded-lg border border-border hover:border-accent/50 transition-all hover:shadow-lg"
          >
            <div className="flex items-center gap-3 mb-3">
              {post.category && (
                <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-accent/10 text-accent rounded-full">
                  {post.category}
                </span>
              )}
              {post.publishedAt && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar size={12} />
                  {new Date(post.publishedAt).toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>
            <h2 className="font-heading text-2xl tracking-wide mb-2 group-hover:text-accent transition-colors">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {post.excerpt}
              </p>
            )}
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent group-hover:gap-2 transition-all">
              Leer más <ArrowRight size={14} />
            </span>
          </Link>
        </motion.article>
      ))}
    </div>
  )
}
