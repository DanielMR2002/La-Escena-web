"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import PhotoSlotManager from "@/app/components/PhotoSlotManager"

const VIDEO_LIMIT = 4

type SanityPhoto = { _key: string; asset: { _ref: string }; photoCategory?: string }
type SanityVideo = { _key: string; url: string; title?: string }

type Props = {
  sanityId: string
  photos: SanityPhoto[]
  videos: SanityVideo[]
}

function youtubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&\n?#]+)/)
  return m ? m[1] : null
}

function getThumbnail(url: string) {
  const ytId = youtubeId(url)
  return ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null
}

function CountBadge({ count, limit }: { count: number; limit: number }) {
  const full = count >= limit
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
      full ? "bg-red-50 text-red-600" : "bg-zinc-100 text-zinc-500"
    }`}>
      {count} / {limit}
    </span>
  )
}

export default function ArtistMediaManager({ sanityId, photos, videos }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  // Estado local como fuente de verdad — no se sincroniza desde props
  // para evitar race conditions con router.refresh()
  const [localVideos, setLocalVideos] = useState<SanityVideo[]>(videos)

  const [addingVideo, setAddingVideo] = useState(false)
  const [videoUrl,    setVideoUrl]    = useState("")
  const [videoTitle,  setVideoTitle]  = useState("")
  const [error,       setError]       = useState<string | null>(null)

  const refresh = () => startTransition(() => router.refresh())

  /* ── VIDEOS ── */

  async function handleVideoAdd() {
    const url = videoUrl.trim()
    if (!url) return

    setAddingVideo(true)
    setError(null)

    const res = await fetch("/api/admin/artists/videos/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sanityId, url, title: videoTitle.trim() }),
    })
    setAddingVideo(false)

    if (!res.ok) {
      const d = await res.json()
      setError(d.error ?? "Error al agregar el video")
      return
    }

    const { video } = await res.json()
    setLocalVideos(prev => [...prev, video])
    setVideoUrl("")
    setVideoTitle("")
    refresh()
  }

  async function handleVideoDelete(videoKey: string) {
    const previous = localVideos
    setLocalVideos(prev => prev.filter(v => v._key !== videoKey))
    setError(null)

    const res = await fetch("/api/admin/artists/videos/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sanityId, videoKey }),
    })

    if (!res.ok) {
      const d = await res.json()
      setError(d.error ?? "Error al eliminar el video")
      setLocalVideos(previous)
      return
    }
    refresh()
  }

  const atVideoLimit = localVideos.length >= VIDEO_LIMIT

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-8">

      {error && (
        <div className="px-4 py-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* ────── FOTOS ────── */}
      <section>
        <h3 className="font-heading text-xl mb-4">Fotos</h3>
        <PhotoSlotManager sanityId={sanityId} photos={photos} isAdmin />
      </section>

      {/* ────── VIDEOS ────── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="font-heading text-xl">Videos</h3>
          <CountBadge count={localVideos.length} limit={VIDEO_LIMIT} />
        </div>

        {localVideos.length > 0 && (
          <ul className="space-y-3 mb-6">
            {localVideos.map((video) => {
              const thumb = getThumbnail(video.url)
              return (
                <li
                  key={video._key}
                  className="flex items-center gap-3 p-3 border border-zinc-100 rounded-lg"
                >
                  {thumb ? (
                    <Image
                      src={thumb}
                      alt={video.title ?? "Video"}
                      width={96}
                      height={60}
                      className="rounded shrink-0 object-cover"
                    />
                  ) : (
                    <div className="w-24 h-[60px] bg-zinc-100 rounded shrink-0 flex items-center justify-center text-zinc-400 text-xl">
                      ▶
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    {video.title && (
                      <p className="text-sm font-medium text-zinc-700 truncate">{video.title}</p>
                    )}
                    <p className="text-xs text-zinc-400 truncate">{video.url}</p>
                  </div>

                  <button
                    onClick={() => handleVideoDelete(video._key)}
                    className="shrink-0 px-2.5 py-1.5 text-xs font-medium border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Eliminar
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        {atVideoLimit ? (
          <div className="py-4 border-2 border-dashed border-zinc-200 rounded-lg text-center text-sm text-zinc-400">
            Límite de {VIDEO_LIMIT} videos alcanzado.
          </div>
        ) : (
          <div className="border border-zinc-200 rounded-lg p-4 space-y-3">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
              Agregar video
            </p>
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVideoAdd()}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Título (opcional)"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVideoAdd()}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleVideoAdd}
              disabled={!videoUrl.trim() || addingVideo}
              className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-40"
            >
              {addingVideo ? "Agregando…" : "Agregar video"}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
