export const dynamic = "force-dynamic"

import Image from "next/image"
import Link from "next/link"
import { requireArtistOrAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sanityFreshClient, urlFor } from "@/lib/sanity"
import { formatCategoryLabel } from "@/lib/artistCategories"
import { ensureAdminArtistProfile } from "@/services/admin-profile.service"

function toEmbedUrl(url: string): string {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&\n?#]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  return url
}

const STATUS_STYLE: Record<string, { label: string; bg: string; color: string }> = {
  PENDING:  { label: "Cambios en revisión",  bg: "#fef3c7", color: "#d97706" },
  REJECTED: { label: "Cambios rechazados",   bg: "#fee2e2", color: "#dc2626" },
}

export default async function ArtistDashboard() {
  const session = await requireArtistOrAdmin()

  let profile = await prisma.artistProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (session.user.role === "ADMIN" && !profile?.sanityId) {
    const result = await ensureAdminArtistProfile(session.user.id)
    profile = result.profile
  }

  let data: any = profile?.profileData ?? {}
  let photos: any[] = []
  let videos: any[] = []
  let pendingPhotos: any[] = []
  let pendingVideos: any[] = []

  if (profile?.sanityId) {
    const sanity = await sanityFreshClient.fetch(
      `*[_type == "artist" && _id == $id][0]{
        name, city, category, esProfesor, experience, description,
        projectTypes, experienceDescription, featuredProjects,
        age, height, hashtags, cvUrl, artistAvailability,
        complexion, eyeColor, hairType, hairLength, hairColor,
        skills, agencyProfile,
        trayectoria[]{ proyecto, cliente, anio },
        photos[]{ _key, asset },
        "videos": videos[]{ _key, url, title },
        pendingPhotos[]{ _key, asset },
        "pendingVideos": pendingVideos[]{ _key, url, title }
      }`,
      { id: profile.sanityId }
    )
    if (sanity) {
      data   = sanity
      photos = sanity.photos ?? []
      videos = sanity.videos ?? []
      pendingPhotos = sanity.pendingPhotos ?? []
      pendingVideos = sanity.pendingVideos ?? []
    }
  }

  const status = (profile?.status ?? "PENDING") as string
  const st     = STATUS_STYLE[status]

  return (
    <div style={{ padding: "40px", maxWidth: "860px", margin: "0 auto" }}>

      {/* ── Cabecera ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 600, margin: 0 }}>
            {data.name || "Mi Perfil"}
          </h1>
          {(data.agencyProfile || data.category || data.city) && (
            <p style={{ color: "#6b7280", marginTop: "6px", fontSize: "0.95rem" }}>
              {[formatCategoryLabel(data.agencyProfile || data.category, data.esProfesor), data.city].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px", flexShrink: 0 }}>
          {st && (
            <span style={{
              padding: "4px 12px", borderRadius: "20px", fontSize: "0.78rem",
              fontWeight: 600, background: st.bg, color: st.color,
            }}>
              {st.label}
            </span>
          )}
          <Link href="/artista/editar" style={{
            padding: "8px 18px", background: "#e5173f", color: "#fff",
            borderRadius: "8px", fontSize: "0.9rem", fontWeight: 600,
            textDecoration: "none", whiteSpace: "nowrap",
          }}>
            Editar perfil
          </Link>
        </div>
      </div>

      {/* ── Comentario de rechazo ── */}
      {status === "REJECTED" && profile?.adminComment && (
        <div style={{
          background: "#fee2e2", padding: "15px", borderRadius: "8px",
          marginBottom: "28px", border: "1px solid #fca5a5",
        }}>
          <strong style={{ color: "#dc2626" }}>Motivo del rechazo:</strong>
          <p style={{ marginTop: "8px", color: "#7f1d1d" }}>{profile.adminComment}</p>
        </div>
      )}

      {/* ── Foto principal ── */}
      {photos[0] && (
        <div style={{ marginBottom: "28px" }}>
          <Image
            src={urlFor(photos[0]).width(860).height(440).fit("crop").url()}
            alt={data.name || "Foto"}
            width={860}
            height={440}
            style={{ width: "100%", height: "auto", maxHeight: "440px", borderRadius: "14px", objectFit: "cover" }}
          />
        </div>
      )}

      {/* ── Descripción ── */}
      {data.description && (
        <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#333", marginBottom: "28px" }}>
          {data.description}
        </p>
      )}

      {/* ── Stats ── */}
      {(data.experience || data.age || data.height || data.artistAvailability !== undefined) && (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "12px", marginBottom: "28px",
        }}>
          {data.experience != null && (
            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "14px" }}>
              <p style={{ fontSize: "0.7rem", color: "#9ca3af", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Experiencia</p>
              <p style={{ fontWeight: 700, marginTop: "6px", fontSize: "1.15rem", margin: "6px 0 0" }}>{data.experience} años</p>
            </div>
          )}
          {data.age != null && (
            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "14px" }}>
              <p style={{ fontSize: "0.7rem", color: "#9ca3af", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Edad</p>
              <p style={{ fontWeight: 700, marginTop: "6px", fontSize: "1.15rem", margin: "6px 0 0" }}>{data.age} años</p>
            </div>
          )}
          {data.height != null && (
            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "14px" }}>
              <p style={{ fontSize: "0.7rem", color: "#9ca3af", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Estatura</p>
              <p style={{ fontWeight: 700, marginTop: "6px", fontSize: "1.15rem", margin: "6px 0 0" }}>{data.height} cm</p>
            </div>
          )}
          {data.artistAvailability !== undefined && (
            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "14px" }}>
              <p style={{ fontSize: "0.7rem", color: "#9ca3af", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Disponibilidad</p>
              <p style={{
                fontWeight: 700, fontSize: "0.95rem", margin: "6px 0 0",
                color: data.artistAvailability ? "#16a34a" : "#6b7280",
              }}>
                {data.artistAvailability ? "Disponible" : "No disponible"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Experiencia detallada ── */}
      {(data.projectTypes || data.experienceDescription || data.featuredProjects) && (
        <div style={{ marginBottom: "28px" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "12px" }}>Experiencia</h2>
          {data.projectTypes && (
            <p style={{ marginBottom: "8px" }}>
              <strong>Tipo de proyectos:</strong> {data.projectTypes}
            </p>
          )}
          {data.experienceDescription && (
            <p style={{ lineHeight: 1.7, color: "#333", marginBottom: data.featuredProjects ? "12px" : 0 }}>
              {data.experienceDescription}
            </p>
          )}
          {data.featuredProjects && (
            <p style={{ marginBottom: "8px" }}>
              <strong>Proyectos destacados:</strong> {data.featuredProjects}
            </p>
          )}
        </div>
      )}

      {/* ── Hashtags ── */}
      {Array.isArray(data.hashtags) && data.hashtags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "28px" }}>
          {data.hashtags.map((tag: string, i: number) => (
            <span key={i} style={{
              padding: "4px 12px", background: "#f3f4f6",
              borderRadius: "20px", fontSize: "0.85rem", color: "#374151",
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* ── Habilidades ── */}
      {Array.isArray(data.skills) && data.skills.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "28px" }}>
          {data.skills.map((skill: string, i: number) => (
            <span key={i} style={{
              padding: "4px 12px", background: "#111", color: "#fff",
              borderRadius: "20px", fontSize: "0.85rem",
            }}>
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* ── Características físicas ── */}
      {(data.complexion || data.eyeColor || data.hairType || data.hairLength || data.hairColor) && (
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "12px" }}>Características físicas</h2>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: "12px",
          }}>
            {[
              ["Complexión", data.complexion],
              ["Color de ojos", data.eyeColor],
              ["Tipo de cabello", data.hairType],
              ["Largo del cabello", data.hairLength],
              ["Color de cabello", data.hairColor],
            ]
              .filter(([, value]) => Boolean(value))
              .map(([label, value]) => (
                <div key={label} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "14px" }}>
                  <p style={{ fontSize: "0.7rem", color: "#9ca3af", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
                  <p style={{ fontWeight: 700, marginTop: "6px", fontSize: "1.05rem", margin: "6px 0 0" }}>{value}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── CV ── */}
      {data.cvUrl && (
        <div style={{ marginBottom: "28px" }}>
          <a href={data.cvUrl} target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "8px 16px", border: "1px solid #e5e7eb",
            borderRadius: "8px", fontSize: "0.9rem", color: "#374151",
            textDecoration: "none", background: "#f9fafb",
          }}>
            📄 Ver CV
          </a>
        </div>
      )}

      {/* ── Trayectoria ── */}
      {Array.isArray(data.trayectoria) && data.trayectoria.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "12px" }}>Trayectoria</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {data.trayectoria.map((t: any, i: number) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 16px", background: "#f9fafb",
                border: "1px solid #e5e7eb", borderRadius: "8px",
              }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{t.proyecto}</span>
                  {t.cliente && <span style={{ color: "#6b7280", marginLeft: "8px", fontSize: "0.9rem" }}>{t.cliente}</span>}
                </div>
                {t.anio && <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>{t.anio}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Galería de fotos ── */}
      {photos.length > 1 && (
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "12px" }}>
            Fotos ({photos.length})
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
            {photos.slice(1).map((photo: any) => (
              <div key={photo._key} style={{ position: "relative", aspectRatio: "3/2", borderRadius: "8px", overflow: "hidden" }}>
                <Image
                  src={urlFor(photo).width(400).height(267).fit("crop").url()}
                  alt={data.name || "Foto"}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="200px"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Videos ── */}
      {videos.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "12px" }}>Videos</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {videos.map((video: any) => (
              <div key={video._key}>
                {video.title && (
                  <p style={{ marginBottom: "6px", fontWeight: 500, fontSize: "0.9rem" }}>{video.title}</p>
                )}
                <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                  <iframe
                    src={toEmbedUrl(video.url)}
                    title={video.title || "Video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: "8px", border: "none" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Fotos y videos en revisión ── */}
      {(pendingPhotos.length > 0 || pendingVideos.length > 0) && (
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "12px" }}>
            En revisión
          </h2>

          {pendingPhotos.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px", marginBottom: pendingVideos.length > 0 ? "16px" : 0 }}>
              {pendingPhotos.map((photo: any) => (
                <div key={photo._key} style={{ position: "relative", aspectRatio: "3/4", borderRadius: "8px", overflow: "hidden" }}>
                  <Image
                    src={urlFor(photo).width(300).height(400).url()}
                    alt="Foto en revisión"
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="140px"
                  />
                  <span style={{
                    position: "absolute", top: "6px", left: "6px",
                    padding: "3px 9px", borderRadius: "999px", fontSize: "0.68rem",
                    fontWeight: 600, background: "#fbbf24", color: "#78350f",
                  }}>
                    En revisión
                  </span>
                </div>
              ))}
            </div>
          )}

          {pendingVideos.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {pendingVideos.map((video: any) => (
                <div key={video._key} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{
                    padding: "3px 9px", borderRadius: "999px", fontSize: "0.68rem",
                    fontWeight: 600, background: "#fbbf24", color: "#78350f", flexShrink: 0,
                  }}>
                    En revisión
                  </span>
                  <a href={video.url} target="_blank" rel="noopener noreferrer" style={{ color: "#e5173f", fontSize: "0.9rem" }}>
                    {video.title || video.url}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Sin datos ── */}
      {!data.name && !data.description && photos.length === 0 && (
        <div style={{
          textAlign: "center", padding: "60px 20px",
          background: "#f9fafb", borderRadius: "12px", border: "1px dashed #e5e7eb",
        }}>
          <p style={{ color: "#9ca3af", marginBottom: "16px" }}>Tu perfil aún no tiene datos visibles.</p>
          <Link href="/artista/editar" style={{
            padding: "10px 20px", background: "#e5173f", color: "#fff",
            borderRadius: "8px", textDecoration: "none", fontWeight: 600,
          }}>
            Completar perfil
          </Link>
        </div>
      )}

    </div>
  )
}
