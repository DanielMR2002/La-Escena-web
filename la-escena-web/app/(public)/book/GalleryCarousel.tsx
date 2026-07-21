'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'

type GalleryPhoto = {
  _id: string
  image: any
  caption?: string | null
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

export default function GalleryCarousel({ photos }: { photos: GalleryPhoto[] }) {
  const pages = useMemo(() => chunk(photos, 5), [photos])
  const [page, setPage] = useState(0)

  const totalPages = pages.length
  const current = pages[page] ?? []

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Móvil: grid simple de 2 columnas */}
          <div className="grid grid-cols-2 gap-4 sm:hidden">
            {current.map((photo) => (
              <div key={photo._id} className="relative aspect-[4/5] rounded-lg overflow-hidden bg-zinc-100">
                <Image
                  src={urlFor(photo.image).width(400).height(500).url()}
                  alt={photo.caption ?? 'Galería La Escena'}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>

          {/* Desktop: mosaico — foto grande + cuadrícula 2x2 */}
          <div className="hidden sm:grid grid-cols-3 grid-rows-2 gap-4 h-[420px] md:h-[520px] lg:h-[600px]">
            {current.map((photo, i) => (
              <div
                key={photo._id}
                className={`relative rounded-lg overflow-hidden bg-zinc-100 ${i === 0 ? 'row-span-2 col-span-1' : ''}`}
              >
                <Image
                  src={urlFor(photo.image).width(i === 0 ? 700 : 400).height(i === 0 ? 900 : 500).url()}
                  alt={photo.caption ?? 'Galería La Escena'}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-2.5 rounded-full border border-border hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Página anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm text-muted-foreground font-medium">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="p-2.5 rounded-full border border-border hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Página siguiente"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  )
}
