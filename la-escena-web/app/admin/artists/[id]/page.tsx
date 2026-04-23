export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { sanityClient } from "@/lib/sanity"
import { requireAdmin } from "@/lib/auth"

export default async function AdminArtistDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()

  const { id } = await params  

  if (!id) {
    return <div>ID inválido</div>
  }

  const profile = await prisma.artistProfile.findUnique({
    where: { id },
    include: {
      revisions: {
        orderBy: { createdAt: "desc" }
      }
    }
  })

  if (!profile) {
    return <div>Artista no encontrado</div>
  }

  if (!profile.sanityId) {
    return <div>Este artista no está conectado a Sanity</div>
  }

  const artist = await sanityClient.fetch(
    `*[_type == "artist" && _id == $id][0]`,
    { id: profile.sanityId }
  )

  const pendingRevision = profile.revisions.find(
    (rev) => rev.status === "PENDING"
  )

  const revisionData = pendingRevision?.data as any

  return (
    <div style={{ padding: "40px" }}>
      <h1>Perfil del Artista</h1>

      <p><strong>Estado:</strong> {profile.status}</p>

      <hr style={{ margin: "20px 0" }} />

      <h2>Información pública</h2>

      <hr style={{ margin: "30px 0" }} />

      <h2>Revisión pendiente</h2>

      {pendingRevision ? (
        <div style={{ background: "#fff3cd", padding: "20px", borderRadius: "8px" }}>
          <p><strong>Estado:</strong> {pendingRevision.status}</p>
          <p><strong>Creada:</strong> {new Date(pendingRevision.createdAt).toLocaleString()}</p>

          <p><strong>Nombre propuesto:</strong> {revisionData?.name}</p>
          <p><strong>Ciudad propuesta:</strong> {revisionData?.city}</p>
          <p><strong>Categoría propuesta:</strong> {revisionData?.category}</p>
          <p><strong>Experiencia propuesta:</strong> {revisionData?.experience}</p>
          <p><strong>Descripción propuesta:</strong> {revisionData?.description}</p>
        </div>
      ) : (
        <p>No hay revisiones pendientes.</p>
      )}

      <p><strong>Nombre:</strong> {artist?.name}</p>
      <p><strong>Ciudad:</strong> {artist?.city}</p>
      <p><strong>Categoría:</strong> {artist?.category}</p>
      <p><strong>Experiencia:</strong> {artist?.experience}</p>
      <p><strong>Descripción:</strong> {artist?.description}</p>
    </div>
  )
}