export const dynamic = "force-dynamic"

import { getClients } from "@/services/user.service"
import { getArtists } from "@/services/artist.service"
import { requireAdmin } from "@/lib/auth"

export default async function AdminDashboard() {

  await requireAdmin()

  const [clients, artists] = await Promise.all([
    getClients(),
    getArtists()
  ])

  const pendingArtists = artists.filter(
    (artist) => artist.status === "PENDING"
  )


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
          <h3>Artistas Pendientes</h3>
          <p style={{ fontSize: "28px", fontWeight: "bold" }}>
            {pendingArtists.length}
          </p>
        </div>


      </div>
    </div>
  )
}
