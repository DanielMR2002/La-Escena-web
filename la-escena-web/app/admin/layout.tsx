import Link from "next/link"
import { ReactNode } from "react"
import LogoutButton from "./LogoutButton"

const linkClass =
  "block px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-zinc-900 text-zinc-100 flex flex-col shrink-0">

        {/* Header */}
        <div className="px-6 py-8 border-b border-zinc-800">
          <h2 className="font-heading text-2xl text-primary tracking-wide">LA ESCENA</h2>
          <p className="text-xs text-zinc-400 mt-1">Panel Admin</p>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 p-4 flex-1">
          <Link href="/admin"               className={linkClass}>Dashboard</Link>
          <Link href="/admin/clients"       className={linkClass}>Clientes</Link>
          <Link href="/admin/artists"       className={linkClass}>Artistas</Link>
          <Link href="/admin/galeria"       className={linkClass}>Galería</Link>
          <Link href="/admin/blog"          className={linkClass}>Blog</Link>
          <Link href="/admin/blog-interno"  className={linkClass}>Noticias</Link>
          <Link href="/admin/admins"        className={linkClass}>Admins</Link>
          <Link href="/artista"             className={linkClass}>Mi Perfil</Link>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 space-y-1">
          <Link href="/" className="block px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
            ← Volver al sitio
          </Link>
          <LogoutButton />
        </div>

      </aside>

      <main className="flex-1 bg-zinc-50 p-10">
        {children}
      </main>
    </div>
  )
}
