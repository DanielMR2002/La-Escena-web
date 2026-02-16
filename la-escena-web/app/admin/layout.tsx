import Link from "next/link"
import { ReactNode } from "react"

export default function AdminLayout({
  children
}: {
  children: ReactNode
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <aside
        style={{
          width: "240px",
          background: "#111",
          color: "white",
          padding: "20px"
        }}
      >
        <h2 style={{ marginBottom: "30px" }}>Panel Admin</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/clients">Clientes</Link>
          <Link href="/admin/artists">Artistas</Link>
        </nav>
      </aside>

      {/* Content */}
      <main
        style={{
          flex: 1,
          padding: "40px",
          background: "#f5f5f5"
        }}
      >
        {children}
      </main>
    </div>
  )
}
