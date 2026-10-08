import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Play, ExternalLink } from 'lucide-react'

const SERVICIOS: Record<string, { title: string; desc: string }> = {
  'reels-tiktoks': {
    title: 'Reels & TikToks',
    desc: 'Contenido dinámico y de alto impacto para redes sociales. Creamos reels y TikToks con coreografías, conceptos creativos y talento profesional para aumentar el alcance y la conexión de tu marca con su audiencia.',
  },
  'kits-de-contenido': {
    title: 'Kits de Contenido',
    desc: 'Paquetes completos de fotografía y video para fortalecer tu presencia digital. Incluye la creación de contenido pensado para campañas, redes sociales y plataformas digitales, acompañado de una estrategia de marketing para maximizar su impacto.',
  },
  'cobertura-de-eventos': {
    title: 'Cobertura de Eventos',
    desc: 'Registro audiovisual profesional para eventos, lanzamientos, activaciones, shows y producciones. Capturamos los mejores momentos para convertirlos en contenido de alto valor.',
  },
  'trends-para-campanas': {
    title: 'Trends para Campañas',
    desc: 'Diseñamos y producimos trends para TikTok e Instagram junto a bailarines y creadores de contenido. Creamos campañas que integran la danza, el movimiento y la creatividad para potenciar el alcance y la recordación de tu marca.',
  },
}

export function generateStaticParams() {
  return Object.keys(SERVICIOS).map((servicio) => ({ servicio }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ servicio: string }>
}): Promise<Metadata> {
  const { servicio } = await params
  const data = SERVICIOS[servicio]
  if (!data) return { title: 'Creación de Contenido' }
  return {
    title: data.title,
    description: data.desc,
  }
}

// Portafolio específico por servicio
const PORTFOLIO_CAMPAIGNS: Record<string, { campaign: string; reels: { url: string; label: string }[]; cta?: { label: string } }[]> = {
  'reels-tiktoks': [
    {
      campaign: "Campaña Aria Vega — Warner, TOTOTO",
      reels: [
        { url: "https://www.instagram.com/reel/DbbbldCpupH", label: "Reel 1" },
        { url: "https://www.instagram.com/reel/DbLn654NTpn", label: "Reel 2" },
        { url: "https://www.instagram.com/reel/DbTqzZ5v2iO", label: "Reel 3" },
        { url: "https://www.instagram.com/reel/DbdYhZ2o5nD", label: "Reel 4" },
        { url: "https://www.instagram.com/reel/Dbb_wP8orvE", label: "Reel 5" },
      ],
    },
    {
      campaign: "Campaña Fresco — Co Discos: Me hace daño verte",
      reels: [],
      cta: { label: "Contratar este servicio" },
    },
  ],
}

// TODO: reemplazar con imágenes reales del portfolio de cada servicio
const PORTFOLIO_PLACEHOLDERS = Array.from({ length: 6 })

export default async function ServicioContenidoPage({
  params,
}: {
  params: Promise<{ servicio: string }>
}) {
  const { servicio } = await params
  const data = SERVICIOS[servicio]
  if (!data) notFound()

  return (
    <>
      {/* HERO */}
      <section className="bg-foreground py-20">
        <div className="container text-center space-y-4">
          <h1 className="font-heading text-5xl sm:text-7xl tracking-wide text-primary-foreground">
            {data.title}
          </h1>
          <p className="text-primary-foreground/60 max-w-lg mx-auto">{data.desc}</p>
        </div>
      </section>

      {/* PORTFOLIO */}
      {PORTFOLIO_CAMPAIGNS[servicio] ? (
        <section className="py-20 bg-foreground">
          <div className="container">
            <h2 className="font-heading text-4xl tracking-wide text-primary-foreground text-center mb-14">
              Portafolio
            </h2>
            <div className="space-y-14">
              {PORTFOLIO_CAMPAIGNS[servicio].map((camp) => (
                <div key={camp.campaign}>
                  <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-6">
                    {camp.campaign}
                  </p>
                  {camp.reels.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      {camp.reels.map((reel) => {
                        const code = reel.url.split('/reel/')[1]?.replace(/\//g, '')
                        return (
                          <a
                            key={reel.url}
                            href={reel.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex flex-col items-center justify-center aspect-[9/16] rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700 hover:border-primary transition-colors"
                          >
                            <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play size={20} className="text-white ml-0.5" fill="currentColor" />
                            </div>
                            <span className="flex items-center gap-1 mt-3 text-xs text-white/60 group-hover:text-white transition-colors">
                              Ver en Instagram <ExternalLink size={10} />
                            </span>
                          </a>
                        )
                      })}
                    </div>
                  ) : camp.cta ? (
                    <Link
                      href={`/contacto?servicio=${servicio}`}
                      className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-colors"
                    >
                      {camp.cta.label} <ArrowRight size={16} />
                    </Link>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-20 bg-background">
          <div className="container">
            <h2 className="font-heading text-4xl tracking-wide text-center mb-12">
              Portfolio
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {PORTFOLIO_PLACEHOLDERS.map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground text-xs"
                >
                  Próximamente
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 bg-muted">
        <div className="container text-center space-y-6">
          <h2 className="font-heading text-4xl sm:text-5xl tracking-wide text-foreground">
            ¿Te interesa este servicio?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Cuéntanos tu proyecto y te ayudamos a construir la propuesta ideal.
          </p>
          <Link
            href={`/contacto?servicio=${servicio}`}
            className="inline-flex items-center gap-2 px-10 py-5 bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-all hover:gap-3"
          >
            Contratar este servicio <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}
