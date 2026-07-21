import type { Metadata } from 'next'
import ContenidoClient from './ContenidoClient'

export const metadata: Metadata = {
  title: 'Creación de Contenido',
  description:
    'Producción audiovisual profesional: reels, kits de contenido y cobertura de eventos. La Escena, Colombia.',
}

export default function ContenidoPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-foreground py-20">
        <div className="container text-center space-y-4">
          <h1 className="font-heading text-5xl sm:text-7xl tracking-wide text-primary-foreground">
            Creación de <span className="text-secondary">Contenido</span>
          </h1>
          <p className="text-primary-foreground/60 max-w-lg mx-auto">
            Creamos contenido audiovisual estratégico para artistas, marcas y empresas que
            buscan conectar con su audiencia a través de la creatividad, la danza y el
            talento profesional. 
          </p>
        </div>
      </section>

      <ContenidoClient />
    </>
  )
}
