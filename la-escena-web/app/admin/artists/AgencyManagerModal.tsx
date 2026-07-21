'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { X, Plus, Search, AlertTriangle } from 'lucide-react'
import { urlFor } from '@/lib/sanity'

type AgencyArtist = {
  id:       string
  sanityId: string | null
  name:     string | null
  email:    string
  photo:    any
  city:     string | null
  category: string | null
  featured: boolean
  visible:  boolean
}

export default function AgencyManagerModal({ onClose }: { onClose: () => void }) {
  const [artists, setArtists]         = useState<AgencyArtist[]>([])
  const [loading, setLoading]         = useState(true)
  const [featured, setFeatured]       = useState<Record<string, boolean>>({})
  const [initialFeatured, setInitialFeatured] = useState<Record<string, boolean>>({})
  const [visible, setVisible]         = useState<Record<string, boolean>>({})
  const [initialVisible, setInitialVisible]   = useState<Record<string, boolean>>({})
  const [search, setSearch]           = useState('')
  const [saving, setSaving]           = useState(false)

  function loadArtists() {
    return fetch('/api/admin/artists/list')
      .then(r => r.json())
      .then((data: AgencyArtist[]) => {
        const withSanity = data.filter(a => a.sanityId)
        const featuredMap: Record<string, boolean> = {}
        const visibleMap:  Record<string, boolean> = {}
        for (const a of withSanity) {
          featuredMap[a.sanityId!] = a.featured
          visibleMap[a.sanityId!]  = a.visible
        }
        setArtists(withSanity)
        setFeatured(featuredMap)
        setInitialFeatured(featuredMap)
        setVisible(visibleMap)
        setInitialVisible(visibleMap)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadArtists()
  }, [])

  const hasChanges =
    Object.keys(featured).some(id => featured[id] !== initialFeatured[id]) ||
    Object.keys(visible).some(id => visible[id] !== initialVisible[id])

  function setFeaturedFor(sanityId: string, value: boolean) {
    setFeatured(prev => ({ ...prev, [sanityId]: value }))
  }

  function setVisibleFor(sanityId: string, value: boolean) {
    setVisible(prev => ({ ...prev, [sanityId]: value }))
  }

  async function handleSave() {
    setSaving(true)
    const changedIds = new Set([
      ...Object.keys(featured).filter(id => featured[id] !== initialFeatured[id]),
      ...Object.keys(visible).filter(id => visible[id] !== initialVisible[id]),
    ])
    await Promise.all(
      Array.from(changedIds).map(sanityId => {
        const body: Record<string, unknown> = { sanityId }
        if (featured[sanityId] !== initialFeatured[sanityId]) body.featured = featured[sanityId]
        if (visible[sanityId]  !== initialVisible[sanityId])  body.visible  = visible[sanityId]
        return fetch('/api/admin/agencia/toggle-featured', {
          method:  'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(body),
        })
      })
    )
    await loadArtists()
    setSaving(false)
    onClose()
  }

  const q = search.trim().toLowerCase()
  const filtered = artists.filter(a => {
    if (!q) return true
    const name = a.name ?? a.email
    return name.toLowerCase().includes(q) || (a.city?.toLowerCase().includes(q) ?? false)
  })

  const inAgency = filtered.filter(a => featured[a.sanityId!])
  const toAdd    = filtered.filter(a => !featured[a.sanityId!])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 shrink-0">
          <h2 className="font-heading text-2xl">Gestionar Agencia</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 pt-4 shrink-0">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o ciudad..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
          {loading ? (
            <p className="text-center text-zinc-400 py-16 text-sm">Cargando artistas...</p>
          ) : (
            <>
              <section>
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">
                  En Agencia ahora ({inAgency.length})
                </h3>
                {inAgency.length === 0 ? (
                  <p className="text-sm text-zinc-400">Ningún artista destacado todavía.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {inAgency.map(a => {
                      const notVisible = !visible[a.sanityId!]
                      return (
                        <div key={a.sanityId} className="flex flex-col gap-1.5 bg-zinc-50 border border-zinc-200 rounded-lg p-2">
                          <div className="flex items-center gap-2">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-zinc-200 shrink-0">
                              {a.photo && (
                                <Image src={urlFor(a.photo).width(80).height(80).url()} alt="" fill className="object-cover" />
                              )}
                            </div>
                            <span className="text-sm text-zinc-800 truncate flex-1">{a.name ?? a.email}</span>
                            <button
                              onClick={() => setFeaturedFor(a.sanityId!, false)}
                              className="text-zinc-400 hover:text-red-500 transition-colors shrink-0"
                              title="Quitar de Agencia"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          {notVisible && (
                            <div className="flex items-center gap-1.5 pl-1">
                              <span className="flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                                <AlertTriangle size={11} /> No visible
                              </span>
                              <button
                                onClick={() => setVisibleFor(a.sanityId!, true)}
                                className="text-[11px] font-medium text-primary hover:underline"
                              >
                                Activar visibilidad
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>

              <section>
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">
                  Agregar artistas ({toAdd.length})
                </h3>
                {toAdd.length === 0 ? (
                  <p className="text-sm text-zinc-400">No hay más artistas disponibles.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {toAdd.map(a => (
                      <div key={a.sanityId} className="flex items-center gap-2 bg-white border border-zinc-200 rounded-lg p-2">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-zinc-100 shrink-0">
                          {a.photo && (
                            <Image src={urlFor(a.photo).width(80).height(80).url()} alt="" fill className="object-cover" />
                          )}
                        </div>
                        <span className="text-sm text-zinc-700 truncate flex-1">{a.name ?? a.email}</span>
                        <button
                          onClick={() => setFeaturedFor(a.sanityId!, true)}
                          className="text-primary hover:text-red-700 transition-colors shrink-0"
                          title="Agregar a Agencia"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-200 shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-800 transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}
