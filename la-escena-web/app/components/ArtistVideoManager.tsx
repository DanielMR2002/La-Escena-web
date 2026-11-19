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
  if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
  // Cloudflare Stream thumbnail — stored as the preview URL, thumbnail is derived
  // e.g. https://watch.cloudflarestream.com/<uid> or iframe URL
  return null
}

function isCloudflareUrl(url: string) {
  return url.includes("cloudflarestream.com") || url.includes("cloudflare.com/stream")
}

export default function ArtistVideoManager({ sanityId, videos, pendingVideos }: Props) {
  const router = useRouter()

  const [localVideos, setLocalVideos]               = useState<SanityVideo[]>(videos)
  const [localPendingVideos, setLocalPendingVideos] = useState<SanityVideo[]>(pendingVideos)

  const [addingVideo, setAddingVideo]   = useState(false)
  const [videoUrl, setVideoUrl]         = useState("")
  const [videoTitle, setVideoTitle]     = useState("")
  const [error, setError]               = useState<string | null>(null)

  const [fileUploading, setFileUploading]     = useState(false)
  const [uploadProgress, setUploadProgress]   = useState<number | null>(null)
  const [fileUploadError, setFileUploadError] = useState<string | null>(null)
  const [fileUploadName, setFileUploadName]   = useState<string | null>(null)

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setFileUploadError(null)
    setFileUploadName(null)
    setUploadProgress(null)
    setFileUploading(true)

    try {
      // 1. Upload to Cloudflare Stream via our API route
      const form = new FormData()
      form.append("file", file)

      const uploadRes = await fetch("/api/artist/video/cloudflare-upload", {
        method: "POST",
        body: form,
      })

      if (!uploadRes.ok) {
        const d = await uploadRes.json().catch(() => ({ error: "Error al subir el video." }))
        setFileUploadError(d.error ?? "Error al subir el video.")
        setFileUploading(false)
        e.target.value = ""
        return
      }

      const { url } = await uploadRes.json()

      // 2. Save URL to Sanity
      const addRes = await fetch("/api/artist/videos/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sanityId, url, title: file.name }),
      })

      if (addRes.ok) {
        const { video } = await addRes.json()
        setLocalPendingVideos(prev => [...prev, video])
        setFileUploadName(file.name)
        router.refresh()
      } else {
        const d = await addRes.json().catch(() => ({ error: "Error al guardar el video." }))
        setFileUploadError(d.error ?? "Error al guardar el video.")
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado al subir el video."
      setFileUploadError(msg)
    }

    setFileUploading(false)
    setUploadProgress(null)
    e.target.value = ""
  }

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
    setLocalPendingVideos(prev => [...prev, video])
    setVideoUrl("")
    setVideoTitle("")
    router.refresh()
  }

  async function handleVideoDelete(videoKey: string) {
    const previous = localPendingVideos
    setLocalPendingVideos(prev => prev.filter(v => v._key !== videoKey))
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
    } else {
      router.refresh()
    }
  }

  function VideoPreview({ video }: { video: SanityVideo }) {
    const thumb = getThumbnail(video.url)
    const isCF  = isCloudflareUrl(video.url)
    return (
      <div className="flex items-center gap-3">
        {thumb ? (
          <Image src={thumb} alt={video.title ?? "Video"} width={96} height={60}
            className="rounded shrink-0 object-cover" />
        ) : (
          <div className="w-24 h-[60px] bg-zinc-100 rounded shrink-0 flex items-center justify-center text-zinc-400 text-xl">
            {isCF ? "☁" : "▶"}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {video.title && <p className="text-sm font-medium text-zinc-700 truncate">{video.title}</p>}
          <p className="text-xs text-zinc-400 truncate">{video.url}</p>
          {isCF && (
            <span className="inline-block mt-0.5 px-1.5 py-0.5 text-[10px] font-medium bg-orange-100 text-orange-700 rounded">
              Cloudflare Stream
            </span>
          )}
        </div>
      </div>
    )
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
          {localPendingVideos.map(video => (
            <li key={video._key}
              className="relative flex items-center gap-3 p-3 border border-amber-200 bg-amber-50 rounded-lg">
              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-400 text-amber-950 shadow">
                Pendiente
              </span>
              <div className="mt-5 flex-1 min-w-0">
                <VideoPreview video={video} />
              </div>
              <button
                onClick={() => handleVideoDelete(video._key)}
                className="shrink-0 px-2.5 py-1.5 text-xs font-medium border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors mt-5"
              >
                Eliminar
              </button>
            </li>
          ))}

          {localVideos.map(video => (
            <li key={video._key} className="flex items-center gap-3 p-3 border border-zinc-100 rounded-lg">
              <div className="flex-1 min-w-0">
                <VideoPreview video={video} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {atVideoLimit ? (
        <div className="py-4 border-2 border-dashed border-zinc-200 rounded-lg text-center text-sm text-zinc-400">
          Límite de {VIDEO_LIMIT} videos pendientes alcanzado.
        </div>
      ) : (
        <div className="border border-zinc-200 rounded-lg p-4 space-y-3">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Agregar video</p>

          {/* YouTube / URL link */}
          <input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleVideoAdd()}
            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Título (opcional)"
            value={videoTitle}
            onChange={e => setVideoTitle(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleVideoAdd()}
            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleVideoAdd}
            disabled={!videoUrl.trim() || addingVideo}
            className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-40"
          >
            {addingVideo ? "Agregando…" : "Agregar enlace"}
          </button>

          {/* File upload → Cloudflare Stream */}
          <div className="pt-3 border-t border-zinc-100">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1">
              O sube un archivo de video
            </p>
            <p className="text-xs text-zinc-400 mb-2">
              mp4, mov, avi, webm · máx. 2 GB · almacenado en Cloudflare Stream
            </p>

            {fileUploading ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Subiendo video... esto puede tomar varios minutos para archivos grandes.
                </div>
              </div>
            ) : (
              <input
                type="file"
                accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
                onChange={handleFileUpload}
                disabled={fileUploading}
                className="text-sm"
              />
            )}

            {fileUploadName && !fileUploading && (
              <p className="mt-1 text-xs text-green-600">✓ {fileUploadName} subido correctamente</p>
            )}
            {fileUploadError && (
              <p className="mt-1 text-xs text-red-600">{fileUploadError}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
