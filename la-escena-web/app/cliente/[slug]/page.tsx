import { sanityClient } from '@/app/lib/sanity'
import { getClientArtists } from '@/app/lib/artists/getClientArtists'
import { getAvailableFilterOptions } from '@/app/lib/filters/getAvailableFilterOptions'
import AgencyClient from '@/app/(public)/agencia/AgencyClient'

export const dynamic = 'force-dynamic'

export default async function ClientPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const client = await sanityClient.fetch(
    `
    *[_type == "client" && slug.current == $slug && active == true][0]{
      _id,
      allowedCategories
    }
    `,
    { slug }
  )

  if (!client) {
    return <h1>Cliente no encontrado</h1>
  }

  const artists = await getClientArtists({
    clientId: client._id,
    allowedCategories: client.allowedCategories
  })

  const filterOptions = getAvailableFilterOptions(artists)

  return (
    <AgencyClient
      artists={artists}
      filterOptions={filterOptions}
      initialFilters={{ city: '', category: '' }}
    />
  )
}
