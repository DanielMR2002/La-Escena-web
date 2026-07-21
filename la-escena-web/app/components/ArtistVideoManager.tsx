'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

type SanityVideo = { _key: string; url: string; title?: string }

type Props = {
  sanityId: string
  videos: SanityVideo[]
  pendingVideos: SanityVideo[]
}

const VIDEO_LIMIT = 4

function youtubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&\n?#]+)/)
  return m ? m[1] : null
}

function getThumbnail(url: string) {
  const ytId = youtubeId(url)
  return ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null
}

export default function ArtistVideoManager({ sanityId, videos, pendingVideos }: Props) {
  const router = useRouter()

  const [localVideos, setLocalVideos] = useState<SanityVideo[]>(videos)
  const [localPendingVideos, setLocalPendingVideos] = useState<SanityVideo[]>(pendingVideos)

  const [addingVideo, setAddingVideo] = useState(false)
  const [videoUrl, setVideoUrl]       = useState("")
  const [videoTitle, setVideoTitle]   = useState("")
  const [error, setError]             = useState<string | null>(null)

  const atVideoLimit = localPendingVideos.length >= VIDEO_LIMIT

  async function handleVideoAdd() {
    const url = videoUrl.trim()
    if (!url) return

    setAddingVideo(true)
    setError(null)

    const res = await fetch("/api/artist/videos/add", {
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
    setLocalPendingVideos((prev) => [...prev, video])
    setVideoUrl("")
    setVideoTitle("")
    router.refresh()
  }

  async function handleVideoDelete(videoKey: string) {
    const previous = localPendingVideos
    setLocalPendingVideos((prev) => prev.filter((v) => v._key !== videoKey))
    setError(null)

    const res = await fetch("/api/artist/videos/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sanityId, videoKey }),
    })

    if (!res.ok) {
      const d = await res.json()
      setError(d.error ?? "Error al eliminar el video")
      setLocalPendingVideos(previous)
      return
    }
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="px-4 py-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {(localVideos.length > 0 || localPendingVideos.length > 0) && (
        <ul className="space-y-3">
          {localPendingVideos.map((video) => {
            const thumb = getThumbnail(video.url)
            return (
              <li key={video._key} className="relative flex items-center gap-3 p-3 border border-amber-200 bg-amber-50 rounded-lg">
                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-400 text-amber-950 shadow">
                  Pendiente
                </span>
                {thumb ? (
                  <Image src={thumb} alt={video.title ?? "Video"} width={96} height={60} className="rounded shrink-0 object-cover mt-3" />
                ) : (
                  <div className="w-24 h-[60px] bg-zinc-100 rounded shrink-0 flex items-center justify-center text-zinc-400 text-xl mt-3">▶</div>
                )}
                <div className="flex-1 min-w-0 mt-3">
                  {video.title && <p className="text-sm font-medium text-zinc-700 truncate">{video.title}</p>}
                  <p className="text-xs text-zinc-400 truncate">{video.url}</p>
                </div>
                <button
                  onClick={() => handleVideoDelete(video._key)}
                  className="shrink-0 px-2.5 py-1.5 text-xs font-medium border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors mt-3"
                >
                  Eliminar
                </button>
              </li>
            )
          })}

          {localVideos.map((video) => {
            const thumb = getThumbnail(video.url)
            return (
              <li key={video._key} className="flex items-center gap-3 p-3 border border-zinc-100 rounded-lg">
                {thumb ? (
                  <Image src={thumb} alt={video.title ?? "Video"} width={96} height={60} className="rounded shrink-0 object-cover" />
                ) : (
                  <div className="w-24 h-[60px] bg-zinc-100 rounded shrink-0 flex items-center justify-center text-zinc-400 text-xl">▶</div>
                )}
                <div className="flex-1 min-w-0">
                  {video.title && <p className="text-sm font-medium text-zinc-700 truncate">{video.title}</p>}
                  <p className="text-xs text-zinc-400 truncate">{video.url}</p>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {atVideoLimit ? (
        <div className="py-4 border-2 border-dashed border-zinc-200 rounded-lg text-center text-sm text-zinc-400">
          Límite de {VIDEO_LIMIT} videos pendientes alcanzado.
        </div>
      ) : (
        <div className="border border-zinc-200 rounded-lg p-4 space-y-3">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Agregar video</p>
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
    </div>
  )
}
