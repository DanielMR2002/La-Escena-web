import { getArtists } from '@/app/lib/sanity'
import AgencyClient from './AgencyClient'

export const dynamic = 'force-dynamic'


type PageProps = {
  searchParams: {
    city?: string
    category?: string
  }
}

export default async function AgenciaPage({ searchParams }: PageProps) {
  const artists = await getArtists()

  return (
    <AgencyClient
      artists={artists}
      initialFilters={{
        city: searchParams.city || '',
        category: searchParams.category || ''
      }}
    />
  )
}
