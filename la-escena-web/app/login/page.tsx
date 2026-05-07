"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, getSession } from "next-auth/react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

const inputClass =
  'w-full px-4 py-2.5 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (!res?.error) {
      const session = await getSession()

      if (session?.user.role === "ADMIN") {
        router.push("/admin")
      } else if (session?.user.role === "CLIENT") {
        router.push("/cliente")
      } else {
        router.push("/")
      }
    } else {
      setError("Credenciales incorrectas")
      setLoading(false)
    }
  }

  return (
    <section className="py-20 bg-background min-h-[70vh] flex items-center">
      <div className="container max-w-md mx-auto">

        {/* HEADER */}
        <div className="text-center mb-8">
          <Image
            src="/logo-color.png"
            alt="La Escena"
            width={200}
            height={80}
            className="mx-auto mb-6"
          />
          <h1 className="font-heading text-3xl tracking-wide">
            Iniciar Sesión
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Ingresa a tu cuenta de La Escena
          </p>
        </div>

        {/* CARD */}
        <form
          onSubmit={handleLogin}
          className="space-y-4 p-8 bg-card rounded-lg border border-border"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className={inputClass}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className={inputClass}
          />

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Ingresando…" : "Ingresar"} <ArrowRight size={16} />
          </button>
        </form>

      </div>
    </section>
  )
}
