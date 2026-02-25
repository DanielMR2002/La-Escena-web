"use client"

import { useState } from "react"

export default function EditArtistForm({
  artistId,
  initialData,
  lastRejectedRevision
}: {
  artistId: string
  initialData: any
  lastRejectedRevision: any
}) {

  const [bio, setBio] = useState(initialData?.bio || "")
  const [category, setCategory] = useState(initialData?.category || "")
  const [showComment, setShowComment] = useState(true)

  const handleSubmit = async () => {
    await fetch("/api/artist/revision/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        artistId,
        data: {
          bio,
          category
        }
      })
    })

    alert("Cambios enviados para revisión")
  }

  return (
    <div style={{ marginTop: "30px" }}>

      {lastRejectedRevision && (
        <div style={{
          background: "#ffe5e5",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          border: "1px solid #ffb3b3"
        }}>
          <button
            onClick={() => setShowComment(!showComment)}
            style={{
              marginBottom: "10px",
              cursor: "pointer"
            }}
          >
            {showComment ? "Ocultar comentario" : "Mostrar comentario"}
          </button>

          {showComment && (
            <>
              <strong>Tu última revisión fue rechazada:</strong>
              <p style={{ marginTop: "8px" }}>
                {lastRejectedRevision.adminComment}
              </p>
            </>
          )}
        </div>
      )}

      <div>
        <label>Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <label>Categoría</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <button
        style={{ marginTop: "20px" }}
        onClick={handleSubmit}
      >
        Enviar cambios
      </button>
    </div>
  )
}