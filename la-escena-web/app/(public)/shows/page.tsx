import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shows & Entretenimiento',
  description:
    'Shows en vivo, performances y espectáculos profesionales para eventos corporativos, activaciones de marca y producciones. La Escena, Colombia.',
}

type ShowVideo = {
  title: string
  url: string | null
  type: 'youtube' | 'instagram' | 'none'
}

const videos: ShowVideo[] = [
  {
    title: "Show Movistar Arena con John Alex Castaño — Dirección coreográfica y staging",
    url: "https://www.instagram.com/reel/DdSIQUMxuza/?stkn=amFqandvcmdmbDNm",
    type: "instagram",
  },
  {
    title: "Travesía World Show Abril 2026 — Panaca Puntacana. Dirección coreográfica y artística",
    url: "https://www.youtube.com/watch?v=MDNU3LyvmbM",
    type: "youtube",
  },
  {
    title: "Show de Tennis por Colombiana en Colombiamoda — Dirección coreográfica y artística",
    url: "https://youtu.be/ytNrKQnmbNs?si=vwv21EFxlmWGi3Ho",
    type: "youtube",
  },
  {
    title: "Beychella — Show Tributo a Beyoncé. Dirección coreográfica, artística y general",
    url: "https://www.youtube.com/watch?v=cvHRsDMz9Qw&t=226s",
    type: "youtube",
  },
  {
    title: "Show BTG Pactual de los años 80 — Dirección coreográfica",
    url: "https://youtu.be/tsvc4Cp-MJs?si=C_LthYQFO7JuFQN3",
    type: "youtube",
  },
  {
    title: "Show para Johnny Walker en Feria de Flores — Dirección coreográfica y creativa",
    url: "https://youtu.be/2b84_FrlEY4?si=1DsTPDx4jTdE8IS4",
    type: "youtube",
  },
]

function toYoutubeEmbed(url: string): string {
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`
  }
  const idMatch = url.match(/[?&]v=([^&]+)/)
  if (idMatch) {
    const tMatch = url.match(/[?&]t=(\d+)s?/)
    const start = tMatch ? `?start=${tMatch[1]}` : ''
    return `https://www.youtube.com/embed/${idMatch[1]}${start}`
  }
  return url
}

export default function ShowsPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-foreground py-20">
        <div className="container text-center space-y-4">
          <h1 className="font-heading text-5xl sm:text-7xl tracking-wide text-primary-foreground">
            Hacemos el <span className="text-secondary">show a tu medida</span>
          </h1>
          <p className="text-primary-foreground/60 max-w-lg mx-auto">
            Espectáculos memorables para cualquier formato: eventos corporativos, activaciones de
            marca, lanzamientos y producciones en vivo.
          </p>
        </div>
      </section>

      {/* VIDEOS */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="font-heading text-4xl tracking-wide text-center mb-12">
            Nuestros Shows
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {videos.map((video, i) => (
              <div key={i} className="space-y-3">
                {video.type === 'youtube' && video.url && (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                    <iframe
                      src={toYoutubeEmbed(video.url)}
                      title={video.title}
                      loading="lazy"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                )}

                {video.type === 'instagram' && video.url && (
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex flex-col items-center justify-center gap-3 group block"
                  >
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                    <span className="text-white text-xs font-semibold uppercase tracking-wider">Ver en Instagram</span>
                  </a>
                )}

                {video.type === 'none' && (
                  <div className="aspect-video rounded-lg bg-muted border border-border flex items-center justify-center p-6 text-center">
                    <p className="text-sm text-muted-foreground">Próximamente disponible</p>
                  </div>
                )}

                <h3 className="font-heading text-lg tracking-wide text-center">{video.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 bg-foreground">
        <div className="container text-center space-y-6">
          <h2 className="font-heading text-4xl sm:text-6xl tracking-wide text-primary-foreground">
            ¿Tienes una propuesta o quieres crear un show para tu proyecto?
          </h2>
          <p className="text-primary-foreground/60 max-w-lg mx-auto">
            Escríbenos y cuéntanos tu idea para que podamos contactarte directamente.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-10 py-5 bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-all hover:gap-3"
          >
            Escríbenos / Cuéntanos tu propuesta <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}