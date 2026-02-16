import { getArtists } from '@/app/lib/sanity'
import { getAvailableFilterOptions } from '@/app/lib/filters/getAvailableFilterOptions'
import AgencyClient from './AgencyClient'

export const dynamic = 'force-dynamic'

export default async function AgenciaPage() {
  const artists = await getArtists()
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
