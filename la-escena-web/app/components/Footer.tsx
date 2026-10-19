import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground/80">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          <div className="space-y-4">
            <Image
              src="/logo-white.png"
              alt="La Escena"
              height={64}
              width={160}
              className="w-auto"
            />
            <p className="text-sm leading-relaxed text-primary-foreground/60">
              Agencia de bailarines y artistas escénicos. Promovemos, comercializamos y producimos servicios de artes escénicas.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="https://www.instagram.com/laescenadanceagency/" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://www.facebook.com/LaEscenaDanceAgency" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/la-escena-sas/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-heading text-xl tracking-wider text-primary-foreground uppercase">Servicios</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/agencia" className="hover:text-secondary transition-colors">Agencia de Talento</Link></li>
              <li><Link href="/clases" className="hover:text-secondary transition-colors">Clases de Baile</Link></li>
              <li><Link href="/book" className="hover:text-secondary transition-colors">Book de Fotos</Link></li>
              <li><Link href="/contenido" className="hover:text-secondary transition-colors">Creación de Contenido</Link></li>
              <li><Link href="/mentorias" className="hover:text-secondary transition-colors">Mentorías para Artistas</Link></li>
              <li><Link href="/show" className="hover:text-secondary transition-colors">Show</Link></li>
              <li><Link href="/direccion-creativa" className="hover:text-secondary transition-colors">Dirección Creativa y Artística</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-heading text-xl tracking-wider text-primary-foreground uppercase">Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-secondary transition-colors">Sobre Nosotros</Link></li>
              <li><Link href="/contacto" className="hover:text-secondary transition-colors">Contacto</Link></li>
              <li><Link href="/blog" className="hover:text-secondary transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-heading text-xl tracking-wider text-primary-foreground uppercase">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-secondary shrink-0" />
                <span>laescenas@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-secondary shrink-0" />
                <span>+57 314 776 7399</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-secondary shrink-0 mt-0.5" />
                <span>Colombia</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/40">
          <p>© {new Date().getFullYear()} La Escena S.A.S. Todos los derechos reservados.</p>
          <p>La Escena S.A.S · NIT: 901295556</p>
        </div>
      </div>
    </footer>
  );
}
