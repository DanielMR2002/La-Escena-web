import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { sanityWriteClient } from "@/lib/sanity"

export async function POST(req: Request) {
  try {
    await requireAdmin()

    const {
      sanityId,
      name, city, category, experience, description,
      projectTypes, experienceDescription, featuredProjects,
      age, height, hashtags, cvUrl, trayectoria, artistAvailability,
      esProfesor, tiposClase,
      complexion, eyeColor, hairType, hairLength, hairColor,
      skills, agencyProfile,
    } = await req.json()

    if (!sanityId) {
      return NextResponse.json({ error: "Missing sanityId" }, { status: 400 })
    }

    await sanityWriteClient
      .patch(sanityId)
      .set({
        name, city, category, experience, description,
        projectTypes, experienceDescription, featuredProjects,
        age, height, hashtags, cvUrl, trayectoria, artistAvailability,
        esProfesor, tiposClase,
        complexion, eyeColor, hairType, hairLength, hairColor,
        skills, agencyProfile,
        updatedAt: new Date().toISOString(),
      })
      .commit()

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("ERROR update-profile:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
