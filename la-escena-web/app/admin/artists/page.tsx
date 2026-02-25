export const dynamic = "force-dynamic"

import Link from "next/link"
import styles from "@/styles/admin.module.css"
import { getArtists } from "@/services/artist.service"
import { requireAdmin } from "@/lib/auth"

export default async function AdminArtistsPage() {

  await requireAdmin()

  const artists = await getArtists()

  return (
    <div>
      <h1 className={styles.pageTitle}>Artistas</h1>

      {/* BOTÓN VER REVISIONES */}
      <Link href="/admin/artists/revisions">
        <button
          className={styles.primaryButton}
          style={{ marginRight: "10px" }}
        >
          Ver Revisiones
        </button>
      </Link>


      {/* BOTÓN CREAR ARTISTA */}
      <div style={{ marginBottom: "20px" }}>
        <Link href="/admin/artists/create">
          <button className={styles.primaryButton}>
            + Crear Artista
          </button>
        </Link>
      </div>

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {artists.map((artist) => (
              <tr key={artist.id}>
                <td>{artist.user.email}</td>
                <td
                  className={
                    artist.status === "PENDING"
                      ? styles.statusPending
                      : artist.status === "APPROVED"
                      ? styles.statusApproved
                      : styles.statusRejected
                  }
                >
                  {artist.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
