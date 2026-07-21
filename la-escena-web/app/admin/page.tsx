export const dynamic = "force-dynamic"

import { getClients } from "@/services/user.service"
import { getArtists } from "@/services/artist.service"
import { getPendingRevisionsCount } from "@/services/artist-revision.service"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function AdminDashboard() {

  await requireAdmin()

  const [clients, artists, pendingRevisionsCount, pendingShortlistsCount] = await Promise.all([
    getClients(),
    getArtists(),
    getPendingRevisionsCount(),
    prisma.clientShortlist.count({ where: { status: "PENDING" } }),
  ])

  return (
    <div>
      <h1>Dashboard</h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
        
        <div style={{ background: "white", padding: "20px", borderRadius: "10px" }}>
          <h3>Total Clientes</h3>
          <p style={{ fontSize: "28px", fontWeight: "bold" }}>
            {clients.length}
          </p>
        </div>

        <div style={{ background: "white", padding: "20px", borderRadius: "10px" }}>
          <h3>Total Artistas</h3>
          <p style={{ fontSize: "28px", fontWeight: "bold" }}>
            {artists.length}
          </p>
        </div>

        <div style={{ background: "white", padding: "20px", borderRadius: "10px" }}>
          <h3>Revisiones Pendientes</h3>
          <p style={{ fontSize: "28px", fontWeight: "bold" }}>
            {pendingRevisionsCount}
          </p>
        </div>

        <div style={{ background: "white", padding: "20px", borderRadius: "10px" }}>
          <h3>Shortlists Pendientes</h3>
          <p style={{ fontSize: "28px", fontWeight: "bold" }}>
            {pendingShortlistsCount}
          </p>
        </div>

      </div>
    </div>
  )
}