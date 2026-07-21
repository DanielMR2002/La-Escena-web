'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { X, Send, Clock, CheckCircle, XCircle, Search } from 'lucide-react'
import { urlFor } from '@/lib/sanity'
import { formatCategoryLabel } from '@/lib/artistCategories'

type ShortlistItem = { id: string; name: string }

export type CatalogArtist = {
  id:       string
  name:     string
  city:     string | null
  category: string | null
  esProfesor?: boolean | null
  photo:    any
}

type Props = {
  pendingList:  ShortlistItem[] | null
  approvedList: ShortlistItem[] | null
  pendingComment: string | null
  catalog: CatalogArtist[]
}

function ArtistCard({
  item,
  info,
  onRemove,
}: {
  item: ShortlistItem
  info?: CatalogArtist
  onRemove?: () => void
}) {
  return (
    <div className="relative bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 z-10 p-1.5 bg-white/90 text-zinc-400 hover:text-red-500 rounded-full shadow-sm transition-colors"
          title="Eliminar de la lista"
        >
          <X size={14} />
        </button>
      )}
      {info?.photo ? (
        <div className="relative h-36 w-full bg-zinc-100">
          <Image src={urlFor(info.photo).width(320).height(220).url()} alt={item.name} fill className="object-cover" />
        </div>
      ) : (
        <div className="h-36 w-full bg-zinc-100 flex items-center justify-center">
          <span className="font-heading text-3xl text-zinc-300">{item.name[0]?.toUpperCase()}</span>
        </div>
      )}
      <div className="p-3">
        <p className="text-sm font-semibold text-zinc-800 truncate">{item.name}</p>
        <p className="text-xs text-zinc-500 truncate">
          {[formatCategoryLabel(info?.category, info?.esProfesor), info?.city].filter(Boolean).join(' · ') || '—'}
        </p>
      </div>
    </div>
  )
}

export default function ListaEditor({ pendingList, approvedList, pendingComment, catalog }: Props) {
  const [editList, setEditList]     = useState<ShortlistItem[]>(approvedList ?? [])
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)
  const [search, setSearch]         = useState('')

  const catalogMap = useMemo(
    () => Object.fromEntries(catalog.map(c => [c.id, c])) as Record<string, CatalogArtist>,
    [catalog]
  )

  const hasChanges = approvedList !== null &&
    (editList.length !== approvedList.length ||
      editList.some((a, i) => a.id !== approvedList[i]?.id))

  function removeArtist(id: string) {
    setEditList(prev => prev.filter(a => a.id !== id))
  }

  async function handleSave() {
    if (!hasChanges) return
    if (editList.length === 0) {
      alert('Debes dejar al menos un artista en la lista. Si deseas cancelarla por completo, contacta al equipo de La Escena.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/cliente/shortlist/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          artistIds:   editList.map(a => a.id),
          artistNames: editList.map(a => a.name),
        }),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      alert('Error al enviar. Intenta nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const q = search.trim().toLowerCase()
  function filterByName(list: ShortlistItem[]) {
    if (!q) return list
    return list.filter(a => a.name.toLowerCase().includes(q))
  }

  function SearchBar() {
    return (
      <div className="relative mb-4 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
    )
  }

  // Case: pending list exists (waiting for review)
  if (pendingList !== null) {
    const visible = filterByName(pendingList)
    return (
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 mb-6">
          <Clock size={20} className="text-amber-500" />
          <h2 className="font-semibold text-zinc-800 text-lg">Lista en revisión</h2>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-4">
          <p className="text-sm text-zinc-600 mb-4">
            Tu lista fue enviada y está siendo revisada por el equipo. No puedes modificarla mientras esté pendiente.
          </p>
          {pendingComment && (
            <div className="mb-4 pt-3 border-t border-amber-200">
              <p className="text-xs font-medium text-zinc-500 mb-1">Comentario del admin</p>
              <p className="text-sm text-zinc-700">{pendingComment}</p>
            </div>
          )}

          <SearchBar />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {visible.map(artist => (
              <ArtistCard key={artist.id} item={artist} info={catalogMap[artist.id]} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Case: approved list exists, editable
  if (approvedList !== null) {
    if (submitted) {
      return (
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-4">
            <Send size={20} className="text-green-500" />
            <h2 className="font-semibold text-zinc-800 text-lg">Lista enviada</h2>
          </div>
          <p className="text-sm text-zinc-500">Tu nueva lista fue enviada y está en revisión.</p>
        </div>
      )
    }

    const visible = filterByName(editList)

    return (
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle size={20} className="text-green-500" />
          <h2 className="font-semibold text-zinc-800 text-lg">Lista aprobada</h2>
        </div>
        <p className="text-sm text-zinc-500 mb-6">
          Puedes eliminar artistas de tu lista. Al guardar, la lista se enviará nuevamente para revisión.
        </p>

        {editList.length === 0 ? (
          <p className="text-sm text-zinc-400 py-8 text-center border border-dashed border-zinc-200 rounded-xl mb-6">
            No quedan artistas en la lista.
          </p>
        ) : (
          <>
            <SearchBar />
            {visible.length === 0 ? (
              <p className="text-sm text-zinc-400 py-8 text-center border border-dashed border-zinc-200 rounded-xl mb-6">
                Ningún artista coincide con la búsqueda.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                {visible.map(artist => (
                  <ArtistCard
                    key={artist.id}
                    item={artist}
                    info={catalogMap[artist.id]}
                    onRemove={() => removeArtist(artist.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        <button
          onClick={handleSave}
          disabled={!hasChanges || submitting}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={15} />
          {submitting ? 'Enviando...' : 'Guardar cambios'}
        </button>
        {hasChanges && (
          <p className="text-xs text-zinc-400 mt-2">Se enviará una nueva solicitud al equipo.</p>
        )}
      </div>
    )
  }

  // Case: no list at all
  return (
    <div className="max-w-xl text-center py-16">
      <XCircle size={40} className="text-zinc-300 mx-auto mb-4" />
      <h2 className="font-semibold text-zinc-600 text-lg mb-2">Sin lista activa</h2>
      <p className="text-sm text-zinc-400">
        Aún no tienes una lista de artistas. Contacta al equipo de La Escena para que te asignen artistas.
      </p>
    </div>
  )
}
