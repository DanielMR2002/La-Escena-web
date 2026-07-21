'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import { Trash2, ImagePlus } from 'lucide-react'
import GalleryMosaicGroup from '@/app/components/GalleryMosaicGroup'

type GalleryPhoto = {
  _id:     string
  image:   any
  caption: string | null
  order:   number
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

export default function AdminGaleriaPage() {
  const [photos, setPhotos]     = useState<GalleryPhoto[]>([])
  const [loading, setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  function dedupeById(list: GalleryPhoto[]): GalleryPhoto[] {
    const seen = new Map<string, GalleryPhoto>()
    for (const p of list) seen.set(p._id, p)
    return Array.from(seen.values())
  }

  async function load() {
    const res = await fetch('/api/admin/gallery')
    const data = await res.json()
    setPhotos(dedupeById(data))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    setUploadError(null)
    const nextOrder = photos.length > 0 ? Math.max(...photos.map(p => p.order)) + 1 : 0

    const results = await Promise.all(
      Array.from(files).map((file, i) => {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('order', String(nextOrder + i))
        return fetch('/api/admin/gallery/upload', { method: 'POST', body: fd })
          .then(res => ({ ok: res.ok, name: file.name }))
          .catch(() => ({ ok: false, name: file.name }))
      })
    )

    const failed = results.filter(r => !r.ok)
    if (failed.length > 0) {
      setUploadError(
        `No se pudieron subir ${failed.length} de ${files.length} foto(s): ${failed.map(f => f.name).join(', ')}`
      )
    }

    await load()
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta foto de la galería?')) return
    await fetch('/api/admin/gallery/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setPhotos(prev => prev.filter(p => p._id !== id))
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    uploadFiles(e.dataTransfer.files)
  }

  async function swapPhotos(idA: string, idB: string) {
    const a = photos.find(p => p._id === idA)
    const b = photos.find(p => p._id === idB)
    if (!a || !b || a._id === b._id) return

    const orderA = a.order
    const orderB = b.order

    setPhotos(prev => {
      const next = prev.map(p => {
        if (p._id === a._id) return { ...p, order: orderB }
        if (p._id === b._id) return { ...p, order: orderA }
        return p
      })
      return next.sort((x, y) => x.order - y.order)
    })

    await Promise.all([
      fetch('/api/admin/gallery/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: a._id, newOrder: orderB }),
      }),
      fetch('/api/admin/gallery/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: b._id, newOrder: orderA }),
      }),
    ])
  }

  function handlePhotoDragStart(id: string) {
    setDraggedId(id)
  }

  function handlePhotoDragOver(e: React.DragEvent, id: string) {
    e.preventDefault()
    if (id !== dragOverId) setDragOverId(id)
  }

  function handlePhotoDragLeave(id: string) {
    setDragOverId(prev => (prev === id ? null : prev))
  }

  async function handlePhotoDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault()
    setDragOverId(null)
    const sourceId = draggedId
    setDraggedId(null)
    if (!sourceId || sourceId === targetId) return
    await swapPhotos(sourceId, targetId)
  }

  const groups = useMemo(() => chunk(photos, 8), [photos])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-4xl">Galería</h1>
        <div className="text-xs text-zinc-400">
          {photos.length} foto{photos.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`mb-8 border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
          dragging ? 'border-primary bg-primary/5' : 'border-zinc-300 hover:border-zinc-400 bg-white'
        }`}
        onClick={() => fileRef.current?.click()}
      >
        <ImagePlus size={32} className="mx-auto mb-3 text-zinc-400" />
        <p className="text-sm font-medium text-zinc-600">
          {uploading ? 'Subiendo...' : 'Arrastra fotos aquí o haz clic para seleccionar'}
        </p>
        <p className="text-xs text-zinc-400 mt-1">JPG, PNG, WebP — múltiples archivos permitidos</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => uploadFiles(e.target.files)}
        />
      </div>

      {uploadError && (
        <div className="mb-8 px-4 py-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
          {uploadError}
        </div>
      )}

      {loading ? (
        <p className="text-center text-zinc-400 py-20 text-sm">Cargando galería...</p>
      ) : photos.length === 0 ? (
        <p className="text-center text-zinc-400 py-20 text-sm">
          No hay fotos en la galería. Sube la primera imagen.
        </p>
      ) : (
        <>
          <p className="text-xs text-zinc-400 mb-4">
            Arrastra una foto y suéltala sobre otra para intercambiar su posición.
          </p>
          <div className="space-y-8">
            {groups.map((group, gi) => (
              <GalleryMosaicGroup
                key={gi}
                photos={group}
                keyOf={(photo) => photo._id}
                renderCell={(photo, { isBig }) => (
                  <div className="flex flex-col gap-2">
                    <div
                      draggable
                      onDragStart={() => handlePhotoDragStart(photo._id)}
                      onDragOver={(e) => handlePhotoDragOver(e, photo._id)}
                      onDragLeave={() => handlePhotoDragLeave(photo._id)}
                      onDrop={(e) => handlePhotoDrop(e, photo._id)}
                      onDragEnd={() => { setDraggedId(null); setDragOverId(null) }}
                      className={`relative rounded-xl overflow-hidden bg-zinc-100 group transition-all ${
                        isBig ? 'aspect-[8/5]' : 'aspect-[4/5]'
                      } ${
                        draggedId === photo._id ? 'cursor-grabbing opacity-50' : 'cursor-grab'
                      } ${
                        dragOverId === photo._id && draggedId !== photo._id
                          ? 'ring-4 ring-primary ring-offset-2'
                          : ''
                      }`}
                    >
                      {photo.image && (
                        <Image
                          src={urlFor(photo.image).width(isBig ? 640 : 320).height(isBig ? 400 : 400).url()}
                          alt={photo.caption ?? 'Foto de galería'}
                          fill
                          className="object-cover pointer-events-none"
                        />
                      )}
                      {/* Delete overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => handleDelete(photo._id)}
                          className="p-2.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {photo.caption && (
                      <p className="text-xs text-zinc-500 px-0.5 truncate">{photo.caption}</p>
                    )}
                  </div>
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
