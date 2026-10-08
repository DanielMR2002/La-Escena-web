'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowLeft, MapPin, Download, MessageCircle,
  Ruler, Dumbbell, Eye, Scissors, Palette,
  Play, Quote, GraduationCap, Instagram, Youtube, Music2,
} from 'lucide-react'
import { urlFor } from '@/lib/sanity'

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */
function youtubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&\n?#]+)/)
  return m ? m[1] : null
}

function getThumbnail(url: string) {
  const ytId = youtubeId(url)
  return ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null
}

function getCategoryLabel(artist: any): string {
  const ap = artist.agencyProfile
  if (Array.isArray(ap)) return ap.join(' · ')
  return ap || artist.category || ''
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                        */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
}

function SectionTitle({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className="mb-10 space-y-3">
      <h2 className={`font-heading text-4xl sm:text-5xl tracking-wide ${light ? 'text-primary-foreground' : 'text-foreground'}`}>
        {children}
      </h2>
      <div className="w-16 h-1 bg-primary" />
    </div>
  )
}

const availabilityStyles: Record<string, { dot: string; text: string }> = {
  'Disponible':               { dot: 'bg-emerald-500', text: 'text-emerald-400' },
  'Parcialmente disponible':  { dot: 'bg-secondary',   text: 'text-secondary'   },
  'No disponible':            { dot: 'bg-muted-foreground', text: 'text-muted-foreground' },
}

/* ------------------------------------------------------------------ */
/* Main component                                                        */
/* ------------------------------------------------------------------ */
export default function ArtistPageClient({ artist }: { artist: any }) {
  const router = useRouter()

  /* ---- data derivation ---- */
  const photos: any[]  = artist.photos ?? []
  const videos: any[]  = artist.videos ?? []
  const skills: string[] = artist.skills ?? []
  const tiposClase: string[] = artist.esProfesor ? (artist.tiposClase ?? []) : []
  const niveles: string[]   = artist.esProfesor ? (artist.niveles  ?? []) : []
  const horarios: string[]  = artist.esProfesor ? (artist.horarios ?? []) : []

  const estilosPrincipales: string[] = artist.estilosPrincipales ?? []
  const estilosSecundarios: string[] = artist.estilosSecundarios ?? []
  const hasSplitStyles = estilosPrincipales.length > 0 || estilosSecundarios.length > 0
  const legacyStyles: string[] = !hasSplitStyles ? (artist.styles ?? []) : []

  const hashtags: string[]   = artist.hashtags ?? []
  const tipoPerfil: string[] = Array.isArray(artist.tipoPerfil)
    ? artist.tipoPerfil
    : (artist.tipoPerfil ? [artist.tipoPerfil] : [])
  const artistAvailability: string = artist.artistAvailability ?? ''
  const genero: string = artist.genero ?? ''

  const mainPhoto    = photos[0]
  const galleryPhotos = photos.slice(1)
  const categoryLabel = getCategoryLabel(artist)
  const hasCv = Boolean(artist.cvUrl || artist.cvPdfUrl)

  const pruebasAprobadas: any[] = artist.pruebasTrabajoAprobadas ?? []

  const showSocial = artist.socialLinksPublic === true
  const socialLinks = [
    { name: 'Instagram', url: artist.instagram, Icon: Instagram },
    { name: 'TikTok',    url: artist.tiktok,    Icon: Music2    },
    { name: 'YouTube',   url: artist.youtube,   Icon: Youtube   },
  ].filter(s => showSocial && Boolean(s.url))

  const physicalItems = [
    artist.height    != null && { icon: Ruler,    label: 'Estatura',        value: `${artist.height} cm` },
    artist.complexion       && { icon: Dumbbell,  label: 'Complexión',      value: artist.complexion     },
    artist.eyeColor         && { icon: Eye,       label: 'Color de ojos',   value: artist.eyeColor       },
    artist.hairType         && { icon: Scissors,  label: 'Tipo cabello',    value: artist.hairType       },
    artist.hairLength       && { icon: Scissors,  label: 'Largo cabello',   value: artist.hairLength     },
    artist.hairColor        && { icon: Palette,   label: 'Color cabello',   value: artist.hairColor      },
  ].filter(Boolean) as Array<{ icon: any; label: string; value: string }>

  const trayectoriaRaw = artist.trayectoria
  const trayectoriaObj = !Array.isArray(trayectoriaRaw) && trayectoriaRaw ? trayectoriaRaw : null
  const trayectoriaCards = trayectoriaObj ? [
    { value: trayectoriaObj.aniosBailando,    label: 'Años bailando'       },
    { value: trayectoriaObj.aniosExperiencia, label: 'Años de experiencia' },
    { value: trayectoriaObj.edad,             label: 'Edad'                },
    { value: trayectoriaObj.estatura,         label: 'Estatura (cm)'       },
  ].filter(c => c.value != null) : []

  const bioParagraphs: string[] = artist.description
    ? artist.description.split('\n\n').filter(Boolean)
    : []

  const availability = availabilityStyles[artistAvailability] ?? availabilityStyles['No disponible']

  const heroStyles = hashtags.length > 0 ? hashtags
    : estilosPrincipales.length > 0 ? estilosPrincipales
    : legacyStyles

  return (
    <>
      {/* ============================= HERO ============================= */}
      <section className="relative bg-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-40 right-20 w-96 h-96 rounded-full bg-primary/40 blur-[140px]" />
          <div className="absolute bottom-20 left-40 w-72 h-72 rounded-full bg-secondary/30 blur-[120px]" />
        </div>

        <div className="container relative z-10 py-16 lg:py-24">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors mb-10"
          >
            <ArrowLeft size={16} /> Volver
          </button>

          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-center">
            {/* Foto principal */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-2"
            >
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden ring-1 ring-primary-foreground/10 shadow-2xl">
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
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-3 space-y-5"
            >
              {/* 1. Chips estilos de baile */}
              {heroStyles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {heroStyles.map((h) => (
                    <span
                      key={h}
                      className="bg-primary/20 border border-primary/50 text-primary rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              )}

              {/* 2. Nombre */}
              <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl leading-[0.9] tracking-wide text-primary-foreground uppercase">
                {artist.name}
              </h1>

              {/* 3. Categoría */}
              {categoryLabel && (
                <div className="inline-block">
                  <p className="font-heading text-2xl sm:text-3xl tracking-wide text-primary uppercase">
                    {categoryLabel}
                  </p>
                  <div className="w-full h-0.5 bg-primary mt-1" />
                </div>
              )}

              {/* 4. Género */}
              {genero && (
                <span className="inline-block px-3 py-1 bg-primary-foreground/10 text-primary-foreground/70 border border-primary-foreground/20 rounded-full text-xs font-medium uppercase tracking-wider">
                  {genero}
                </span>
              )}

              {/* 5. Ciudad + experiencia */}
              <div className="flex flex-wrap gap-6 pt-1">
                {artist.city && (
                  <div className="flex items-center gap-2 text-primary-foreground/70">
                    <MapPin size={18} className="text-secondary" />
                    <span className="text-sm font-medium">{artist.city}</span>
                  </div>
                )}
                {trayectoriaObj?.aniosExperiencia != null && (
                  <div className="flex items-center gap-2 text-primary-foreground/70">
                    <GraduationCap size={18} className="text-secondary" />
                    <span className="text-sm font-medium">
                      {trayectoriaObj.aniosExperiencia} años de experiencia
                    </span>
                  </div>
                )}
              </div>

              {/* 6. Disponibilidad */}
              {artistAvailability && (
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${availability.dot}`} />
                  <span className={`text-sm font-semibold uppercase tracking-wider ${availability.text}`}>
                    {artistAvailability}
                  </span>
                </div>
              )}

              {/* 7. Tipo de perfil */}
              {tipoPerfil.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tipoPerfil.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 bg-secondary/10 text-secondary border border-secondary/40 rounded-full text-xs font-semibold uppercase tracking-wider"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* 8. Profesor + tipos de clase */}
              {artist.esProfesor && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-sm text-xs font-bold uppercase tracking-widest">
                    <GraduationCap size={14} /> Profesor
                  </span>
                  {tiposClase.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 bg-secondary/10 text-secondary border border-secondary/30 rounded-full text-xs font-medium uppercase tracking-wider"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* 9. Redes sociales */}
              {socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-1">
                  {socialLinks.map(({ name, url, Icon }) => (
                    <a
                      key={name}
                      href={url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={name}
                      className="w-10 h-10 rounded-full border border-primary-foreground/20 text-primary-foreground/70 flex items-center justify-center hover:border-secondary hover:text-secondary transition-colors"
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              )}

              {/* 10. Botones */}
              <div className="flex flex-wrap gap-3 pt-3">
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-all hover:gap-3"
                >
                  <MessageCircle size={16} /> Contactar
                </Link>
                {hasCv && (
                  <a
                    href={artist.cvPdfUrl || artist.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 border border-primary-foreground/30 text-primary-foreground font-semibold text-sm uppercase tracking-wider rounded-sm hover:border-secondary hover:text-secondary transition-colors"
                  >
                    <Download size={16} /> Descargar CV
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================== ESTILOS DE BAILE ======================== */}
      {(hasSplitStyles || legacyStyles.length > 0) && (
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp} transition={{ duration: 0.6 }}
          className="py-20 bg-muted"
        >
          <div className="container">
            <SectionTitle>Estilos de Baile</SectionTitle>
            <div className="space-y-8">
              {estilosPrincipales.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Principales</p>
                  <div className="flex flex-wrap gap-3">
                    {estilosPrincipales.map((s) => (
                      <span key={s} className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-heading text-2xl tracking-wide uppercase">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {estilosSecundarios.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Secundarios</p>
                  <div className="flex flex-wrap gap-3">
                    {estilosSecundarios.map((s) => (
                      <span key={s} className="px-6 py-3 bg-accent/15 text-accent border border-accent/40 rounded-full font-heading text-2xl tracking-wide uppercase">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {!hasSplitStyles && legacyStyles.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {legacyStyles.map((s) => (
                    <span key={s} className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-heading text-2xl tracking-wide uppercase">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.section>
      )}

      {/* ============================ GALERÍA =========================== */}
      {galleryPhotos.length > 0 && (
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp} transition={{ duration: 0.6 }}
          className="py-20 bg-foreground"
        >
          <div className="container">
            <SectionTitle light>Galería</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[180px] md:auto-rows-[220px]">
              <div className="col-span-2 row-span-2 group relative overflow-hidden rounded-lg">
                <Image
                  src={urlFor(galleryPhotos[0]).width(800).height(800).url()}
                  alt={artist.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors" />
              </div>
              {galleryPhotos.slice(1).map((photo: any, i: number) => (
                <div key={photo._key ?? i} className="group relative overflow-hidden rounded-lg">
                  <Image
                    src={urlFor(photo).width(400).height(400).url()}
                    alt={`${artist.name} foto ${i + 2}`}
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

      {/* ======================= SOBRE EL ARTISTA ======================= */}
      {bioParagraphs.length > 0 && (
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp} transition={{ duration: 0.6 }}
          className="py-24 bg-background"
        >
          <div className="container">
            <div className="grid lg:grid-cols-5 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-2 relative"
              >
                <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-2xl relative">
                  {mainPhoto && (
                    <Image
                      src={urlFor(mainPhoto).width(600).height(750).url()}
                      alt={artist.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 border-4 border-primary rounded-lg pointer-events-none" />
              </motion.div>

              <div className="lg:col-span-3 space-y-8">
                <SectionTitle>Sobre el Artista</SectionTitle>
                <div className="relative pl-16">
                  <Quote size={56} className="absolute left-0 top-0 text-primary" fill="currentColor" />
                  <p className="font-heading text-3xl sm:text-4xl leading-tight tracking-wide text-foreground">
                    {bioParagraphs[0]}
                  </p>
                </div>
                {bioParagraphs.length > 1 && (
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    {bioParagraphs.slice(1).map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* ================ CARACTERÍSTICAS Y HABILIDADES ================= */}
      {(physicalItems.length > 0 || skills.length > 0 || artist.esProfesor) && (
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp} transition={{ duration: 0.6 }}
          className="py-20 bg-foreground"
        >
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-12">
              {physicalItems.length > 0 && (
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
                  <h3 className="font-heading text-3xl tracking-wide text-primary-foreground mb-2">Características</h3>
                  <div className="w-12 h-0.5 bg-primary mb-6" />
                  <ul className="space-y-4">
                    {physicalItems.map(({ icon: Icon, label, value }) => (
                      <li key={label} className="flex items-center gap-4 pb-4 border-b border-primary-foreground/10">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Icon size={18} />
                        </div>
                        <div className="flex-1 flex items-center justify-between">
                          <span className="text-xs uppercase tracking-widest text-primary-foreground/50">{label}</span>
                          <span className="text-sm font-semibold text-primary-foreground">{value}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {skills.length > 0 && (
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
                  <h3 className="font-heading text-3xl tracking-wide text-primary-foreground mb-2">Habilidades</h3>
                  <div className="w-12 h-0.5 bg-primary mb-6" />
                  <div className="flex flex-wrap gap-3">
                    {skills.map((s) => (
                      <span key={s} className="px-5 py-2.5 bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground rounded-full text-sm font-medium hover:border-primary hover:bg-primary/10 transition-colors">
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {artist.esProfesor && (
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}>
                  <h3 className="font-heading text-3xl tracking-wide text-primary-foreground mb-2">Como Profesor</h3>
                  <div className="w-12 h-0.5 bg-primary mb-6" />
                  <div className="space-y-5">
                    {tiposClase.length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-widest text-primary-foreground/50 mb-2">Tipos de clase</p>
                        <div className="flex flex-wrap gap-2">
                          {tiposClase.map((t) => (
                            <span key={t} className="px-4 py-1.5 bg-secondary/10 border border-secondary/30 text-secondary rounded-full text-xs font-semibold uppercase tracking-wider">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {niveles.length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-widest text-primary-foreground/50 mb-2">Niveles</p>
                        <div className="flex flex-wrap gap-2">
                          {niveles.map((n) => (
                            <span key={n} className="px-4 py-1.5 bg-primary/10 border border-primary/40 text-primary rounded-full text-xs font-semibold uppercase tracking-wider">{n}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {horarios.length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-widest text-primary-foreground/50 mb-2">Horarios</p>
                        <div className="flex flex-wrap gap-2">
                          {horarios.map((h) => (
                            <span key={h} className="px-4 py-1.5 bg-primary-foreground/5 border border-primary-foreground/15 text-primary-foreground/80 rounded-full text-xs font-medium uppercase tracking-wider">{h}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.section>
      )}

      {/* ===================== TRAYECTORIA NUMÉRICA ===================== */}
      {trayectoriaCards.length > 0 && (
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp} transition={{ duration: 0.6 }}
          className="py-20 bg-muted"
        >
          <div className="container">
            <SectionTitle>Trayectoria</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {trayectoriaCards.map((c, i) => (
                <motion.div
                  key={c.label}
                  initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={fadeUp} custom={i}
                  className="p-6 bg-card border border-border rounded-lg text-center"
                >
                  <p className="font-heading text-7xl text-primary leading-none">{c.value}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-3">{c.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* ============================ VIDEOS ============================ */}
      {videos.length > 0 && (
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp} transition={{ duration: 0.6 }}
          className="py-24 bg-foreground border-t border-primary-foreground/5"
        >
          <div className="container">
            <SectionTitle light>Videos</SectionTitle>
            <div className="grid md:grid-cols-2 gap-6">
              {videos.map((video: any, i: number) => {
                const thumb = getThumbnail(video.url)
                return (
                  <motion.a
                    key={video._key ?? i}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial="hidden" whileInView="visible" viewport={{ once: true }}
                    variants={fadeUp} custom={i}
                    className="group relative aspect-video rounded-lg overflow-hidden cursor-pointer block"
                  >
                    {thumb ? (
                      <Image src={thumb} alt={video.title ?? 'Video'} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-zinc-800" />
                    )}
                    <div className="absolute inset-0 bg-foreground/50 group-hover:bg-foreground/30 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                        <Play size={24} className="text-primary-foreground ml-1" fill="currentColor" />
                      </div>
                    </div>
                    {video.title && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="font-heading text-xl tracking-wide text-primary-foreground">{video.title}</p>
                      </div>
                    )}
                  </motion.a>
                )
              })}
            </div>
          </div>
        </motion.section>
      )}

      {/* =================== PRUEBAS DE TRABAJO ========================= */}
      {pruebasAprobadas.length > 0 && (
        <motion.section
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp} transition={{ duration: 0.6 }}
          className="py-24 bg-background"
        >
          <div className="container">
            <SectionTitle>Pruebas de Trabajo</SectionTitle>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pruebasAprobadas.map((prueba: any, i: number) => {
                const isVideo = prueba.fileType?.startsWith('video')
                return (
                  <a
                    key={prueba._key ?? i}
                    href={prueba.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block rounded-lg overflow-hidden bg-muted border border-border hover:border-primary transition-colors"
                  >
                    {isVideo ? (
                      <div className="aspect-video bg-zinc-100 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow">
                          <Play size={22} className="text-primary-foreground ml-1" fill="currentColor" />
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video relative">
                        <Image src={prueba.url} alt={prueba.title ?? 'Prueba de trabajo'} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                    )}
                    {prueba.title && (
                      <div className="p-3">
                        <p className="text-sm font-medium text-foreground truncate">{prueba.title}</p>
                      </div>
                    )}
                  </a>
                )
              })}
            </div>
          </div>
        </motion.section>
      )}

      {/* =========================== CTA FINAL ========================== */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeUp} transition={{ duration: 0.6 }}
        className="py-20 bg-foreground border-t border-primary-foreground/5"
      >
        <div className="container text-center space-y-6">
          <h2 className="font-heading text-4xl sm:text-5xl tracking-wide text-primary-foreground">
            ¿Interesado en trabajar con{' '}
            <span className="text-primary">{artist.name.split(' ')[0]}</span>?
          </h2>
          <p className="text-primary-foreground/60 max-w-xl mx-auto">
            Contáctanos para cotizar shows, producciones o clases personalizadas.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-10 py-5 bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-all hover:gap-3"
          >
            <MessageCircle size={18} /> Contactar Ahora
          </Link>
        </div>
      </motion.section>
    </>
  )
}
