import { sanityClient } from '@/lib/sanity'

export async function getPublicArtists() {
  return sanityClient.fetch(`
    *[_type == "artist" && visible == true]{
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
  `)
}
