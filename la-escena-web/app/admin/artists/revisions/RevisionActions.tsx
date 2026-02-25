"use client"

import { useRouter } from "next/navigation"


export default function RevisionActions({ id }: { id: string }) {

  const router = useRouter()

  async function approve() {
    try {
      const res = await fetch(
        "/api/admin/artists/revisions/approve",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id })
        }
      )

      if (!res.ok) {
        console.error("Error approving revision")
        return
      }

      // Esto refresca SOLO los datos del server component
      router.refresh()

    } catch (error) {
      console.error("Error:", error)
    }
  }

  async function reject() {
    const comment = prompt("Motivo del rechazo:")
    if (!comment) return

    const res = await fetch(
      "/api/admin/artists/revisions/reject",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, comment })
      }
    )

    if (!res.ok) {
      console.error("Error rejecting revision")
      return
    }

    router.refresh()
  }

  console.log("Render RevisionActions con id:", id)

  return (
    <div style={{ marginTop: "10px" }}>
      <button onClick={approve}>        
        Aprobar
      </button>

      <button
        style={{ marginLeft: "10px" }}
        onClick={reject}
      >
        Rechazar
      </button>
    </div>
  )
}
