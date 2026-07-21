import type { Metadata } from 'next'
import AboutClient from './AboutClient'

export const metadata: Metadata = {
  title: 'Sobre Nosotros',
  description:
    'La Escena S.A.S. — Agencia de bailarines registrada en Colombia. Conoce nuestro equipo y misión.',
}

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-foreground py-20">
        <div className="container text-center space-y-4">
          <h1 className="font-heading text-5xl sm:text-7xl tracking-wide text-primary-foreground">
            Sobre <span className="text-secondary">Nosotros</span>
          </h1>
        </div>
      </section>

      <AboutClient />
    </>
  )
}
