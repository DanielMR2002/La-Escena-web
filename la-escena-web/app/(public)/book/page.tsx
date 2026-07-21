import type { Metadata } from 'next'
import BookClient from './BookClient'
import GalleryCarousel from './GalleryCarousel'
import { getGalleryPhotos } from '@/lib/sanity'

export const metadata: Metadata = {
  title: 'Book de Fotos',
  description:
    'Sesiones fotográficas profesionales para artistas. Paquetes media y jornada completa con La Escena en Colombia.',
}

export default async function BookPage() {
  const gallery = await getGalleryPhotos()

  return (
    <>
      {/* HERO */}
      <section className="bg-foreground py-20">
        <div className="container text-center space-y-4">
          <h1 className="font-heading text-5xl sm:text-7xl tracking-wide text-primary-foreground">
            Book de fotos: <span className="text-secondary">tu imagen profesional</span>
          </h1>
          <p className="text-primary-foreground/60 max-w-lg mx-auto">
            Te ayudamos a construir una imagen profesional para ingresar, permanecer y crecer dentro de la industria artística.
          </p>
        </div>
      </section>

      {/* GALERÍA */}
      {gallery.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container">
            <h2 className="font-heading text-4xl tracking-wide text-center mb-12">
              Galería
            </h2>
            <GalleryCarousel photos={gallery} />
          </div>
        </section>
      )}

      <BookClient />
    </>
  )
}
