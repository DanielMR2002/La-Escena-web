"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import PasswordField from "@/app/components/PasswordField"

export default function CreateAdminPage() {
  const router = useRouter()
  const [name,     setName]     = useState("")
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState("")

  const passwordTooShort = password.length > 0 && password.length < 8
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword
  const canSubmit = email && password.length >= 8 && password === confirmPassword

  async function handleSubmit() {
    if (!email)               { setError("El email es requerido"); return }
    if (password.length < 8)  { setError("La contraseña debe tener al menos 8 caracteres"); return }
    if (password !== confirmPassword) { setError("Las contraseñas no coinciden"); return }
    setLoading(true)
    setError("")

    const res = await fetch("/api/admin/admins/create", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ name: name.trim() || undefined, email, password }),
    })

    setLoading(false)

    if (!res.ok) {
      const { error: msg } = await res.json().catch(() => ({ error: "Error al crear el admin." }))
      setError(msg ?? "Error al crear el admin.")
      return
    }

    router.push("/admin/admins")
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors">
          ← Volver
        </button>
        <h1 className="font-heading text-4xl">Crear Admin</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 max-w-md flex flex-col gap-5">

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nombre completo"
            className="px-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@laescena.com"
            className="px-3 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
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
          {loading ? "Creando..." : "Crear Admin"}
        </button>
      </div>
    </div>
  )
}
