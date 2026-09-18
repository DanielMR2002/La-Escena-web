'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminArtistGrid from './AdminArtistGrid'
import type { ArtistItem } from '@/app/admin/clients/ArtistCatalog'

export default function AdminArtistsPage() {
  const [artists, setArtists] = useState<ArtistItem[]>([])

  useEffect(() => {
    fetch('/api/admin/artists/list')
      .then(r => r.json())
      .then(data => setArtists(data))
  }, [])

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-1">
            {artists.length} perfiles registrados
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl tracking-wide text-admin-foreground">Artistas</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/agencia">
            <button className="px-4 py-2 text-sm font-medium border border-admin-border rounded-lg text-admin-foreground hover:bg-white/5 transition-colors">
              Gestionar Agencia
            </button>
          </Link>
          <Link href="/admin/artists/revisions">
            <button className="px-4 py-2 text-sm font-medium border border-admin-border rounded-lg text-admin-foreground hover:bg-white/5 transition-colors">
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
    </div>
  )
}
