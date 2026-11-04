"use client"

import { motion } from "framer-motion"
import { Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

interface InternalPost {
  _id: string
  title: string
  excerpt?: string
  publishedAt?: string
  imageUrl?: string
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
}

export default function NoticiasList({ posts }: { posts: InternalPost[] }) {
  if (posts.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-20">
        No hay noticias publicadas aún.
      </p>
    )
  }

  return (
    <div className="space-y-8">
      {posts.map((post, i) => (
        <motion.article
          key={post._id}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={i}
          className="group bg-card rounded-lg border border-border overflow-hidden transition-all hover:border-accent/50 hover:shadow-lg"
        >
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-52 object-cover"
            />
          )}

          <div className="p-8">
            {post.publishedAt && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                <Calendar size={12} />
                {new Date(post.publishedAt).toLocaleDateString("es-CO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}

            <h2 className="font-heading text-2xl tracking-wide mb-2 group-hover:text-accent transition-colors">
              {post.title}
            </h2>

            {post.excerpt && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {post.excerpt}
              </p>
            )}

            <Link
              href={`/artista/noticias/${post._id}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline mt-2"
            >
              Leer más <ArrowRight size={14} />
            </Link>
          </div>
        </motion.article>
      ))}
    </div>
  )
}
