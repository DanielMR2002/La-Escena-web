'use client'

import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'

type ArtistCardProps = {
  artist: any
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  const image = artist.photos?.[0]

  return (
    <Link href={`/artistas/${artist.slug.current}`}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
        className="group bg-card border rounded-xl overflow-hidden hover:shadow-xl transition-all cursor-pointer"
      >
        {/* IMAGE */}
        <div className="relative aspect-[4/5] overflow-hidden">
          {image ? (
            <Image
              src={urlFor(image).width(500).height(600).url()}
              alt={artist.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
              Sin imagen
            </div>
          )}

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* CONTENT */}
        <div className="p-4 space-y-2">
          {/* NAME */}
          <h3 className="text-lg font-semibold tracking-wide">
            {artist.name}
          </h3>

          {/* CITY */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin size={14} />
            {artist.city || 'Colombia'}
          </div>

          {/* CATEGORY */}
          <p className="text-xs uppercase tracking-wider text-accent">
            {artist.category}
          </p>

          {/* STATUS */}
          {artist.isAvailable !== undefined && (
            <span
              className={`inline-block text-xs font-semibold mt-1 ${
                artist.isAvailable
                  ? 'text-green-600'
                  : 'text-red-500'
              }`}
            >
              {artist.isAvailable ? 'Disponible' : 'No disponible'}
            </span>
          )}
        </div>
      </motion.article>
    </Link>
  )
}