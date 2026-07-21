import Link from "next/link"
import { ReactNode } from "react"
import LogoutButton from "./LogoutButton"

export default function ArtistaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-zinc-900 text-zinc-100 px-8 py-4 flex items-center justify-between">
        <div>
          <span className="font-heading text-2xl text-primary tracking-wide">LA ESCENA</span>
          <p className="text-xs text-zinc-400 mt-0.5">Portal Artista</p>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/artista" className="text-sm text-zinc-300 hover:text-white transition-colors">
            Mi Perfil
          </Link>
          <Link href="/artista/noticias" className="text-sm text-zinc-300 hover:text-white transition-colors">
            Noticias
          </Link>
          <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">
            ← Volver al sitio
          </Link>
          <LogoutButton />
        </nav>
      </header>
      <main>{children}</main>
    </div>
  )
}
