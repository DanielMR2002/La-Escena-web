'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'

type Props = {
  url: string
  title?: string
  isShort?: boolean
}

function getYoutubeId(url: string): string | null {
  const shortMatch = url.match(/\/shorts\/([^?&]+)/)
  if (shortMatch) return shortMatch[1]
  const regularMatch = url.match(/[?&]v=([^&]+)/)
  if (regularMatch) return regularMatch[1]
  return null
}

export default function YoutubeLazyPlayer({ url, title, isShort }: Props) {
  const [playing, setPlaying] = useState(false)
  const ytId = getYoutubeId(url)

  if (!ytId) return null

  const embedUrl = `https://www.youtube.com/embed/${ytId}?autoplay=1`
  const thumbnailUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`

  return (
    <div className="space-y-2">
      <div className={`relative rounded-lg overflow-hidden bg-zinc-900 ${isShort ? 'aspect-[9/16]' : 'aspect-video'}`}>
        {playing ? (
          <iframe
            src={embedUrl}
            title={title || 'Video'}
            allow="autoplay; fullscreen"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="absolute inset-0 w-full h-full group"
            aria-label={title ? `Reproducir ${title}` : 'Reproducir video'}
          >
            <img
              src={thumbnailUrl}
              alt={title || 'Video thumbnail'}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center group-hover:bg-red-500 transition-colors shadow-lg group-hover:scale-110 transform transition-transform">
                <Play size={24} className="text-white ml-1" fill="white" />
              </div>
            </div>
          </button>
        )}
      </div>
      {title && (
        <h3 className="font-heading text-sm tracking-wide text-primary-foreground text-center">
          {title}
        </h3>
      )}
    </div>
  )
}
