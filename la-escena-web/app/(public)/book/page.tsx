'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Check, ArrowRight } from 'lucide-react'

const packages = [
  {
    name: "Media Jornada",
    price: "Desde $XXX",
    featured: false,
    features: [
      "4 horas de sesión",
      "20 fotos editadas",
      "1 cambio de vestuario",
      "Locación interior",
    ],
  },
  {
    name: "Jornada Completa",
    price: "Desde $XXX",
    featured: true,
    features: [
      "8 horas de sesión",
      "50 fotos editadas",
      "3 cambios de vestuario",
      "Locación interior + exterior",
      "Video reel corto",
    ],
  },
]

const addons = [
  "Maquillaje profesional",
  "Locaciones especiales",
  "Video behind the scenes",
  "Fotos adicionales",
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
}

const inputClass =
  'w-full px-4 py-2.5 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50'

export default function BookPage() {
  const formRef = useRef<HTMLElement>(null)
  const [form, setForm] = useState({ name: '', email: '', package: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleCotizar = (pkgName: string) => {
    setForm(f => ({ ...f, package: pkgName }))
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          service: `Book - ${form.package}`,
          message: form.message,
        }),
      })
      if (res.ok) {
        setForm({ name: '', email: '', package: '', message: '' })
        setSuccess(true)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* HERO */}
      <section className="bg-foreground py-20">
        <div className="container text-center space-y-4">
          <h1 className="font-heading text-5xl sm:text-7xl tracking-wide text-primary-foreground">
            Book de <span className="text-secondary">Fotos</span>
          </h1>
          <p className="text-primary-foreground/60 max-w-lg mx-auto">
            Tu imagen profesional: fotografía, video y acompañamiento creativo.
            Paquetes de media y jornada completa.
          </p>
        </div>
      </section>

      {/* PAQUETES */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="font-heading text-4xl tracking-wide text-center mb-12">
            Paquetes
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className={`p-8 rounded-lg border ${
                  pkg.featured
                    ? 'border-accent bg-accent/5 ring-2 ring-accent/20'
                    : 'border-border bg-card'
                }`}
              >
                {pkg.featured && (
                  <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-accent text-accent-foreground rounded-full mb-4">
                    Popular
                  </span>
                )}
                <Camera size={32} className="text-accent mb-4" />
                <h3 className="font-heading text-2xl tracking-wide mb-2">{pkg.name}</h3>
                <p className="text-2xl font-bold text-accent mb-6">{pkg.price}</p>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check size={16} className="text-accent shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleCotizar(pkg.name)}
                  className={`w-full py-3 font-semibold text-sm uppercase tracking-wider rounded-sm transition-colors ${
                    pkg.featured
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border border-border text-foreground hover:bg-muted'
                  }`}
                >
                  Cotizar
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ADD-ONS */}
      <section className="py-16 bg-muted">
        <div className="container max-w-2xl text-center">
          <h2 className="font-heading text-3xl tracking-wide mb-8">
            Add-ons Disponibles
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {addons.map((a) => (
              <span
                key={a}
                className="px-5 py-2.5 bg-card border border-border rounded-full text-sm font-medium"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FORMULARIO */}
      <section ref={formRef} className="py-20 bg-background">
        <div className="container max-w-2xl">
          <h2 className="font-heading text-4xl tracking-wide text-center mb-10">
            Solicita tu Book
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Nombre"
                value={form.name}
                onChange={handleChange}
                required
                className={inputClass}
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <select
              name="package"
              value={form.package}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">Paquete de interés</option>
              {packages.map((pkg) => (
                <option key={pkg.name} value={pkg.name}>{pkg.name}</option>
              ))}
            </select>
            <textarea
              name="message"
              placeholder="Cuéntanos más..."
              value={form.message}
              onChange={handleChange}
              rows={4}
              className={`${inputClass} resize-none`}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Enviando…' : 'Enviar Solicitud'} <ArrowRight size={16} />
            </button>
            {success && (
              <p className="text-sm font-medium text-green-600 text-center">
                ¡Solicitud enviada correctamente!
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  )
}
