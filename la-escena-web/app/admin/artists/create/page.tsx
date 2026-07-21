"use client"

import { useState } from "react"
import Link from "next/link"
import PasswordField from "@/app/components/PasswordField"

export default function CreateArtistPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const passwordTooShort = password.length > 0 && password.length < 8
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword
  const canSubmit = email && password.length >= 8 && password === confirmPassword

  const handleSubmit = async () => {
    if (!canSubmit) return
    setLoading(true)
    setMessage(null)

    const res = await fetch("/api/admin/artists/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setMessage({ type: "error", text: data.error || "Error creando artista" })
      return
    }

    setMessage({ type: "success", text: "Artista creado correctamente" })
    setEmail("")
    setPassword("")
    setConfirmPassword("")
  }

  return (
    <div>
      <Link
        href="/admin/artists"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 mb-6 transition-colors"
      >
        ← Volver a Artistas
      </Link>

      <h1 className="font-heading text-4xl mb-8">Crear Artista</h1>

      <div className="bg-white rounded-xl border border-zinc-200 p-6 max-w-md">
        {message && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">
              Email
            </label>
            <input
              type="email"
              placeholder="artista@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
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

          <button
            onClick={handleSubmit}
            disabled={loading || !canSubmit}
            className="w-full py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creando..." : "Crear Artista"}
          </button>
        </div>
      </div>
    </div>
  )
}
