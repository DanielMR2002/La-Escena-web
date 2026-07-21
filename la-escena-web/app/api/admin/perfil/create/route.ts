import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { ensureAdminArtistProfile } from "@/services/admin-profile.service"

export async function POST() {
  try {
    const session = await requireAdmin()
    const { profile, created } = await ensureAdminArtistProfile(session.user.id)

    return NextResponse.json({ success: true, alreadyExists: !created, sanityId: profile.sanityId })
  } catch (error) {
    console.error("ERROR admin/perfil/create:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
