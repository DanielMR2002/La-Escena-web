import { sanityClient } from '@/lib/sanity'

type ClientArtistConfig = {
  allowedArtistIds?: string[]
  allowedCategories?: string[]
}

export async function getClientArtists(config: ClientArtistConfig) {
  const {
    allowedArtistIds = [],
    allowedCategories = []
  } = config

  return sanityClient.fetch(
    `
    *[
      _type == "artist"
      && visible == true
      && (
        $allowedArtistIds == [] || _id in $allowedArtistIds
      )
      && (
        $allowedCategories == [] || category in $allowedCategories
      )
    ]{
      _id,
      name,
      slug,
      city,
      category,
      styles,
      experience,
      photos,

      artistAvailability,
      adminAvailabilityOverride,

      "isAvailable": select(
        defined(adminAvailabilityOverride) => adminAvailabilityOverride,
        artistAvailability
      )
    }
  `,
    {
      allowedArtistIds,
      allowedCategories
    }
  )
}
