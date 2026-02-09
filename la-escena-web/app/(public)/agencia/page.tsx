import { getArtists } from '@/lib/sanity'
import AgencyClient from './AgencyClient'

export const dynamic = 'force-dynamic'

export default async function AgenciaPage() {
  const artists = await getArtists()

  console.log('ARTISTS PAGE', artists)

  return (
    <AgencyClient
      artists={artists}
      initialFilters={{
        city: '',
        category: ''
      }}
    />
  )
}
