'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminArtistGrid from './AdminArtistGrid'
import AgencyManagerModal from './AgencyManagerModal'
import type { ArtistItem } from '@/app/admin/clients/ArtistCatalog'

export default function AdminArtistsPage() {
  const [artists, setArtists]           = useState<ArtistItem[]>([])
  const [showAgencyModal, setShowAgencyModal] = useState(false)

  useEffect(() => {
    fetch('/api/admin/artists/list')
      .then(r => r.json())
      .then(data => setArtists(data))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-4xl">Artistas</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAgencyModal(true)}
            className="px-4 py-2 text-sm font-medium border border-zinc-300 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            Gestionar Agencia
          </button>
          <Link href="/admin/artists/revisions">
            <button className="px-4 py-2 text-sm font-medium border border-zinc-300 rounded-lg hover:bg-zinc-100 transition-colors">
              Ver Revisiones
            </button>
          </Link>
          <Link href="/admin/artists/create">
            <button className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-red-700 transition-colors">
              + Crear Artista
            </button>
          </Link>
        </div>
      </div>

      <AdminArtistGrid artists={artists} />

      {showAgencyModal && (
        <AgencyManagerModal onClose={() => setShowAgencyModal(false)} />
      )}
    </div>
  )
}
