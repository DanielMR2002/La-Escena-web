'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export default function DeleteClientButton({ clientId, clientName }: { clientId: string; clientName: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar el cliente "${clientName}"? Esta acción eliminará su cuenta y no se puede deshacer.`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/clients/${clientId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error ?? 'Error al eliminar el cliente.')
        return
      }
      router.push('/admin/clients')
    } catch {
      alert('Error de red al eliminar el cliente.')
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
      {loading ? 'Eliminando...' : 'Eliminar cliente'}
    </button>
  )
}
