export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { sanityWriteClient } from "@/lib/sanity"
import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()

    const { id } = await params

    const profile = await prisma.artistProfile.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!profile) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 })
    }

    if (profile.sanityId) {
      return NextResponse.json({ error: "Already linked to Sanity" }, { status: 400 })
    }

    const email = profile.user.email
    const slug = email.split("@")[0] + "-" + Date.now()

    const sanityDoc = await sanityWriteClient.create({
      _type: "artist",
      name: email.split("@")[0],
      slug: { _type: "slug", current: slug },
      photos: [],
      category: "bailarin",
      styles: [],
      description: "",
      experience: 0,
      city: "",
      age: null,
      height: null,
      hashtags: [],
      artistAvailability: true,
      visible: true,
    })

    await prisma.artistProfile.update({
      where: { id },
      data: { sanityId: sanityDoc._id },
    })

    return NextResponse.json({ success: true, sanityId: sanityDoc._id })

  } catch (error) {
    console.error("CREATE SANITY PROFILE ERROR:", error)
    return NextResponse.json({ error: "Error creating Sanity profile" }, { status: 500 })
  }
}
