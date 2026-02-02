'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Home' },
  { href: '/agencia', label: 'Agencia' },
  { href: '/clases', label: 'Clases de baile' },
  { href: '/book', label: 'Book de fotos' },
  { href: '/contenido', label: 'Creación de contenido' },
  { href: '/about', label: 'About us' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/blog', label: 'Blog' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none' }}>
        {links.map(link => (
          <li key={link.href}>
            <Link
              href={link.href}
              style={{
                fontWeight: pathname === link.href ? 'bold' : 'normal'
              }}
            >
              {link.label}
            </Link>
          </li>
        ))}
        <li style={{ marginLeft: 'auto' }}>
          <Link href="/login">Iniciar sesión</Link>
        </li>
      </ul>
    </nav>
  )
}
