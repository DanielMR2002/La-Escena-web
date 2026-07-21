"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, getSession } from "next-auth/react"
import Image from "next/image"
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react"

const inputClass =
  'w-full px-4 py-2.5 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50'

const APPLY_FORM_URL = "https://forms.gle/B9UuxFKcJZP8eHTS9"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [applied, setApplied] = useState(false)

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

  const handleApply = () => {
    window.open(APPLY_FORM_URL, "_blank", "noopener,noreferrer")
    setApplied(true)
  }

  return (
    <>
      {/* HERO */}
      <section className="bg-foreground py-16">
        <div className="container max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Volver
          </button>

          <div className="text-center">
            <div className="bg-white rounded-xl p-4 inline-block mx-auto mb-6">
              <Image
                src="/logo-color.png"
                alt="La Escena"
                width={180}
                height={72}
              />
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl tracking-wide text-primary-foreground">
              Bienvenido a <span className="text-secondary">La Escena</span>
            </h1>
          </div>
        </div>
      </section>

      {/* OPCIONES */}
      <section className="py-16 bg-background">
        <div className="container max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">

            {/* YA HACES PARTE */}
            <div className="flex flex-col p-8 bg-card rounded-lg border border-border">
              <h2 className="font-heading text-2xl tracking-wide mb-2">
                Ya haces parte de La Escena
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Ingresa con tus credenciales para acceder a tu perfil artístico.
              </p>

              <form onSubmit={handleLogin} className="space-y-4 mt-auto">
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
                  {loading ? "Ingresando…" : "Iniciar sesión"} <ArrowRight size={16} />
                </button>
              </form>
            </div>

            {/* QUIERO PERTENECER */}
            <div className="flex flex-col p-8 bg-card rounded-lg border border-border">
              <h2 className="font-heading text-2xl tracking-wide mb-2">
                ¿Quieres pertenecer a LA ESCENA?
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Envíanos tu información para aplicar a nuestros castings y oportunidades artísticas.
              </p>

              <div className="mt-auto space-y-4">
                <button
                  type="button"
                  onClick={handleApply}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-secondary text-secondary-foreground font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-secondary/90 transition-colors"
                >
                  Aplicar a la agencia <ExternalLink size={16} />
                </button>

                {applied && (
                  <div className="text-sm text-muted-foreground bg-muted rounded-md p-4 space-y-2">
                    <p className="font-medium text-foreground">
                      ¡Tu aplicación fue enviada correctamente!
                    </p>
                    <p>
                      Nuestro equipo revisará tu perfil y te responderemos en aproximadamente 30 días hábiles.
                    </p>
                    <p>Gracias por querer hacer parte de LA ESCENA.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
