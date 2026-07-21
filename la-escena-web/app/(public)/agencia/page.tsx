import type { Metadata } from 'next'
import { getFeaturedArtists } from '@/lib/sanity'
import { getAvailableFilterOptions } from '@/lib/filters/getAvailableFilterOptions'
import AgencyClient from './AgencyClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Nuestro Talento',
  description:
    'Explora el catálogo de bailarines y artistas de La Escena. Filtra por estilo, ciudad, experiencia y arma tu shortlist.',
  openGraph: {
    title: 'Nuestro Talento | La Escena',
    description: 'Explora el catálogo completo de bailarines y artistas de la agencia.',
  },
}

export default async function AgenciaPage() {
  const artists = await getFeaturedArtists()
  const filterOptions = getAvailableFilterOptions(artists)

  return (
    <AgencyClient
      artists={artists}
      filterOptions={filterOptions}
      initialFilters={{
        city: '',
        category: ''
      }}
    />
  )
}
