"use client"

import { useEffect, useState } from "react"

export default function CreateClientPage() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [artists, setArtists] = useState<any[]>([])
  const [selectedArtists, setSelectedArtists] = useState<string[]>([])

  useEffect(() => {
    fetch("/api/admin/artists/list")
      .then(res => res.json())
      .then(data => setArtists(data))
  }, [])

  const toggleArtist = (id: string) => {
    setSelectedArtists(prev =>
      prev.includes(id)
        ? prev.filter(a => a !== id)
        : [...prev, id]
    )
  }

  const handleSubmit = async () => {
    const res = await fetch("/api/admin/clients/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        email,
        password,
        artistIds: selectedArtists
    })
    })

    const data = await res.json()

    console.log("API RESPONSE:", data)

    if (!res.ok) {
        alert("Error al crear cliente")
        return
    }

    alert("Cliente creado")
    }


  return (
    <div>
      <h1>Crear Cliente</h1>

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

      <h3>Seleccionar Artistas</h3>

      <div>
        {artists.map((artist) => (
          <div key={artist.id}>
            <label>
              <input
                type="checkbox"
                onChange={() => toggleArtist(artist.id)}
              />
              {artist.user.email}
            </label>
          </div>
        ))}
      </div>

      <button onClick={handleSubmit}>
        Confirmar
      </button>
    </div>
  )
}
