"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

const inputClass =
  'w-full px-4 py-2.5 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50'

function NuevaContrasenaForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.")
      return
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.")
      return
    }

    setLoading(true)
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      setSuccess(true)
      setTimeout(() => router.push("/login"), 3000)
    } else {
      setError(data.error ?? "Ocurrió un error. Inténtalo de nuevo.")
    }
  }

  if (!token) {
    return (
      <p className="text-sm text-red-500 text-center">
        Link inválido. Solicita uno nuevo desde la página de inicio de sesión.
      </p>
    )
  }

  return (
    <div className="p-8 bg-card rounded-lg border border-border">
      {success ? (
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="font-heading text-2xl tracking-wide">¡Contraseña actualizada!</h2>
          <p className="text-sm text-muted-foreground">
            Tu contraseña fue cambiada correctamente. Serás redirigido al inicio de sesión en unos segundos.
          </p>
        </div>
      ) : (
        <>
          <h2 className="font-heading text-2xl tracking-wide mb-2">Nueva contraseña</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Elige una contraseña segura de al menos 8 caracteres.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className={inputClass}
            />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              className={inputClass}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Guardando…" : "Guardar contraseña"} <ArrowRight size={16} />
            </button>
          </form>
        </>
      )}
    </div>
  )
}

export default function NuevaContrasenaPage() {
  return (
    <>
      <section className="bg-background py-16">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-white rounded-xl p-4 inline-block mx-auto mb-6 shadow-sm border border-border">
              <Image src="/logo-color.png" alt="La Escena" width={180} height={72} />
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl tracking-wide text-foreground">
              Restablecer contraseña
            </h1>
          </div>
        </div>
      </section>
      <section className="py-16 bg-background">
        <div className="container max-w-md mx-auto">
          <Suspense fallback={<p className="text-sm text-muted-foreground text-center">Cargando…</p>}>
            <NuevaContrasenaForm />
          </Suspense>
        </div>
      </section>
    </>
  )
}
