'use client'

import { useEffect, useMemo, useState } from 'react'
import { Send } from 'lucide-react'

type RecipientOption = {
  userId: string
  name: string | null
  email: string
  role: 'ARTIST' | 'ADMIN'
}

type SentMessage = {
  id: string
  subject: string
  audience: 'ALL' | 'SELECTED'
  recipientCount: number
  createdAt: string
}

export default function AdminMessagesPage() {
  const [recipients, setRecipients] = useState<RecipientOption[]>([])
  const [history, setHistory] = useState<SentMessage[]>([])

  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [audience, setAudience] = useState<'ALL' | 'SELECTED'>('ALL')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')

  const [sending, setSending] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

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

  const filteredRecipients = useMemo(() => {
    const q = search.trim().toLowerCase()
    const unique = recipients.filter((r, i, arr) => arr.findIndex(x => x.userId === r.userId) === i)
    if (!q) return unique
    return unique.filter(r => (r.name ?? r.email).toLowerCase().includes(q))
  }, [recipients, search])

  function toggleRecipient(userId: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(userId)) next.delete(userId)
      else next.add(userId)
      return next
    })
  }

  async function handleSend() {
    if (!subject.trim() || !body.trim()) {
      setFeedback('Falta asunto o mensaje.')
      return
    }
    if (audience === 'SELECTED' && selectedIds.size === 0) {
      setFeedback('Selecciona al menos un destinatario.')
      return
    }

    setSending(true)
    setFeedback(null)

    try {
      const res = await fetch('/api/admin/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          body,
          audience,
          recipientUserIds: audience === 'SELECTED' ? Array.from(selectedIds) : undefined,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setFeedback(data.error || 'No se pudo enviar el mensaje.')
      } else {
        setFeedback(`Mensaje enviado a ${data.recipientCount} destinatario(s).${data.emailFailures > 0 ? ` (${data.emailFailures} correo(s) fallaron)` : ''}`)
        setSubject('')
        setBody('')
        setSelectedIds(new Set())
        setAudience('ALL')
        loadHistory()
      }
    } catch {
      setFeedback('No se pudo enviar el mensaje.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-1">
          Comunicaciones internas
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl tracking-wide text-admin-foreground">
          Buzón de mensajes
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Nuevo mensaje */}
        <div className="lg:col-span-2 bg-admin-elevated border border-admin-border rounded-xl p-6 space-y-5 h-fit">
          <h2 className="font-heading text-2xl tracking-wide text-admin-foreground">Nuevo mensaje</h2>

          <div>
            <label className="block text-sm font-medium text-admin-muted mb-1.5">Asunto</label>
            <input
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Asunto del mensaje"
              className="w-full px-3 py-2 border border-admin-border bg-admin-background rounded-lg text-sm text-admin-foreground placeholder:text-admin-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-admin-muted mb-1.5">Mensaje</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Escribe el contenido del mensaje..."
              className="w-full h-48 px-3 py-2 border border-admin-border bg-admin-background rounded-lg text-sm text-admin-foreground placeholder:text-admin-muted focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-admin-muted mb-1.5">Destinatarios</label>
            <div className="flex gap-2">
              <button
                onClick={() => setAudience('ALL')}
                className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                  audience === 'ALL'
                    ? 'bg-primary text-white border-primary'
                    : 'border-admin-border text-admin-muted hover:bg-white/5'
                }`}
              >
                Todos los artistas
              </button>
              <button
                onClick={() => setAudience('SELECTED')}
                className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                  audience === 'SELECTED'
                    ? 'bg-primary text-white border-primary'
                    : 'border-admin-border text-admin-muted hover:bg-white/5'
                }`}
              >
                Selección individual
              </button>
            </div>
          </div>

          {audience === 'SELECTED' && (
            <div>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por nombre..."
                className="w-full px-3 py-2 border border-admin-border bg-admin-background rounded-lg text-sm text-admin-foreground placeholder:text-admin-muted mb-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <div className="max-h-64 overflow-y-auto border border-admin-border rounded-lg divide-y divide-admin-border">
                {filteredRecipients.length === 0 && (
                  <p className="text-sm text-admin-muted px-3 py-4 text-center">Sin resultados.</p>
                )}
                {filteredRecipients.map(r => (
                  <label
                    key={r.userId}
                    className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-white/5 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(r.userId)}
                      onChange={() => toggleRecipient(r.userId)}
                    />
                    <span className="flex-1 text-admin-foreground">{r.name || r.email}</span>
                    {r.role === 'ADMIN' && (
                      <span className="shrink-0 px-2 py-0.5 rounded-full text-[0.68rem] font-semibold bg-white/10 text-admin-muted">
                        Admin
                      </span>
                    )}
                  </label>
                ))}
              </div>
              {selectedIds.size > 0 && (
                <p className="text-xs text-admin-muted mt-1.5">{selectedIds.size} destinatario(s) seleccionado(s)</p>
              )}
            </div>
          )}

          {feedback && (
            <p className="text-sm text-admin-foreground bg-white/5 rounded-lg px-3 py-2">{feedback}</p>
          )}

          <button
            onClick={handleSend}
            disabled={sending}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
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
              <div key={m.id} className="py-3">
                <p className="text-sm font-medium text-admin-foreground">{m.subject}</p>
                <p className="text-xs text-admin-muted mt-0.5">
                  {m.audience === 'ALL' ? 'Todos (artistas y admins)' : 'Selección de destinatarios'} · {m.recipientCount} destinatario(s)
                </p>
                <p className="text-xs text-admin-muted mt-0.5">
                  {new Date(m.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
