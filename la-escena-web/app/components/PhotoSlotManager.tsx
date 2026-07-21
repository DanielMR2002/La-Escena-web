'use client'

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { urlFor } from "@/lib/sanity"
import { REQUIRED_SLOTS, EXPRESSION_SLOTS, CONCEPTUAL_SLOTS, PHOTO_SLOT_VALUES, type PhotoSlot } from "@/lib/photoSlots"

type SlotPhoto = { _key: string; asset: { _ref: string }; photoCategory?: string }

type Props = {
  sanityId: string
  photos: SlotPhoto[]
  pendingPhotos?: SlotPhoto[]
  isAdmin?: boolean
}

const ORPHAN_SLOT = "__orphan__"

function PhotoSlotTile({
  slot,
  photo,
  pending,
  uploading,
  big,
  canDelete,
  isDragOver,
  onPick,
  onDelete,
  onDragOver,
  onDragLeave,
  onDrop,
}: {
  slot: PhotoSlot
  photo?: SlotPhoto
  pending?: boolean
  uploading: boolean
  big?: boolean
  canDelete?: boolean
  isDragOver?: boolean
  onPick?: () => void
  onDelete?: () => void
  onDragOver?: (e: React.DragEvent) => void
  onDragLeave?: () => void
  onDrop?: (e: React.DragEvent) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        onClick={() => !uploading && onPick?.()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative rounded-xl overflow-hidden group cursor-pointer ${big ? "aspect-square" : "aspect-[3/4]"} ${
          photo ? "bg-zinc-100" : "bg-zinc-50 border-2 border-dashed border-zinc-200 hover:border-zinc-300"
        } ${isDragOver ? "!border-primary ring-2 ring-primary" : ""}`}
      >
        {photo ? (
          <>
            <Image
              src={urlFor(photo).width(big ? 480 : 320).height(big ? 480 : 420).url()}
              alt={slot.label}
              fill
              className="object-cover"
            />
            {pending && (
              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-400 text-amber-950 shadow">
                Pendiente
              </span>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); onPick?.() }}
                className="px-2.5 py-1.5 text-xs font-medium bg-white text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                Reemplazar
              </button>
              {canDelete && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete?.() }}
                  className="px-2.5 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 px-2 text-center">
            <span className="text-2xl mb-1 leading-none">+</span>
            <span className="text-xs font-medium">{slot.label}</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-xs font-medium text-zinc-600">
            Subiendo…
          </div>
        )}
      </div>
      {photo && <p className="text-xs text-zinc-500 text-center truncate">{slot.label}</p>}
    </div>
  )
}

export default function PhotoSlotManager({ sanityId, photos, pendingPhotos = [], isAdmin = false }: Props) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [localPhotos, setLocalPhotos] = useState<SlotPhoto[]>(photos)
  const [localPendingPhotos, setLocalPendingPhotos] = useState<SlotPhoto[]>(pendingPhotos)
  const [activeSlot, setActiveSlot] = useState<string | null>(null)
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null)
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const uploadUrl = isAdmin ? "/api/admin/artists/photos/upload" : "/api/artist/photos/upload"
  const deleteUrl = isAdmin ? "/api/admin/artists/photos/delete" : "/api/artist/photos/delete"

  // Para cada slot: la pendiente manda si existe; si no, la aprobada.
  function tileFor(slot: string): { photo?: SlotPhoto; pending: boolean } {
    const pendingPhoto = localPendingPhotos.find((p) => p.photoCategory === slot)
    if (pendingPhoto) return { photo: pendingPhoto, pending: true }
    const approved = localPhotos.find((p) => p.photoCategory === slot)
    return { photo: approved, pending: false }
  }

  async function uploadToSlot(file: File, slot: string) {
    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten imágenes")
      return
    }

    const photoCategory = slot === ORPHAN_SLOT ? null : slot

    setUploadingSlot(slot)
    setError(null)

    const body = new FormData()
    body.append("sanityId", sanityId)
    body.append("file", file)
    if (photoCategory) body.append("photoCategory", photoCategory)

    const res = await fetch(uploadUrl, { method: "POST", body })
    setUploadingSlot(null)

    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      setError(d.error ?? "Error al subir la foto")
      return
    }

    const { photo } = await res.json()
    const setter = isAdmin ? setLocalPhotos : setLocalPendingPhotos
    setter((prev) => [...prev.filter((p) => !photoCategory || p.photoCategory !== photoCategory), photo])
    router.refresh()
  }

  function openPicker(slot: string) {
    setActiveSlot(slot)
    fileRef.current?.click()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    const slot = activeSlot
    e.target.value = ""
    if (!file || !slot) return
    await uploadToSlot(file, slot)
  }

  function handleSlotDragOver(e: React.DragEvent, slot: string) {
    e.preventDefault()
    if (dragOverSlot !== slot) setDragOverSlot(slot)
  }

  function handleSlotDragLeave(slot: string) {
    setDragOverSlot((prev) => (prev === slot ? null : prev))
  }

  async function handleSlotDrop(e: React.DragEvent, slot: string) {
    e.preventDefault()
    setDragOverSlot(null)
    const file = e.dataTransfer.files?.[0]
    if (file) await uploadToSlot(file, slot)
  }

  async function handleDeleteByKey(key: string, fromPending: boolean) {
    const setter = fromPending ? setLocalPendingPhotos : setLocalPhotos
    const list = fromPending ? localPendingPhotos : localPhotos
    setter(list.filter((p) => p._key !== key))
    setError(null)

    const res = await fetch(deleteUrl, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sanityId, photoKey: key }),
    })

    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      setError(d.error ?? "Error al eliminar la foto")
      setter(list)
      return
    }
    router.refresh()
  }

  async function handleDelete(slot: string) {
    const { photo, pending } = tileFor(slot)
    if (!photo) return
    // El artista solo puede eliminar lo que él mismo propuso (pendiente);
    // lo ya aprobado no se borra directo, se reemplaza (queda a revisión).
    if (!isAdmin && !pending) return
    await handleDeleteByKey(photo._key, isAdmin ? false : pending)
  }

  function renderSlotTile(slot: PhotoSlot, big = false) {
    const { photo, pending } = tileFor(slot.value)
    return (
      <PhotoSlotTile
        key={slot.value}
        slot={slot}
        photo={photo}
        pending={pending}
        uploading={uploadingSlot === slot.value}
        isDragOver={dragOverSlot === slot.value}
        big={big}
        canDelete={isAdmin || pending}
        onPick={() => openPicker(slot.value)}
        onDelete={() => handleDelete(slot.value)}
        onDragOver={(e) => handleSlotDragOver(e, slot.value)}
        onDragLeave={() => handleSlotDragLeave(slot.value)}
        onDrop={(e) => handleSlotDrop(e, slot.value)}
      />
    )
  }

  const knownValues = PHOTO_SLOT_VALUES
  const orphanApproved = localPhotos.filter((p) => !p.photoCategory || !knownValues.includes(p.photoCategory))
  const orphanPending = localPendingPhotos.filter((p) => !p.photoCategory || !knownValues.includes(p.photoCategory))

  return (
    <div className="space-y-6">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      {error && (
        <div className="px-4 py-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Headshot (grande) + 3 slots obligatorios */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-56 shrink-0">
          {renderSlotTile(REQUIRED_SLOTS[0], true)}
        </div>
        <div className="grid grid-cols-3 gap-3 flex-1">
          {REQUIRED_SLOTS.slice(1).map((slot) => renderSlotTile(slot))}
        </div>
      </div>

      {/* Expresiones */}
      <div>
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2">Expresiones faciales</p>
        <div className="grid grid-cols-3 gap-3">
          {EXPRESSION_SLOTS.map((slot) => renderSlotTile(slot))}
        </div>
      </div>

      {/* Conceptuales */}
      <div>
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2">Fotos conceptuales</p>
        <div className="grid grid-cols-3 gap-3">
          {CONCEPTUAL_SLOTS.map((slot) => renderSlotTile(slot))}
        </div>
      </div>

      {/* Fotos sin categoría (subidas antes de los slots, o subidas sueltas) */}
      <div>
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2">Otras fotos</p>
        <div className="grid grid-cols-3 gap-3">
          {orphanApproved.map((photo) => (
            <div key={photo._key} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-zinc-100 group">
              <Image src={urlFor(photo).width(320).height(420).url()} alt="Foto sin categoría" fill className="object-cover" />
              {isAdmin && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handleDeleteByKey(photo._key, false)}
                    className="px-2.5 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          ))}

          {orphanPending.map((photo) => (
            <div key={photo._key} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-zinc-100 group">
              <Image src={urlFor(photo).width(320).height(420).url()} alt="Foto sin categoría (pendiente)" fill className="object-cover" />
              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-400 text-amber-950 shadow">
                Pendiente
              </span>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleDeleteByKey(photo._key, true)}
                  className="px-2.5 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          <div
            onClick={() => openPicker(ORPHAN_SLOT)}
            onDragOver={(e) => handleSlotDragOver(e, ORPHAN_SLOT)}
            onDragLeave={() => handleSlotDragLeave(ORPHAN_SLOT)}
            onDrop={(e) => handleSlotDrop(e, ORPHAN_SLOT)}
            className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer bg-zinc-50 border-2 border-dashed border-zinc-200 hover:border-zinc-300 ${
              dragOverSlot === ORPHAN_SLOT ? "!border-primary ring-2 ring-primary" : ""
            }`}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 px-2 text-center">
              <span className="text-2xl mb-1 leading-none">+</span>
              <span className="text-xs font-medium">Subir sin categoría</span>
            </div>
            {uploadingSlot === ORPHAN_SLOT && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-xs font-medium text-zinc-600">
                Subiendo…
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
