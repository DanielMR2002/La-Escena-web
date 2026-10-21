'use client'

import { useState } from "react"

function toYoutubeId(url: string): string | null {
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
  if (shortMatch) return shortMatch[1]
  const idMatch = url.match(/[?&]v=([^&]+)/)
  if (idMatch) return idMatch[1]
  return null
}

function toYoutubeEmbed(url: string): string {
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`
  const idMatch = url.match(/[?&]v=([^&]+)/)
  if (idMatch) {
    const tMatch = url.match(/[?&]t=(\d+)s?/)
    const start = tMatch ? `?start=${tMatch[1]}` : ''
    return `https://www.youtube.com/embed/${idMatch[1]}${start}`
  }
  return url
}

export default function YouTubeEmbed({ url, title }: { url: string; title: string }) {
  const [failed, setFailed] = useState(false)
  const videoId = toYoutubeId(url)
  const thumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : null

  if (failed || !videoId) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative aspect-video rounded-lg overflow-hidden bg-zinc-900 flex flex-col items-center justify-center gap-3 group block"
        style={{ aspectRatio: "16/9" }}
      >
        {thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-opacity"
          />
        )}
        <div className="relative z-10 w-14 h-14 rounded-full bg-red-600 flex items-center justify-center group-hover:bg-red-500 transition-colors shadow-lg">
          <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 ml-1">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <span className="relative z-10 text-white text-xs font-semibold uppercase tracking-wider bg-black/50 px-3 py-1 rounded-full">
          Ver en YouTube
        </span>
      </a>
    )
  }

  return (
    <div className="relative rounded-lg overflow-hidden bg-muted" style={{ aspectRatio: "16/9" }}>
      <iframe
        src={toYoutubeEmbed(url)}
        title={title}
        loading="lazy"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        onError={() => setFailed(true)}
      />
    </div>
  )
}
