import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { sanityWriteClient as sanityClient } from "@/lib/sanity"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const {
    sanityId,
    name,
    city,
    age,
    height,
    experience,
    projectTypes,
    description,
    category,
    agencyProfile,
    tipoPerfil,
    complexion,
    eyeColor,
    hairType,
    hairLength,
    hairColor,
    skills,
    hashtags,
    styles,
    estilosPrincipales,
    estilosSecundarios,
    tiposClase,
    artistAvailability,
    trayectoria,
    cvUrl,
    instagram,
    tiktok,
    youtube,
    socialLinksPublic,
    genero,
    generoOtro,
    pruebasTrabajo,
  } = body

  if (!sanityId) {
    return NextResponse.json({ error: "Missing sanityId" }, { status: 400 })
  }

  const patch: Record<string, any> = {}

  if (name           !== undefined) patch.name           = name
  if (city           !== undefined) patch.city           = city
  if (age            !== undefined) patch.age            = age
  if (height         !== undefined) patch.height         = height
  if (experience     !== undefined) patch.experience     = experience
  if (projectTypes   !== undefined) patch.projectTypes   = projectTypes
  if (description    !== undefined) patch.description    = description
  if (category       !== undefined) patch.category       = category
  if (tipoPerfil     !== undefined) patch.tipoPerfil     = tipoPerfil
  if (complexion     !== undefined) patch.complexion     = complexion
  if (eyeColor       !== undefined) patch.eyeColor       = eyeColor
  if (hairType       !== undefined) patch.hairType       = hairType
  if (hairLength     !== undefined) patch.hairLength     = hairLength
  if (hairColor      !== undefined) patch.hairColor      = hairColor
  if (skills         !== undefined) patch.skills         = skills
  if (hashtags       !== undefined) patch.hashtags       = hashtags
  if (styles         !== undefined) patch.styles         = styles
  if (estilosPrincipales !== undefined) patch.estilosPrincipales = estilosPrincipales
  if (estilosSecundarios !== undefined) patch.estilosSecundarios = estilosSecundarios
  if (tiposClase     !== undefined) patch.tiposClase     = tiposClase
  if (artistAvailability !== undefined) patch.artistAvailability = artistAvailability
  if (trayectoria    !== undefined) patch.trayectoria    = trayectoria
  if (cvUrl          !== undefined) patch.cvUrl          = cvUrl
  if (instagram      !== undefined) patch.instagram      = instagram
  if (tiktok         !== undefined) patch.tiktok         = tiktok
  if (youtube        !== undefined) patch.youtube        = youtube
  if (socialLinksPublic !== undefined) patch.socialLinksPublic = socialLinksPublic
  if (genero         !== undefined) patch.genero         = genero
  if (generoOtro     !== undefined) patch.generoOtro     = generoOtro

  if (agencyProfile !== undefined) {
    patch.agencyProfile = Array.isArray(agencyProfile)
      ? agencyProfile
      : agencyProfile
        ? [agencyProfile]
        : []
  }

  if (Array.isArray(pruebasTrabajo) && pruebasTrabajo.length > 0) {
    try {
      await sanityClient
        .patch(sanityId)
        .setIfMissing({ pruebasTrabajo: [] })
        .append("pruebasTrabajo", pruebasTrabajo)
        .commit()
    } catch (err) {
      console.error("Error appending pruebasTrabajo:", err)
    }
  }

  try {
    await sanityClient.patch(sanityId).set(patch).commit()
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Error updating artist profile:", err)
    return NextResponse.json({ error: "Error updating artist" }, { status: 500 })
  }
}
