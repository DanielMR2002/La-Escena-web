"use client"

import { useState } from "react"

export default function CreateArtistPage() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async () => {
    const res = await fetch("/api/admin/artists/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (!res.ok) {
      alert("Error creando artista")
      return
    }

    alert("Artista creado correctamente")
    setEmail("")
    setPassword("")
  }

  return (
    <div>
      <h1>Crear Artista</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button onClick={handleSubmit}>
        Crear Artista
      </button>
    </div>
  )
}
