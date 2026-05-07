'use client'

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Inicio", path: "/" },
  { label: "Agencia", path: "/agencia" },
  { label: "Clases de Baile", path: "/clases" },
  { label: "Book de Fotos", path: "/book" },
  { label: "Contenido", path: "/contenido" },
  { label: "About Us", path: "/about" },
  { label: "Contacto", path: "/contacto" },
  { label: "Blog", path: "/blog" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-foreground/95 backdrop-blur-md">
      <div className="container flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-white.png"
            alt="La Escena"
            height={48}
            width={120}
            className="w-auto"
          />
        </Link>

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

        <Link
          href="/login"
          className="hidden lg:inline-flex items-center px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-colors"
        >
          Iniciar Sesión
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-primary-foreground p-2"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

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
              <li className="pt-4">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-6 py-3 bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-wider rounded-sm"
                >
                  Iniciar Sesión
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}