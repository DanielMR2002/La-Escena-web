import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import LogoutButton from "./LogoutButton"

export default async function ClienteHeaderBar() {
  const session = await getServerSession(authOptions)

  return (
    <header className="bg-zinc-900 text-zinc-100 px-8 py-4 flex items-center justify-between">
      <div>
        <span className="font-heading text-2xl text-primary tracking-wide">LA ESCENA</span>
        <p className="text-xs text-zinc-400 mt-0.5">Portal Cliente</p>
      </div>
      <div className="flex items-center gap-5">
        {session?.user?.email && (
          <span className="text-xs text-zinc-500 hidden sm:block">{session.user.email}</span>
        )}
        <LogoutButton />
      </div>
    </header>
  )
}
