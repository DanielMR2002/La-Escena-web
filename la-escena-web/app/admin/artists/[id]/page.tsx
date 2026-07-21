export const dynamic = "force-dynamic"

import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { sanityWriteClient as sanityClient, urlFor } from "@/lib/sanity"
import { requireAdmin } from "@/lib/auth"
import RevisionActions from "../revisions/RevisionActions"
import AdminEditArtistForm from "./AdminEditArtistForm"
import CreateSanityProfileButton from "./CreateSanityProfileButton"
import ArtistMediaManager from "./ArtistMediaManager"

const statusClasses: Record<string, string> = {
  PENDING:  "bg-amber-100 text-amber-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
}

type SanityPhoto = { _key: string; asset: { _ref: string }; photoCategory?: string }
type SanityVideo = { _key: string; url: string; title?: string }

type SanityArtist = {
  name:                string
  city:                string
  category:            string
  experience:          number
  projectTypes?:       string
  experienceDescription?: string
  featuredProjects?:   string
  description:         string
  age?:                number
  height?:             number
  hashtags?:           string[]
  cvUrl?:              string
  artistAvailability?: boolean
  esProfesor?:         boolean
  tiposClase?:         string[]
  complexion?:         string
  eyeColor?:           string
  hairType?:           string
  hairLength?:         string
  hairColor?:          string
  skills?:             string[]
  agencyProfile?:      string
  trayectoria?:        Array<{ proyecto: string; cliente: string; anio: number }>
  photos:              SanityPhoto[]
  videos:              SanityVideo[]
  pendingPhotos?:      SanityPhoto[]
  pendingVideos?:      SanityVideo[]
}

function DataField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide">{label}</dt>
      <dd className="text-sm text-zinc-700 mt-0.5">{value || "—"}</dd>
    </div>
  )
}

export default async function AdminArtistDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()

  const { id } = await params

  if (!id) return <div>ID inválido</div>

  const profile = await prisma.artistProfile.findUnique({
    where: { id },
    include: {
      user: true,
      revisions: { orderBy: { createdAt: "desc" } },
    },
  })

  if (!profile) return <div>Artista no encontrado</div>

  let artist: SanityArtist | null = null
  if (profile.sanityId) {
    artist = await sanityClient.fetch(
      `*[_type == "artist" && _id == $id][0]{
        name, city, category, experience, description,
        projectTypes, experienceDescription, featuredProjects,
        age, height, hashtags, cvUrl, artistAvailability, esProfesor, tiposClase,
        complexion, eyeColor, hairType, hairLength, hairColor,
        skills, agencyProfile,
        trayectoria[]{ proyecto, cliente, anio },
        photos[]{ _key, asset, photoCategory },
        "videos": videos[]{ _key, url, title },
        pendingPhotos[]{ _key, asset, photoCategory },
        "pendingVideos": pendingVideos[]{ _key, url, title }
      }`,
      { id: profile.sanityId }
    )
  }

  const pendingRevision = profile.revisions.find((rev) => rev.status === "PENDING")
  const revisionData = pendingRevision?.data as Record<string, any> | undefined

  return (
    <div>
      <Link
        href="/admin/artists"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 mb-6 transition-colors"
      >
        ← Volver a Artistas
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-heading text-4xl">{artist?.name || profile.user.email}</h1>
          <p className="text-sm text-zinc-500 mt-1">{profile.user.email}</p>
        </div>
        <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium ${statusClasses[profile.status]}`}>
          {profile.status}
        </span>
      </div>

      {/* ── Datos actuales + Revisión pendiente ── */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {artist && profile.sanityId ? (
          <AdminEditArtistForm
            sanityId={profile.sanityId}
            initialData={{
              name:               artist.name,
              city:               artist.city,
              category:           artist.category,
              experience:         artist.experience,
              projectTypes:       artist.projectTypes,
              experienceDescription: artist.experienceDescription,
              featuredProjects:   artist.featuredProjects,
              description:        artist.description,
              age:                artist.age,
              height:             artist.height,
              hashtags:           artist.hashtags,
              cvUrl:              artist.cvUrl,
              artistAvailability: artist.artistAvailability,
              esProfesor:         artist.esProfesor,
              tiposClase:         artist.tiposClase,
              complexion:         artist.complexion,
              eyeColor:           artist.eyeColor,
              hairType:           artist.hairType,
              hairLength:         artist.hairLength,
              hairColor:          artist.hairColor,
              skills:             artist.skills,
              agencyProfile:      artist.agencyProfile,
              trayectoria:        artist.trayectoria,
            }}
          />
        ) : (
          <div className="bg-white rounded-xl border border-zinc-200 p-6">
            <h2 className="font-heading text-2xl mb-4">Datos Actuales</h2>
            <p className="text-sm text-zinc-400 mb-1">Sin datos en Sanity aún.</p>
            <p className="text-xs text-zinc-400 mb-2">
              El perfil se creó sin conexión a Sanity. Créalo para habilitar la edición.
            </p>
            <CreateSanityProfileButton artistProfileId={profile.id} />
          </div>
        )}

        <div className={`rounded-xl border p-6 ${
          pendingRevision ? "bg-amber-50 border-amber-200" : "bg-zinc-50 border-zinc-200"
        }`}>
          <h2 className="font-heading text-2xl mb-4">Revisión Pendiente</h2>
          {pendingRevision ? (
            <>
              <p className="text-xs text-zinc-500 mb-4">
                Enviada el {new Date(pendingRevision.createdAt).toLocaleString("es-CO")}
              </p>
              <dl className="space-y-3 mb-6">
                <DataField label="Nombre"           value={revisionData?.name} />
                <DataField label="Ciudad"           value={revisionData?.city} />
                <DataField label="Categoría"        value={revisionData?.category} />
                <DataField label="Descripción"      value={revisionData?.description} />
                <DataField label="Experiencia"      value={revisionData?.experience != null ? String(revisionData.experience) + " años" : undefined} />
                <DataField label="Tipo de proyectos" value={revisionData?.projectTypes} />
                <DataField label="Experiencia (descripción)" value={revisionData?.experienceDescription} />
                <DataField label="Proyectos destacados" value={revisionData?.featuredProjects} />
                <DataField label="Edad"             value={revisionData?.age    != null ? String(revisionData.age)    : undefined} />
                <DataField label="Estatura"         value={revisionData?.height != null ? String(revisionData.height) + " cm" : undefined} />
                <DataField label="CV"               value={revisionData?.cvUrl} />
                <DataField label="Hashtags"         value={Array.isArray(revisionData?.hashtags) ? revisionData.hashtags.join(", ") : revisionData?.hashtags} />
                <DataField label="Complexión"       value={revisionData?.complexion} />
                <DataField label="Color de ojos"    value={revisionData?.eyeColor} />
                <DataField label="Tipo de cabello"  value={revisionData?.hairType} />
                <DataField label="Largo del cabello" value={revisionData?.hairLength} />
                <DataField label="Color de cabello" value={revisionData?.hairColor} />
                <DataField label="Perfil en la agencia" value={revisionData?.agencyProfile} />
                <DataField label="Habilidades"      value={Array.isArray(revisionData?.skills) ? revisionData.skills.join(", ") : revisionData?.skills} />
                {Array.isArray(revisionData?.trayectoria) && revisionData.trayectoria.length > 0 && (
                  <div>
                    <dt className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Trayectoria</dt>
                    <dd className="mt-1 space-y-1">
                      {revisionData.trayectoria.map((t: any, i: number) => (
                        <div key={i} className="text-sm text-zinc-700 bg-amber-50 rounded px-2 py-1">
                          <span className="font-medium">{t.proyecto}</span>
                          {t.cliente && <span className="text-zinc-500"> · {t.cliente}</span>}
                          {t.anio && <span className="text-zinc-400 text-xs"> · {t.anio}</span>}
                        </div>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>

              {artist && ((artist.pendingPhotos?.length ?? 0) > 0 || (artist.pendingVideos?.length ?? 0) > 0) && (
                <div className="mb-6 space-y-4">
                  {artist.pendingPhotos && artist.pendingPhotos.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2">
                        Fotos pendientes ({artist.pendingPhotos.length})
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {artist.pendingPhotos.map((photo) => (
                          <div key={photo._key} className="relative aspect-[3/4] rounded-lg overflow-hidden bg-zinc-100">
                            <Image src={urlFor(photo).width(160).height(210).url()} alt={photo.photoCategory ?? "Foto pendiente"} fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {artist.pendingVideos && artist.pendingVideos.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2">
                        Videos pendientes ({artist.pendingVideos.length})
                      </p>
                      <ul className="space-y-1.5">
                        {artist.pendingVideos.map((video) => (
                          <li key={video._key} className="text-sm">
                            <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-red-700">
                              {video.title || video.url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <RevisionActions id={pendingRevision.id} />
            </>
          ) : (
            <p className="text-sm text-zinc-400">No hay revisiones pendientes.</p>
          )}
        </div>
      </div>

      {/* ── Fotos y Videos ── */}
      {artist && profile.sanityId && (
        <div className="mb-6">
          <ArtistMediaManager
            sanityId={profile.sanityId}
            photos={artist.photos ?? []}
            videos={artist.videos ?? []}
          />
        </div>
      )}

      {/* ── Historial ── */}
      {profile.revisions.length > 0 && (
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="font-heading text-2xl mb-4">Historial de Revisiones</h2>
          <div className="space-y-2">
            {profile.revisions.map((rev) => (
              <div
                key={rev.id}
                className="flex items-center justify-between py-2 border-b border-zinc-50 last:border-0"
              >
                <span className="text-sm text-zinc-500">
                  {new Date(rev.createdAt).toLocaleString("es-CO")}
                </span>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusClasses[rev.status]}`}>
                  {rev.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
