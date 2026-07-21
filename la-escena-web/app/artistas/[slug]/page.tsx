import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getArtistBySlug, urlFor } from '@/lib/sanity'
import { formatCategoryLabel } from '@/lib/artistCategories'
import type { Metadata } from 'next'
import ArtistPageClient from './ArtistPageClient'

type PageProps = {
  params: {
    slug: string
  }
}

function toEmbedUrl(url: string): string {
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&\n?#]+)/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`

  return url
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const artist = await getArtistBySlug(slug)

  if (!artist) return { title: 'Artista no encontrado | La Escena' }

  const categoryLabel = formatCategoryLabel(artist.agencyProfile || artist.category, artist.esProfesor)

  return {
    title: `${artist.name} | ${categoryLabel} en ${artist.city} – La Escena`,
    description: artist.description?.slice(0, 150),
    openGraph: {
      title: `${artist.name} | La Escena`,
      description: artist.description,
      images: artist.photos?.[0]?.asset?.url ? [artist.photos[0].asset.url] : [],
    },
  }
}

export default async function ArtistPage({ params }: PageProps) {
  const { slug } = await params
  const artist = await getArtistBySlug(slug)

  if (!artist) notFound()

  return (
    <ArtistPageClient>
      {/* HERO */}
      <section style={{ marginBottom: '3rem' }}>
        {artist.photos?.[0] && (
          <Image
            src={urlFor(artist.photos[0]).width(1200).height(600).url()}
            alt={artist.name}
            width={1200}
            height={600}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '520px',
              borderRadius: '16px',
              objectFit: 'cover',
              marginBottom: '1.5rem',
            }}
          />
        )}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 500 }}>
              {artist.name}
            </h1>
            <p style={{ color: '#666', marginTop: '0.5rem' }}>
              {formatCategoryLabel(artist.agencyProfile || artist.category, artist.esProfesor)} · {artist.city}
            </p>
          </div>
          {artist.cvUrl && (
            <a
              href={artist.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.25rem',
                background: '#111',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 500,
                textDecoration: 'none',
                flexShrink: 0,
              }}
            >
              ↓ Descargar CV
            </a>
          )}
        </div>
      </section>

      {/* INFO */}
      <section style={{ maxWidth: '720px', marginBottom: '3rem' }}>
        {artist.description && (
          <p style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>{artist.description}</p>
        )}

        {/* Stats: experiencia, edad, estatura */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginTop: '1.5rem',
          }}
        >
          {artist.experience != null && (
            <div>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#999' }}>
                Experiencia
              </span>
              <p style={{ fontWeight: 600, fontSize: '1.1rem', marginTop: '0.2rem' }}>
                {artist.experience} {artist.experience === 1 ? 'año' : 'años'}
              </p>
            </div>
          )}
          {artist.age != null && (
            <div>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#999' }}>
                Edad
              </span>
              <p style={{ fontWeight: 600, fontSize: '1.1rem', marginTop: '0.2rem' }}>
                {artist.age} años
              </p>
            </div>
          )}
          {artist.height != null && (
            <div>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#999' }}>
                Estatura
              </span>
              <p style={{ fontWeight: 600, fontSize: '1.1rem', marginTop: '0.2rem' }}>
                {artist.height} cm
              </p>
            </div>
          )}
        </div>

        {/* Experiencia detallada */}
        {(artist.projectTypes || artist.experienceDescription || artist.featuredProjects) && (
          <div style={{ marginTop: '1.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.4rem)', fontWeight: 500, marginBottom: '0.75rem' }}>
              Experiencia
            </h2>
            {artist.projectTypes && (
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Tipo de proyectos:</strong> {artist.projectTypes}
              </p>
            )}
            {artist.experienceDescription && (
              <p style={{ lineHeight: 1.7, color: '#333', marginBottom: artist.featuredProjects ? '0.75rem' : 0 }}>
                {artist.experienceDescription}
              </p>
            )}
            {artist.featuredProjects && (
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Proyectos destacados:</strong> {artist.featuredProjects}
              </p>
            )}
          </div>
        )}

        {/* Estilos */}
        {artist.styles?.length > 0 && (
          <p style={{ marginTop: '1rem', color: '#555' }}>
            <strong>Estilos:</strong> {artist.styles.join(', ')}
          </p>
        )}

        {/* Hashtags */}
        {artist.hashtags?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.25rem' }}>
            {artist.hashtags.map((tag: string) => (
              <span
                key={tag}
                style={{
                  padding: '0.3rem 0.8rem',
                  background: '#f0f0f0',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  color: '#444',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Tipos de clase (solo profesores) */}
        {artist.esProfesor && artist.tiposClase?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.25rem' }}>
            {artist.tiposClase.map((tipo: string) => (
              <span
                key={tipo}
                style={{
                  padding: '0.3rem 0.8rem',
                  background: '#fff0f2',
                  color: '#e5173f',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                }}
              >
                {tipo}
              </span>
            ))}
          </div>
        )}

        {/* Habilidades */}
        {artist.skills?.length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#999' }}>
              Habilidades
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.6rem' }}>
              {artist.skills.map((skill: string) => (
                <span
                  key={skill}
                  style={{
                    padding: '0.3rem 0.8rem',
                    background: '#111',
                    color: '#fff',
                    borderRadius: '999px',
                    fontSize: '0.85rem',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* CARACTERÍSTICAS FÍSICAS */}
      {(artist.complexion || artist.eyeColor || artist.hairType || artist.hairLength || artist.hairColor) && (
        <section style={{ maxWidth: '720px', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)', fontWeight: 500, marginBottom: '1.25rem' }}>
            Características físicas
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
            {[
              ['Complexión', artist.complexion],
              ['Color de ojos', artist.eyeColor],
              ['Tipo de cabello', artist.hairType],
              ['Largo del cabello', artist.hairLength],
              ['Color de cabello', artist.hairColor],
            ]
              .filter(([, value]) => Boolean(value))
              .map(([label, value]) => (
                <div key={label}>
                  <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#999' }}>
                    {label}
                  </span>
                  <p style={{ fontWeight: 600, fontSize: '1.1rem', marginTop: '0.2rem' }}>{value}</p>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* TRAYECTORIA */}
      {artist.trayectoria?.length > 0 && (
        <section style={{ maxWidth: '720px', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)', fontWeight: 500, marginBottom: '1.25rem' }}>
            Trayectoria
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {artist.trayectoria.map((item: { proyecto: string; cliente: string; anio: number }, i: number) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '4rem 1fr',
                  gap: '1rem',
                  alignItems: 'start',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid #eee',
                }}
              >
                <span style={{ fontSize: '0.9rem', color: '#999', fontWeight: 600, paddingTop: '0.15rem' }}>
                  {item.anio}
                </span>
                <div>
                  <p style={{ fontWeight: 500, margin: 0 }}>{item.proyecto}</p>
                  {item.cliente && (
                    <p style={{ color: '#777', fontSize: '0.9rem', margin: '0.15rem 0 0' }}>{item.cliente}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* GALERÍA */}
      {artist.photos?.length > 1 && (
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
        >
          {artist.photos.slice(1).map((photo: any) => (
            <Image
              key={photo._key}
              src={urlFor(photo).width(600).height(400).url()}
              alt={artist.name}
              width={600}
              height={400}
              style={{ width: '100%', height: 'auto', borderRadius: '12px', objectFit: 'cover' }}
            />
          ))}
        </section>
      )}

      {/* VIDEOS */}
      {artist.videos?.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h2
            style={{
              fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
              fontWeight: 500,
              marginBottom: '1.5rem',
            }}
          >
            Videos
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {artist.videos.map((video: any) => (
              <div key={video._key}>
                {video.title && (
                  <p style={{ marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.95rem' }}>
                    {video.title}
                  </p>
                )}
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                  <iframe
                    src={toEmbedUrl(video.url)}
                    title={video.title || 'Video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      borderRadius: '12px',
                      border: 'none',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </ArtistPageClient>
  )
}
