"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"

const inputClass =
  'w-full px-4 py-2.5 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50'

export default function RecuperarContrasenaPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    setLoading(false)

    if (res.ok) {
      setSent(true)
    } else {
      setError("Ocurrió un error. Inténtalo de nuevo.")
    }
  }

  return (
    <>
      <section className="bg-background py-16">
        <div className="container max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/login')}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Volver al inicio de sesión
          </button>
          <div className="text-center">
            <div className="bg-white rounded-xl p-4 inline-block mx-auto mb-6 shadow-sm border border-border">
              <Image src="/logo-color.png" alt="La Escena" width={180} height={72} />
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl tracking-wide text-foreground">
              Recuperar contraseña
            </h1>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container max-w-md mx-auto">
          <div className="p-8 bg-card rounded-lg border border-border">
            {sent ? (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className="font-heading text-2xl tracking-wide">Correo enviado</h2>
                <p className="text-sm text-muted-foreground">
                  Si el correo <strong className="text-foreground">{email}</strong> está registrado, recibirás un link para restablecer tu contraseña en los próximos minutos.
                </p>
                <p className="text-xs text-muted-foreground">Revisa también tu carpeta de spam.</p>
              </div>
            ) : (
              <>
                <h2 className="font-heading text-2xl tracking-wide mb-2">¿Olvidaste tu contraseña?</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Ingresa tu correo y te enviaremos un link para crear una nueva contraseña.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Tu correo electrónico"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className={inputClass}
                  />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Enviando…" : "Enviar link"} <ArrowRight size={16} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
