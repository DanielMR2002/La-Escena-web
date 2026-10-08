'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export default function DeleteArtistButton({ artistProfileId, artistName }: { artistProfileId: string; artistName: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar el artista "${artistName}"? Esta acción eliminará su cuenta y no se puede deshacer.`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/artists/${artistProfileId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error ?? 'Error al eliminar el artista.')
        return
      }
      router.push('/admin/artists')
    } catch {
      alert('Error de red al eliminar el artista.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      <Trash2 size={15} />
      {loading ? 'Eliminando...' : 'Eliminar artista'}
    </button>
  )
}
