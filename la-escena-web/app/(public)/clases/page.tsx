import type { Metadata } from 'next'
import { getTeachingArtists } from '@/lib/sanity'
import ClasesClient from './ClasesClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Clases de Baile',
  description:
    'Clases de baile personalizadas y grupales: salsa, bachata, dancehall, hip-hop y más. Profesores certificados en Colombia.',
}

export default async function ClasesPage() {
  const teachers = await getTeachingArtists()

  return (
    <>
      {/* HERO */}
      <section className="bg-foreground py-20">
        <div className="container text-center space-y-4">
          <h1 className="font-heading text-5xl sm:text-7xl tracking-wide text-primary-foreground">
            Clases de <span className="text-secondary">Baile</span>
          </h1>
          <p className="text-primary-foreground/60 max-w-lg mx-auto">
            Encuentra la clase ideal para ti. Contamos con profesores especializados en
            diferentes estilos de danza, disponibles para clases personalizadas y grupales,
            tanto para principiantes como para niveles avanzados.
          </p>
        </div>
      </section>

      <ClasesClient teachers={teachers} />
    </>
  )
}
