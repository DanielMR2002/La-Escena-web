export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { sanityClient, urlFor } from "@/lib/sanity"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ name: null, photoUrl: null })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { artistProfile: true },
  })

  let photoUrl: string | null = null
  let name: string | null = user?.name ?? null

  if (user?.artistProfile?.sanityId) {
    const sanity = await sanityClient.fetch(
      `*[_type == "artist" && _id == $id][0]{ name, "photo": photos[0] }`,
      { id: user.artistProfile.sanityId }
    )
    if (sanity?.photo) {
      photoUrl = urlFor(sanity.photo).width(56).height(56).url()
    }
    if (sanity?.name) {
      name = sanity.name
    }
  }

  return NextResponse.json({ name, photoUrl })
}
