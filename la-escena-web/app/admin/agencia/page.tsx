'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Plus, Search, AlertTriangle } from 'lucide-react'
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

export default function AdminAgenciaPage() {
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
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-1">
            {inAgency.length} en agencia
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl tracking-wide text-admin-foreground">Agencia</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

      <div className="relative mb-8 max-w-md">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
        <input
          type="text"
          placeholder="Buscar por nombre o ciudad..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-admin-border bg-admin-elevated text-sm text-admin-foreground placeholder:text-admin-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {loading ? (
        <p className="text-center text-admin-muted py-16 text-sm">Cargando artistas...</p>
      ) : (
        <div className="space-y-10">
          <section>
            <h2 className="font-heading text-2xl tracking-wide text-admin-foreground mb-4">
              En agencia ahora ({inAgency.length})
            </h2>
            {inAgency.length === 0 ? (
              <p className="text-sm text-admin-muted">Ningún artista destacado todavía.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {inAgency.map(a => {
                  const notVisible = !visible[a.sanityId!]
                  return (
                    <div key={a.sanityId} className="flex flex-col gap-2 bg-admin-elevated border border-admin-border rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-admin-border shrink-0">
                          {a.photo && (
                            <Image src={urlFor(a.photo).width(80).height(80).url()} alt="" fill className="object-cover" />
                          )}
                        </div>
                        <span className="text-sm text-admin-foreground truncate flex-1">{a.name ?? a.email}</span>
                        <button
                          onClick={() => setFeaturedFor(a.sanityId!, false)}
                          className="text-admin-muted hover:text-red-400 transition-colors shrink-0 text-lg leading-none"
                          title="Quitar de Agencia"
                        >
                          ×
                        </button>
                      </div>
                      {notVisible && (
                        <div className="flex items-center gap-1.5">
                          <span className="flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-400/15 px-1.5 py-0.5 rounded">
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
            <h2 className="font-heading text-2xl tracking-wide text-admin-foreground mb-4">
              Agregar artistas ({toAdd.length})
            </h2>
            {toAdd.length === 0 ? (
              <p className="text-sm text-admin-muted">No hay más artistas disponibles.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {toAdd.map(a => (
                  <div key={a.sanityId} className="flex items-center gap-2 bg-admin-elevated border border-admin-border rounded-lg p-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-admin-border shrink-0">
                      {a.photo && (
                        <Image src={urlFor(a.photo).width(80).height(80).url()} alt="" fill className="object-cover" />
                      )}
                    </div>
                    <span className="text-sm text-admin-foreground truncate flex-1">{a.name ?? a.email}</span>
                    <button
                      onClick={() => setFeaturedFor(a.sanityId!, true)}
                      className="text-primary hover:text-red-400 transition-colors shrink-0"
                      title="Agregar a Agencia"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
