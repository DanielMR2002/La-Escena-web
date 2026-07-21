'use client'

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession, signOut } from "next-auth/react"

const navLinks = [
  { label: "Inicio",          path: "/" },
  { label: "Agencia",         path: "/agencia" },
  { label: "Clases de Baile", path: "/clases" },
  { label: "Book de Fotos",   path: "/book" },
  { label: "Contenido",       path: "/contenido" },
  { label: "About Us",        path: "/about" },
  { label: "Contacto",        path: "/contacto" },
  { label: "Blog",            path: "/blog" },
]

type MenuItem = { label: string; href: string }

function getMenuItems(role: string): MenuItem[] {
  if (role === "ADMIN") {
    return [
      { label: "Panel Admin", href: "/admin" },
      { label: "Mi Perfil",   href: "/artista" },
      { label: "Noticias",    href: "/admin/blog-interno" },
    ]
  }
  if (role === "ARTIST") {
    return [
      { label: "Mi Perfil", href: "/artista" },
      { label: "Noticias",  href: "/artista/noticias" },
    ]
  }
  if (role === "CLIENT") {
    return [{ label: "Mi Panel", href: "/cliente" }]
  }
  return []
}

function getLabel(role?: string) {
  if (role === "ADMIN")  return "Admin"
  if (role === "CLIENT") return "Mi Panel"
  return "Mi Cuenta"
}

type MeData = { name: string | null; photoUrl: string | null }

export default function Navbar() {
  const [isOpen,   setIsOpen]   = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [me,       setMe]       = useState<MeData | null>(null)
  const pathname = usePathname()
  const menuRef  = useRef<HTMLDivElement>(null)
  const { data: session, status } = useSession()

  const role  = session?.user.role
  const items = role ? getMenuItems(role) : []

  useEffect(() => {
    if (status !== "authenticated") { setMe(null); return }
    fetch("/api/me").then(r => r.json()).then(setMe).catch(() => {})
  }, [status])

  // Cierra dropdown al hacer clic fuera
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Cierra ambos menús al cambiar de ruta
  useEffect(() => {
    setIsOpen(false)
    setMenuOpen(false)
  }, [pathname])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-foreground/95 backdrop-blur-md">
      <div className="container flex items-center justify-between h-20">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-white.png"
            alt="La Escena"
            height={36}
            width={60}
            className="w-auto"
          />
        </Link>

        {/* DESKTOP NAV LINKS */}
        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                href={link.path}
                className={`px-3 py-2 text-xs font-medium tracking-wide uppercase transition-colors hover:text-secondary ${
                  pathname === link.path
                    ? "text-secondary"
                    : "text-primary-foreground/80"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* DESKTOP AUTH */}
        <div className="hidden lg:block">

          {/* Loading */}
          {status === "loading" && (
            <div className="w-32 h-10 bg-primary/20 rounded-sm animate-pulse" />
          )}

          {/* No autenticado */}
          {status === "unauthenticated" && (
            <Link
              href="/login"
              className="inline-flex items-center px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-colors"
            >
              Iniciar Sesión
            </Link>
          )}

          {/* Autenticado → dropdown */}
          {status === "authenticated" && (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-sm hover:bg-primary/90 transition-colors"
              >
                {me?.photoUrl ? (
                  <Image
                    src={me.photoUrl}
                    alt=""
                    width={28}
                    height={28}
                    className="rounded-full object-cover w-7 h-7 shrink-0"
                  />
                ) : null}
                <span className="uppercase tracking-wider">
                  {me?.name ?? getLabel(role)}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-zinc-900 rounded-lg shadow-2xl border border-zinc-800 py-1 z-50"
                  >
                    {items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                    <div className="my-1 border-t border-zinc-800" />
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left px-4 py-2.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                      Cerrar sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-primary-foreground p-2"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-foreground border-t border-primary-foreground/10 overflow-hidden"
          >
            <ul className="container py-6 space-y-1">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 text-sm font-medium uppercase tracking-wide transition-colors hover:text-secondary ${
                      pathname === link.path
                        ? "text-secondary"
                        : "text-primary-foreground/80"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              {/* Auth — mobile */}
              <li className="pt-4 border-t border-primary-foreground/10">
                {status === "unauthenticated" && (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center px-6 py-3 bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-wider rounded-sm"
                  >
                    Iniciar Sesión
                  </Link>
                )}

                {status === "authenticated" && (
                  <div className="space-y-1">
                    {items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-3 text-sm font-medium text-primary-foreground/80 hover:text-secondary transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
