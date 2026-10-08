'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export default function DeleteAdminButton({ adminId, adminName }: { adminId: string; adminName: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar el admin "${adminName}"? Esta acción no se puede deshacer.`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/admins/${adminId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error ?? 'Error al eliminar el admin.')
        return
      }
      router.refresh()
    } catch {
      alert('Error de red al eliminar el admin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
      aria-label="Eliminar admin"
      title="Eliminar admin"
    >
      <Trash2 size={15} />
    </button>
  )
}
