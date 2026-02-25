export const dynamic = "force-dynamic"

import styles from "@/styles/admin.module.css"
import { requireAdmin } from "@/lib/auth"
import { getPendingRevisions } from "@/services/artist-revision.service"
import RevisionActions from "./RevisionActions"

export default async function AdminArtistRevisionsPage() {

  await requireAdmin()

  const revisions = await getPendingRevisions()

  return (
    <div>
      <h1 className={styles.pageTitle}>
        Revisiones Pendientes
      </h1>

      <div className={styles.card}>
        {revisions.length === 0 && (
          <p>No hay revisiones pendientes.</p>
        )}

        {revisions.map((revision) => (
          <div
            key={revision.id}
            style={{
              padding: "15px",
              borderBottom: "1px solid #eee"
            }}
          >
            <p>
              <strong>Artista:</strong>{" "}
              {revision.artist.user.email}
            </p>

            <p>
              <strong>Fecha:</strong>{" "}
              {new Date(revision.createdAt).toLocaleString()}
            </p>

            <p>
              <strong>Estado:</strong> {revision.status}
            </p>

            <RevisionActions id={revision.id} />
          </div>
        ))}
      </div>
    </div>
  )
}
