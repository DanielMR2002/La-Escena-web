import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import LogoutButton from "./LogoutButton"

export default async function ClienteHeaderBar() {
  const session = await getServerSession(authOptions)

  let badgeStatus: "PENDING" | "APPROVED" | null = null

  if (session?.user.id) {
    const latest = await prisma.clientShortlist.findFirst({
      where:   { clientId: session.user.id },
      orderBy: { createdAt: "desc" },
      select:  { status: true },
    })
    if (latest?.status === "PENDING" || latest?.status === "APPROVED") {
      badgeStatus = latest.status
    }
  }

  return (
    <header className="bg-zinc-900 text-zinc-100 px-8 py-4 flex items-center justify-between">
      <div>
        <span className="font-heading text-2xl text-primary tracking-wide">LA ESCENA</span>
        <p className="text-xs text-zinc-400 mt-0.5">Portal Cliente</p>
      </div>

      <div className="flex items-center gap-5">
        <Link
          href="/cliente/lista"
          className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors"
        >
          Mi Lista
          {badgeStatus === "PENDING" && (
            <span className="px-2 py-0.5 text-xs bg-amber-500 text-white rounded-full font-medium leading-none">
              En revisión
            </span>
          )}
          {badgeStatus === "APPROVED" && (
            <span className="px-2 py-0.5 text-xs bg-green-500 text-white rounded-full font-medium leading-none">
              Aprobada
            </span>
          )}
        </Link>
        <LogoutButton />
      </div>
    </header>
  )
}
