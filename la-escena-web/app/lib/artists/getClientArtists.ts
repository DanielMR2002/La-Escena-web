import { sanityClient } from '@/lib/sanity'

type ClientConfig = {
  clientId?: string
  allowedCategories?: string[]
}

export async function getClientArtists(config: ClientConfig) {
  const { clientId, allowedCategories } = config

  return sanityClient.fetch(
    `
    *[
      _type == "artist" &&
      visible == true &&

      // disponibilidad efectiva
      (
        !defined(adminAvailabilityOverride) && artistAvailability == true
        ||
        adminAvailabilityOverride == true
      )

      ${
        allowedCategories?.length
          ? `&& category in $allowedCategories`
          : ''
      }

      ${
        clientId
          ? `&& _id in *[_type == "client" && _id == $clientId][0].artists[]._ref`
          : ''
      }
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
      clientId,
      allowedCategories
    }
  )
}
