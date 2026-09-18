"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Star,
  FileText,
  Bell,
  Image as ImageIcon,
  Shield,
  Mail,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from "lucide-react"
import { signOut } from "next-auth/react"

type NavItem = {
  label: string
  href: string
  icon: typeof LayoutDashboard
  badge?: number
}

type MeData = { name: string | null; email: string | null; unreadMessages?: number }

export default function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [me, setMe] = useState<MeData | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    setIsDesktop(mq.matches)
    setMounted(true)

    function handleChange(e: MediaQueryListEvent) {
      setIsDesktop(e.matches)
    }
    mq.addEventListener("change", handleChange)
    return () => mq.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    try {
      const stored = localStorage.getItem("admin-sidebar-collapsed")
      if (stored === "1") setCollapsed(true)
    } catch {}
  }, [])

  function toggleCollapsed() {
    setCollapsed(prev => {
      const next = !prev
      try {
        localStorage.setItem("admin-sidebar-collapsed", next ? "1" : "0")
      } catch {}
      return next
    })
  }

  useEffect(() => {
    fetch("/api/me")
      .then(r => r.json())
      .then(setMe)
      .catch(() => {})
  }, [])

  useEffect(() => {
    function handleRead() {
      setMe(prev => prev ? { ...prev, unreadMessages: Math.max(0, (prev.unreadMessages ?? 0) - 1) } : prev)
    }
    window.addEventListener("la-escena:message-read", handleRead)
    return () => window.removeEventListener("la-escena:message-read", handleRead)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const unread = me?.unreadMessages ?? 0

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Artistas", href: "/admin/artists", icon: Users },
    { label: "Clientes", href: "/admin/clients", icon: Briefcase },
    { label: "Agencia", href: "/admin/agencia", icon: Star },
    { label: "Blog", href: "/admin/blog", icon: FileText },
    { label: "Noticias", href: "/admin/blog-interno", icon: Bell },
    { label: "Galería", href: "/admin/galeria", icon: ImageIcon },
    { label: "Admins", href: "/admin/admins", icon: Shield },
    { label: "Buzón", href: "/admin/mensajes", icon: Mail, badge: unread },
  ]

  const secondaryItems = [
    { label: "Mi Perfil", href: "/artista" },
    { label: "Volver al sitio", href: "/" },
  ]

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin"
    return pathname === href || pathname.startsWith(href + "/")
  }

  const initials = (me?.name ?? me?.email ?? "A")[0]?.toUpperCase() ?? "A"

  // Antes de montar no hay forma de saber el viewport real en el servidor,
  // así que antes del mount se asume escritorio (caso más común) para no
  // mostrar el sidebar de bienvenida vacío en el primer paint. Una vez
  // montado, isDesktop manda: SOLO una de las dos ramas se renderiza —
  // nunca ambas — por construcción, sin depender de CSS para ocultar.
  const showDesktop = !mounted || isDesktop

  if (showDesktop) {
    return (
      <aside
        className={`flex flex-col shrink-0 bg-admin-sidebar border-r border-admin-border transition-all duration-200 ${
          collapsed ? "w-20" : "w-60"
        }`}
      >
        <div className="relative px-4 py-6 border-b border-admin-border flex items-center justify-center">
          {collapsed ? (
            <span className="font-heading text-xl text-primary">LE</span>
          ) : (
            <div>
              <h2 className="font-heading text-2xl text-primary tracking-wide">LA ESCENA</h2>
              <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold tracking-wide bg-primary/15 text-primary rounded">
                ADMIN
              </span>
            </div>
          )}
          <button
            onClick={toggleCollapsed}
            className="absolute -right-3 top-8 w-6 h-6 flex items-center justify-center rounded-full bg-admin-elevated border border-admin-border text-admin-muted hover:text-admin-foreground transition-colors"
            aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(item => (
            <SidebarLink key={item.href} item={item} active={isActive(item.href)} collapsed={collapsed} />
          ))}
          <div className="my-3 border-t border-admin-border" />
          {secondaryItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center rounded-lg text-sm text-admin-muted hover:text-admin-foreground hover:bg-white/5 transition-colors ${
                collapsed ? "justify-center px-2 py-2" : "px-3 py-2"
              }`}
            >
              {collapsed ? item.label[0] : item.label}
              {collapsed && (
                <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap px-2 py-1 rounded-md bg-admin-elevated border border-admin-border text-xs text-admin-foreground opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <SidebarFooter me={me} initials={initials} collapsed={collapsed} />
      </aside>
    )
  }

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="flex items-center justify-between px-4 h-16 bg-admin-sidebar border-b border-admin-border shrink-0">
        <span className="font-heading text-xl text-primary tracking-wide">LA ESCENA</span>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-admin-foreground p-2"
          aria-label="Abrir menú"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-admin-sidebar border-r border-admin-border flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-6 border-b border-admin-border">
                <div>
                  <h2 className="font-heading text-2xl text-primary tracking-wide">LA ESCENA</h2>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold tracking-wide bg-primary/15 text-primary rounded">
                    ADMIN
                  </span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="text-admin-muted hover:text-admin-foreground">
                  <X size={22} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {navItems.map(item => (
                  <SidebarLink key={item.href} item={item} active={isActive(item.href)} collapsed={false} />
                ))}
                <div className="my-3 border-t border-admin-border" />
                {secondaryItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-3 py-2 rounded-lg text-sm text-admin-muted hover:text-admin-foreground hover:bg-white/5 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <SidebarFooter me={me} initials={initials} collapsed={false} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function SidebarLink({ item, active, collapsed }: { item: NavItem; active: boolean; collapsed: boolean }) {
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      className={`group relative flex items-center gap-3 rounded-lg text-sm transition-colors border-l-[3px] ${
        collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"
      } ${
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-transparent text-zinc-400 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon size={18} className="shrink-0" />
      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
      {!collapsed && !!item.badge && (
        <span className="shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-primary text-white text-[11px] font-semibold">
          {item.badge}
        </span>
      )}
      {collapsed && !!item.badge && (
        <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-primary" />
      )}
      {collapsed && (
        <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap px-2 py-1 rounded-md bg-admin-elevated border border-admin-border text-xs text-admin-foreground opacity-0 group-hover:opacity-100 transition-opacity z-50">
          {item.label}
        </span>
      )}
    </Link>
  )
}

function SidebarFooter({ me, initials, collapsed }: { me: MeData | null; initials: string; collapsed: boolean }) {
  if (collapsed) {
    return (
      <div className="p-3 border-t border-admin-border flex flex-col items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-heading text-sm shrink-0">
          {initials}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-admin-muted hover:text-admin-foreground transition-colors p-1.5"
          aria-label="Cerrar sesión"
        >
          <LogOut size={16} />
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 border-t border-admin-border">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-heading text-sm shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-admin-foreground truncate">{me?.name ?? "Admin"}</p>
          <p className="text-xs text-admin-muted truncate">{me?.email ?? ""}</p>
        </div>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-admin-muted hover:text-admin-foreground hover:bg-white/5 transition-colors"
      >
        <LogOut size={15} />
        Cerrar sesión
      </button>
    </div>
  )
}
