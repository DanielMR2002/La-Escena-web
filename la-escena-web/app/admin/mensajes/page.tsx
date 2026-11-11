'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Send, Search, SlidersHorizontal, X, CheckSquare, Square, Trash2 } from 'lucide-react'
import { urlFor } from '@/lib/sanity'
import { formatCategoryLabel } from '@/lib/artistCategories'
import Filters from '@/app/components/Filters'
import { applyArtistFilters } from '@/lib/filters/applyArtistFilters'
import { getAvailableFilterOptions } from '@/lib/filters/getAvailableFilterOptions'
import { ArtistFiltersV2, EMPTY_FILTERS } from '@/types/artistFilters'

type RecipientOption = {
  userId:        string
  name:          string | null
  email:         string
  role:          'ARTIST' | 'ADMIN'
  city?:         string | null
  category?:     string | null
  agencyProfile?: string | null
  esProfesor?:   boolean | null
  photo?:        any | null
  slug?:         string | null
  styles?:       string[]
  experience?:   number | null
  age?:          number | null
  height?:       number | null
  hashtags?:     string[]
}

type SentMessage = {
  id:             string
  subject:        string
  audience:       'ALL' | 'SELECTED'
  recipientCount: number
  createdAt:      string
}

export default function AdminMessagesPage() {
  const [recipients, setRecipients] = useState<RecipientOption[]>([])
  const [history, setHistory]       = useState<SentMessage[]>([])

  const [subject, setSubject]       = useState('')
  const [body, setBody]             = useState('')
  const [audience, setAudience]     = useState<'ALL' | 'SELECTED'>('ALL')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [search, setSearch]         = useState('')
  const [filters, setFilters]       = useState<ArtistFiltersV2>(EMPTY_FILTERS)
  const [showFilters, setShowFilters] = useState(false)

  const [sending, setSending]       = useState(false)
  const [feedback, setFeedback]     = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/messages/recipients')
      .then(r => r.json())
      .then(data => Array.isArray(data) && setRecipients(data))
      .catch(() => {})
    loadHistory()
  }, [])

  function loadHistory() {
    fetch('/api/admin/messages')
      .then(r => r.json())
      .then(data => Array.isArray(data) && setHistory(data))
      .catch(() => {})
  }

  async function deleteMessage(id: string) {
    await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' })
    setHistory(prev => prev.filter(m => m.id !== id))
  }

  const artists = recipients.filter(r => r.role === 'ARTIST')
  const admins  = recipients.filter(r => r.role === 'ADMIN')

  const filterOptions = useMemo(() => getAvailableFilterOptions(artists as any), [artists])
  const { categories, cities, styles, experienceRange, ageRange, heightRange } = filterOptions

  const activeFilterCount = [
    filters.category, filters.city,
    (filters.styles?.length ?? 0) > 0,
    filters.minExperience != null, filters.maxExperience != null,
    filters.minAge != null, filters.maxAge != null,
    filters.minHeight != null, filters.maxHeight != null,
    filters.hashtagSearch,
  ].filter(Boolean).length

  const filteredArtists = useMemo(() => {
    let result = applyArtistFilters(artists as any, filters) as RecipientOption[]
    const q = search.trim().toLowerCase()
    if (q) result = result.filter(r =>
      (r.name ?? r.email).toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q)
    )
    return result
  }, [artists, filters, search])

  function toggleRecipient(userId: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(userId) ? next.delete(userId) : next.add(userId)
      return next
    })
  }

  function selectAll() {
    setSelectedIds(new Set(filteredArtists.map(r => r.userId)))
  }
  function clearAll() {
    setSelectedIds(new Set())
  }

  async function handleSend() {
    if (!subject.trim() || !body.trim()) { setFeedback('Falta asunto o mensaje.'); return }
    if (audience === 'SELECTED' && selectedIds.size === 0) { setFeedback('Selecciona al menos un destinatario.'); return }
    setSending(true)
    setFeedback(null)
    try {
      const res = await fetch('/api/admin/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body, audience, recipientUserIds: audience === 'SELECTED' ? Array.from(selectedIds) : undefined }),
      })
      const data = await res.json()
      if (!res.ok) {
        setFeedback(data.error || 'No se pudo enviar el mensaje.')
      } else {
        setFeedback(`Mensaje enviado a ${data.recipientCount} destinatario(s).${data.emailFailures > 0 ? ` (${data.emailFailures} correo(s) fallaron)` : ''}`)
        setSubject(''); setBody(''); setSelectedIds(new Set()); setAudience('ALL')
        loadHistory()
      }
    } catch { setFeedback('No se pudo enviar el mensaje.') }
    finally { setSending(false) }
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-1">Comunicaciones internas</p>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-wide text-admin-foreground">Buzón de mensajes</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Nuevo mensaje */}
        <div className="lg:col-span-2 bg-admin-elevated border border-admin-border rounded-xl p-6 space-y-5 h-fit">
          <h2 className="font-heading text-2xl tracking-wide text-admin-foreground">Nuevo mensaje</h2>

          <div>
            <label className="block text-sm font-medium text-admin-muted mb-1.5">Asunto</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Asunto del mensaje"
              className="w-full px-3 py-2 border border-admin-border bg-admin-background rounded-lg text-sm text-admin-foreground placeholder:text-admin-muted focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>

          <div>
            <label className="block text-sm font-medium text-admin-muted mb-1.5">Mensaje</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Escribe el contenido del mensaje..."
              className="w-full h-48 px-3 py-2 border border-admin-border bg-admin-background rounded-lg text-sm text-admin-foreground placeholder:text-admin-muted focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-admin-muted mb-1.5">Destinatarios</label>
            <div className="flex gap-2">
              {(['ALL', 'SELECTED'] as const).map(opt => (
                <button key={opt} onClick={() => setAudience(opt)}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors ${audience === opt ? 'bg-primary text-white border-primary' : 'border-admin-border text-admin-muted hover:bg-white/5'}`}>
                  {opt === 'ALL' ? 'Todos los artistas' : 'Selección individual'}
                </button>
              ))}
            </div>
          </div>

          {audience === 'SELECTED' && (
            <div className="space-y-3">
              {/* Search + filters */}
              <div className="flex flex-wrap gap-2">
                <div className="relative flex-1 min-w-[160px]">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar artista..."
                    className="w-full pl-8 pr-3 py-2 border border-admin-border bg-admin-background rounded-lg text-sm text-admin-foreground placeholder:text-admin-muted focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <button onClick={() => setShowFilters(v => !v)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 border border-admin-border rounded-lg text-xs bg-admin-elevated text-admin-foreground hover:bg-admin-border transition-colors">
                  <SlidersHorizontal size={12} />
                  Filtros
                  {activeFilterCount > 0 && <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-primary text-white font-semibold">{activeFilterCount}</span>}
                </button>
              </div>

              {showFilters && (
                <div className="p-3 bg-admin-background rounded-xl border border-admin-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-admin-foreground">Filtros</p>
                    {activeFilterCount > 0 && (
                      <button onClick={() => setFilters(EMPTY_FILTERS)} className="text-xs text-admin-muted hover:text-admin-foreground flex items-center gap-1">
                        <X size={10} /> Limpiar
                      </button>
                    )}
                  </div>
                  <div style={{ '--background': '0 0% 8%', '--foreground': '0 0% 95%', '--muted': '0 0% 12%', '--muted-foreground': '0 0% 55%', '--border': '0 0% 18%' } as React.CSSProperties}>
                    <Filters categories={categories} cities={cities} styles={styles}
                      filters={filters} onFilterChange={setFilters}
                      experienceRange={experienceRange} ageRange={ageRange} heightRange={heightRange}
                      showAvailability={false} />
                  </div>
                </div>
              )}

              {/* Quick select */}
              <div className="flex items-center gap-3">
                <p className="text-xs text-admin-muted">{filteredArtists.length} artista{filteredArtists.length !== 1 ? 's' : ''}</p>
                <button onClick={selectAll} className="text-xs text-primary hover:underline flex items-center gap-1">
                  <CheckSquare size={11} /> Seleccionar todos
                </button>
                {selectedIds.size > 0 && (
                  <button onClick={clearAll} className="text-xs text-admin-muted hover:text-admin-foreground flex items-center gap-1">
                    <X size={11} /> Limpiar ({selectedIds.size})
                  </button>
                )}
              </div>

              {/* Artist grid */}
              {filteredArtists.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {filteredArtists.map(r => {
                    const isSelected  = selectedIds.has(r.userId)
                    const displayName = r.name ?? r.email
                    const label       = formatCategoryLabel(r.agencyProfile || r.category, r.esProfesor)
                    return (
                      <div
                        key={r.userId}
                        onClick={() => toggleRecipient(r.userId)}
                        className={`relative cursor-pointer rounded-lg overflow-hidden aspect-[3/4] border transition-all ${isSelected ? 'ring-2 ring-primary border-primary' : 'border-admin-border'}`}
                      >
                        <div className="absolute top-1.5 left-1.5 z-20">
                          {isSelected
                            ? <CheckSquare size={14} className="text-primary drop-shadow" />
                            : <Square size={14} className="text-white/60 drop-shadow" />}
                        </div>
                        {r.slug && (
                          <Link href={`/artistas/${r.slug}?from=panel`} onClick={e => e.stopPropagation()}
                            className="absolute top-1.5 right-1.5 z-20 p-1 rounded-full bg-zinc-900/70 backdrop-blur text-white/70 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                          </Link>
                        )}
                        {r.photo ? (
                          <Image src={urlFor(r.photo).width(160).height(213).url()} alt={displayName} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-admin-elevated flex items-center justify-center">
                            <span className="text-xl font-heading text-admin-muted">{displayName[0]?.toUpperCase()}</span>
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/50 to-transparent pt-6 pb-2 px-2">
                          <p className="text-[11px] font-heading text-white truncate">{displayName}</p>
                          {label && <p className="text-[9px] text-primary truncate">{label}</p>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Admin list */}
              {admins.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-admin-muted uppercase tracking-wide mb-1.5">Administradores</p>
                  <div className="border border-admin-border rounded-lg divide-y divide-admin-border">
                    {admins.map(r => (
                      <label key={r.userId} className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-white/5 cursor-pointer">
                        <input type="checkbox" checked={selectedIds.has(r.userId)} onChange={() => toggleRecipient(r.userId)} />
                        <span className="flex-1 text-admin-foreground">{r.name || r.email}</span>
                        <span className="shrink-0 px-2 py-0.5 rounded-full text-[0.68rem] font-semibold bg-white/10 text-admin-muted">Admin</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {feedback && <p className="text-sm text-admin-foreground bg-white/5 rounded-lg px-3 py-2">{feedback}</p>}

          <button onClick={handleSend} disabled={sending}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
            <Send size={15} />
            {sending ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </div>

        {/* Mensajes enviados */}
        <div className="bg-admin-elevated border border-admin-border rounded-xl p-6 h-fit">
          <h2 className="font-heading text-2xl tracking-wide text-admin-foreground mb-4">Mensajes enviados</h2>
          <div className="divide-y divide-admin-border">
            {history.length === 0 && (
              <p className="text-sm text-admin-muted py-6 text-center">Aún no has enviado mensajes.</p>
            )}
            {history.map(m => (
              <div key={m.id} className="py-3 group flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-admin-foreground truncate">{m.subject}</p>
                  <p className="text-xs text-admin-muted mt-0.5">
                    {m.audience === 'ALL' ? 'Todos' : 'Selección'} · {m.recipientCount} dest.
                  </p>
                  <p className="text-xs text-admin-muted mt-0.5">
                    {new Date(m.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <button
                  onClick={() => deleteMessage(m.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-red-500/10 text-admin-muted hover:text-red-400"
                  title="Eliminar"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
