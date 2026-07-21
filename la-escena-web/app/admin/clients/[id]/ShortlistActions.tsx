'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X } from 'lucide-react'

export default function ShortlistActions({ id }: { id: string }) {
  const router = useRouter()
  const [comment, setComment]       = useState('')
  const [showReject, setShowReject] = useState(false)
  const [loading, setLoading]       = useState<'APPROVED' | 'REJECTED' | null>(null)

  async function review(action: 'APPROVED' | 'REJECTED') {
    setLoading(action)
    try {
      await fetch(`/api/admin/shortlists/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, adminComment: comment }),
      })
      router.refresh()
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="pt-4 border-t border-zinc-100 space-y-3">
      {showReject && (
        <textarea
          placeholder="Comentario para el cliente (opcional)..."
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      )}
      <div className="flex gap-2">
        <button
          onClick={() => review('APPROVED')}
          disabled={!!loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-60 transition-colors"
        >
          <Check size={14} />
          {loading === 'APPROVED' ? 'Aprobando...' : 'Aprobar'}
        </button>

        {!showReject ? (
          <button
            onClick={() => setShowReject(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
          >
            <X size={14} />
            Rechazar
          </button>
        ) : (
          <button
            onClick={() => review('REJECTED')}
            disabled={!!loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-60 transition-colors"
          >
            <X size={14} />
            {loading === 'REJECTED' ? 'Rechazando...' : 'Confirmar rechazo'}
          </button>
        )}
      </div>
    </div>
  )
}
