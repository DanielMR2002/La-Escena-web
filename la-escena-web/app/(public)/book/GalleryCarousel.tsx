'use client'

import { useMemo, useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
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

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = (globalIndex: number) => setLightboxIndex(globalIndex)
  const closeLightbox = () => setLightboxIndex(null)

  const goNext = useCallback(() => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex + 1) % photos.length)
  }, [lightboxIndex, photos.length])

  const goPrev = useCallback(() => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length)
  }, [lightboxIndex, photos.length])

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIndex, goNext, goPrev])

  const totalPages = pages.length
  const current = pages[page] ?? []

  return (
    <>
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
              {current.map((photo, i) => {
                const globalIndex = page * 5 + i
                return (
                  <div
                    key={photo._id}
                    className="relative aspect-[4/5] rounded-lg overflow-hidden bg-zinc-100 cursor-pointer"
                    onClick={() => openLightbox(globalIndex)}
                  >
                    <Image
                      src={urlFor(photo.image).width(400).height(500).url()}
                      alt={photo.caption ?? 'Galería La Escena'}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )
              })}
            </div>

            {/* Desktop: mosaico — foto grande + cuadrícula 2x2 */}
            <div className="hidden sm:grid grid-cols-3 grid-rows-2 gap-4 h-[420px] md:h-[520px] lg:h-[600px]">
              {current.map((photo, i) => {
                const globalIndex = page * 5 + i
                return (
                  <div
                    key={photo._id}
                    className={`relative rounded-lg overflow-hidden bg-zinc-100 cursor-pointer ${i === 0 ? 'row-span-2 col-span-1' : ''}`}
                    onClick={() => openLightbox(globalIndex)}
                  >
                    <Image
                      src={urlFor(photo.image).width(i === 0 ? 700 : 400).height(i === 0 ? 900 : 500).url()}
                      alt={photo.caption ?? 'Galería La Escena'}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )
              })}
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

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            {/* Botón cerrar */}
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              onClick={closeLightbox}
              aria-label="Cerrar"
            >
              <X size={24} />
            </button>

            {/* Botón anterior */}
            <button
              className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); goPrev() }}
              aria-label="Anterior"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Imagen */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full max-w-4xl max-h-[90vh] mx-16"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={urlFor(photos[lightboxIndex].image).width(1200).height(1600).url()}
                alt={photos[lightboxIndex].caption ?? 'Galería La Escena'}
                fill
                className="object-contain"
                priority
              />
              {photos[lightboxIndex].caption && (
                <p className="absolute bottom-0 left-0 right-0 text-center text-sm text-white/70 py-3 bg-black/40">
                  {photos[lightboxIndex].caption}
                </p>
              )}
            </motion.div>

            {/* Botón siguiente */}
            <button
              className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); goNext() }}
              aria-label="Siguiente"
            >
              <ChevronRight size={28} />
            </button>

            {/* Contador */}
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/50">
              {lightboxIndex + 1} / {photos.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
