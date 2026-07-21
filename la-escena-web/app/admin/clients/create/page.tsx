"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import ArtistCatalog, { type ArtistItem } from "../ArtistCatalog"
import PasswordField from "@/app/components/PasswordField"

export default function CreateClientPage() {
  const router = useRouter()

  const [name, setName]         = useState("")
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [artists, setArtists]   = useState<ArtistItem[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState("")

  useEffect(() => {
    fetch("/api/admin/artists/list")
      .then(r => r.json())
      .then(data => setArtists(data))
  }, [])

  const toggle = (userId: string) =>
    setSelectedIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    )

  const selectedArtists = artists.filter(a => selectedIds.includes(a.userId))

  const passwordTooShort = password.length > 0 && password.length < 8
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword
  const canSubmit = name.trim() && email && password.length >= 8 && password === confirmPassword

  const handleSubmit = async () => {
    if (!name.trim()) { setError("El nombre es requerido"); return }
    if (!email)       { setError("El email es requerido");  return }
    if (password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres"); return }
    if (password !== confirmPassword) { setError("Las contraseñas no coinciden"); return }
    setLoading(true)
    setError("")

    const res = await fetch("/api/admin/clients/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email, password, artistIds: selectedIds }),
    })

    setLoading(false)
    if (!res.ok) {
      setError("Error al crear el cliente. El email podría ya estar registrado.")
      return
    }
    router.push("/admin/clients")
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          ← Volver
        </button>
        <h1 className="font-heading text-4xl">Crear Cliente</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Sidebar — form */}
        <div className="w-full lg:w-72 shrink-0 lg:sticky lg:top-10">
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6 flex flex-col gap-5">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                Nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nombre del cliente o empresa"
                className="px-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="cliente@email.com"
                className="px-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            <PasswordField label="Contraseña" value={password} onChange={setPassword} />
            {passwordTooShort && (
              <p className="text-xs text-red-600 -mt-3">Mínimo 8 caracteres</p>
            )}

            <PasswordField label="Confirmar contraseña" value={confirmPassword} onChange={setConfirmPassword} />
            {passwordMismatch && (
              <p className="text-xs text-red-600 -mt-3">Las contraseñas no coinciden</p>
            )}

            {/* Artistas seleccionados */}
            {selectedArtists.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                  Artistas ({selectedArtists.length})
                </p>
                <div className="flex flex-col gap-1 max-h-52 overflow-y-auto">
                  {selectedArtists.map(a => (
                    <div
                      key={a.userId}
                      className="flex items-center justify-between bg-zinc-50 rounded-lg px-3 py-1.5"
                    >
                      <span className="text-xs text-zinc-700 truncate">
                        {a.name ?? a.email}
                      </span>
                      <button
                        onClick={() => toggle(a.userId)}
                        className="ml-2 shrink-0 text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !canSubmit}
              className="px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Creando..." : "Crear Cliente"}
            </button>
          </div>
        </div>

        {/* Catálogo de artistas */}
        <div className="flex-1 min-w-0">
          <ArtistCatalog
            artists={artists}
            selected={selectedIds}
            onToggle={toggle}
          />
        </div>
      </div>
    </div>
  )
}
