'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowLeft, MapPin, Clock, Download, Play, Quote,
  Ruler, Dumbbell, Eye, Scissors, Palette,
} from 'lucide-react'
import { urlFor } from '@/lib/sanity'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

function SectionTitle({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className="mb-10">
      <h2 className={`font-heading text-5xl sm:text-6xl tracking-wide ${light ? 'text-primary-foreground' : 'text-foreground'}`}>
        {children}
      </h2>
      <div className="w-16 h-1 bg-primary mt-3" />
    </div>
  )
}

function youtubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&\n?#]+)/)
  return m ? m[1] : null
}

function getThumbnail(url: string) {
  const ytId = youtubeId(url)
  return ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null
}

export default function ArtistPageClient({ artist }: { artist: any }) {
  const router = useRouter()

  const photos: any[] = artist.photos ?? []
  const videos: any[] = artist.videos ?? []
  const trayectoria: any[] = artist.trayectoria ?? []
  const skills: string[] = artist.skills ?? []
  const styles: string[] = artist.styles ?? []
  const tiposClase: string[] = artist.esProfesor ? (artist.tiposClase ?? []) : []

  const mainPhoto = photos[0]
  const galleryPhotos = photos.slice(1)
  const categoryLabel = artist.agencyProfile || artist.category

  const physicalItems = [
    artist.height != null && { icon: Ruler, label: 'Estatura', value: `${artist.height} cm` },
    artist.complexion && { icon: Dumbbell, label: 'Complexión', value: artist.complexion },
    artist.eyeColor && { icon: Eye, label: 'Color de ojos', value: artist.eyeColor },
    artist.hairType && { icon: Scissors, label: 'Tipo de cabello', value: artist.hairType },
    artist.hairLength && { icon: Scissors, label: 'Largo de cabello', value: artist.hairLength },
    artist.hairColor && { icon: Palette, label: 'Color de cabello', value: artist.hairColor },
  ].filter(Boolean) as Array<{ icon: any; label: string; value: string }>

  const hasExperienceSection =
    artist.experience != null || artist.projectTypes || artist.experienceDescription ||
    artist.featuredProjects || trayectoria.length > 0

  const bioParagraphs: string[] = artist.description
    ? artist.description.split('\n\n').filter(Boolean)
    : []
  const bioQuote = bioParagraphs[0]
  const bioRest = bioParagraphs.slice(1)

  return (
    <>
      {/* 1. HERO */}
      <section className="relative bg-foreground overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="container relative py-24 sm:py-32">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors mb-10"
          >
            <ArrowLeft size={16} />
            Volver
          </button>

          <div className="grid md:grid-cols-5 gap-10 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="md:col-span-2"
            >
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                {mainPhoto ? (
                  <Image
                    src={urlFor(mainPhoto).width(800).height(1067).url()}
                    alt={artist.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    Sin imagen
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-foreground to-transparent" />
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="md:col-span-3"
            >
              {(artist.esProfesor || tiposClase.length > 0) && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {artist.esProfesor && (
                    <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-secondary text-secondary-foreground rounded-full">
                      Profesor
                    </span>
                  )}
                  {tiposClase.map((tipo) => (
                    <span
                      key={tipo}
                      className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-secondary/10 border border-secondary/40 text-secondary rounded-full"
                    >
                      {tipo}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="font-heading text-7xl sm:text-8xl md:text-9xl tracking-wide text-primary-foreground leading-none">
                {artist.name}
              </h1>

              {categoryLabel && (
                <div className="mt-5 inline-block">
                  <p className="text-xl text-primary font-medium">{categoryLabel}</p>
                  <div className="w-12 h-0.5 bg-primary mt-2" />
                </div>
              )}

              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6">
                {artist.city && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-secondary shrink-0" />
                    <span className="text-primary-foreground/80">{artist.city}</span>
                  </div>
                )}
                {artist.experience != null && (
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-secondary shrink-0" />
                    <span className="text-primary-foreground/80">
                      {artist.experience} {artist.experience === 1 ? 'año' : 'años'} de experiencia
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4 mt-9">
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-colors"
                >
                  Contactar
                </Link>
                {artist.cvUrl && (
                  <a
                    href={artist.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3.5 border border-primary-foreground/30 text-primary-foreground font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-primary-foreground/10 transition-colors"
                  >
                    <Download size={16} />
                    Descargar CV
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. GALERÍA */}
      {galleryPhotos.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="bg-muted py-24"
        >
          <div className="container">
            <SectionTitle>GALERÍA</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[220px] gap-4">
              {galleryPhotos.map((photo: any, i: number) => (
                <div
                  key={photo._key ?? i}
                  className={`relative rounded-lg overflow-hidden group ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
                >
                  <Image
                    src={urlFor(photo).width(i === 0 ? 800 : 400).height(i === 0 ? 800 : 400).url()}
                    alt={artist.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* 3. INFO — características / habilidades / estilos */}
      {(physicalItems.length > 0 || skills.length > 0 || styles.length > 0) && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="bg-foreground py-24"
        >
          <div className="container grid md:grid-cols-3 gap-12">
            {physicalItems.length > 0 && (
              <div>
                <h3 className="font-heading text-2xl tracking-wide text-primary-foreground mb-6">
                  CARACTERÍSTICAS
                </h3>
                <div className="space-y-4">
                  {physicalItems.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between gap-3 pb-4 border-b border-primary-foreground/10">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon size={20} className="text-primary" />
                        </div>
                        <span className="text-sm text-primary-foreground/60">{label}</span>
                      </div>
                      <span className="text-sm font-medium text-primary-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {skills.length > 0 && (
              <div>
                <h3 className="font-heading text-2xl tracking-wide text-primary-foreground mb-6">
                  HABILIDADES
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-6 py-3 text-sm border border-primary-foreground/10 text-primary-foreground/80 rounded-full hover:border-primary transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {styles.length > 0 && (
              <div>
                <h3 className="font-heading text-2xl tracking-wide text-primary-foreground mb-6">
                  ESTILOS
                </h3>
                <div className="flex flex-wrap gap-2">
                  {styles.map((style) => (
                    <span
                      key={style}
                      className="px-6 py-3 text-sm font-medium uppercase tracking-wide bg-accent/10 border border-accent/30 text-accent rounded-full"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.section>
      )}

      {/* 4. EXPERIENCIA */}
      {hasExperienceSection && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="bg-background py-24"
        >
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {artist.experience != null && (
                <div>
                  <p className="font-heading text-9xl text-primary leading-none">{artist.experience}</p>
                  <p className="text-xl text-muted-foreground mt-2">
                    {artist.experience === 1 ? 'Año de experiencia' : 'Años de experiencia'}
                  </p>
                </div>
              )}

              {(artist.projectTypes || artist.experienceDescription || artist.featuredProjects) && (
                <div className="space-y-4">
                  {artist.projectTypes && (
                    <p className="text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Tipo de proyectos:</strong> {artist.projectTypes}
                    </p>
                  )}
                  {artist.experienceDescription && (
                    <p className="text-muted-foreground leading-relaxed">{artist.experienceDescription}</p>
                  )}
                  {artist.featuredProjects && (
                    <p className="text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Proyectos destacados:</strong> {artist.featuredProjects}
                    </p>
                  )}
                </div>
              )}
            </div>

            {trayectoria.length > 0 && (
              <div className="mt-16">
                <h3 className="font-heading text-3xl tracking-wide mb-8">PROYECTOS DESTACADOS</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trayectoria.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="p-8 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      <p className="font-medium">{item.proyecto}</p>
                      {item.cliente && <p className="text-sm text-muted-foreground mt-1">{item.cliente}</p>}
                      {item.anio && <p className="text-sm text-primary font-semibold mt-3">{item.anio}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.section>
      )}

      {/* 5. TRAYECTORIA — timeline */}
      {trayectoria.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="bg-foreground py-24"
        >
          <div className="container">
            <SectionTitle light>TRAYECTORIA</SectionTitle>
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-primary/40" />
              <div className="space-y-12">
                {trayectoria.map((item: any, i: number) => {
                  const isLeft = i % 2 === 0
                  return (
                    <div key={i} className="relative grid grid-cols-2 gap-x-8">
                      <div className="absolute left-1/2 -translate-x-1/2 top-1 w-4 h-4 bg-primary rounded-full z-10 ring-4 ring-foreground" />
                      {isLeft ? (
                        <>
                          <div className="text-right bg-primary-foreground/5 border border-primary-foreground/10 rounded-lg p-7">
                            {item.anio && <p className="font-heading text-4xl text-primary">{item.anio}</p>}
                            <p className="font-heading text-2xl text-primary-foreground mt-1">{item.proyecto}</p>
                            {item.cliente && <p className="text-sm text-primary-foreground/60 mt-1">{item.cliente}</p>}
                          </div>
                          <div />
                        </>
                      ) : (
                        <>
                          <div />
                          <div className="text-left bg-primary-foreground/5 border border-primary-foreground/10 rounded-lg p-7">
                            {item.anio && <p className="font-heading text-4xl text-primary">{item.anio}</p>}
                            <p className="font-heading text-2xl text-primary-foreground mt-1">{item.proyecto}</p>
                            {item.cliente && <p className="text-sm text-primary-foreground/60 mt-1">{item.cliente}</p>}
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* 6. VIDEOS */}
      {videos.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="bg-foreground py-24"
        >
          <div className="container">
            <SectionTitle light>MATERIAL AUDIOVISUAL</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-6">
              {videos.map((video: any) => {
                const thumb = getThumbnail(video.url)
                return (
                  <a
                    key={video._key}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block aspect-video rounded-lg overflow-hidden bg-muted"
                  >
                    {thumb ? (
                      <Image
                        src={thumb}
                        alt={video.title ?? 'Video'}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800" />
                    )}
                    <div className="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/50 transition-colors flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg">
                        <Play size={24} className="text-primary-foreground ml-1" fill="currentColor" />
                      </div>
                    </div>
                    {video.title && (
                      <p className="absolute bottom-3 left-4 text-sm font-medium text-primary-foreground">
                        {video.title}
                      </p>
                    )}
                  </a>
                )
              })}
            </div>
          </div>
        </motion.section>
      )}

      {/* 7. BIOGRAFÍA */}
      {artist.description && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="bg-background py-24"
        >
          <div className="container grid md:grid-cols-5 gap-12 items-start">
            <div className="md:col-span-2 relative">
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-muted">
                {mainPhoto ? (
                  <Image
                    src={urlFor(mainPhoto).width(600).height(750).url()}
                    alt={artist.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    Sin imagen
                  </div>
                )}
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-primary rounded-br-lg pointer-events-none" />
            </div>

            <div className="md:col-span-3">
              <SectionTitle>BIOGRAFÍA</SectionTitle>
              <Quote size={56} className="text-primary mb-4" />
              {bioQuote && (
                <p className="font-heading text-3xl sm:text-4xl tracking-wide mb-6 leading-tight">
                  {bioQuote}
                </p>
              )}
              {bioRest.length > 0 && (
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  {bioRest.map((para, i) => <p key={i}>{para}</p>)}
                </div>
              )}
            </div>
          </div>
        </motion.section>
      )}

      {/* 8. CTA FINAL */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
        className="bg-foreground py-32"
      >
        <div className="container text-center space-y-6">
          <h2 className="font-heading text-4xl sm:text-6xl tracking-wide text-primary-foreground">
            ¿Interesado en trabajar con <span className="text-primary">{artist.name}</span>?
          </h2>
          <p className="text-primary-foreground/60 max-w-lg mx-auto">
            Contáctanos y te ayudamos a coordinar el casting, show o proyecto que tengas en mente.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-colors"
          >
            Contactar ahora
          </Link>
        </div>
      </motion.section>
    </>
  )
}
