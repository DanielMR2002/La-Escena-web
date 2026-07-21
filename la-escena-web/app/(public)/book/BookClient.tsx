'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Check, ArrowRight, MessageCircle } from 'lucide-react'

const packages = [
  {
    name: "Media Jornada",
    price: "Desde $1.300.000 COP",
    featured: false,
    whatsapp: false,
    features: [
      "4 horas de sesión",
      "15 fotografías editadas",
      "Todo el material en crudo",
      "1 cambio de vestuario",
      "Locación interior",
      "Asesoría en dirección artística",
    ],
  },
  {
    name: "Jornada Completa",
    price: "Desde $2.000.000 COP",
    featured: true,
    whatsapp: false,
    features: [
      "8 horas de sesión",
      "25 fotografías editadas",
      "3 cambios de vestuario",
      "Todo el material en crudo",
      "Locación interior",
      "Video reel corto",
      "Asesoría en dirección artística",
    ],
  },
  {
    name: "Book Colectivo",
    price: "Entre $300.000 y $400.000 COP",
    featured: false,
    whatsapp: true,
    features: [
      "1 hora de sesión",
      "Asesoría personalizada durante el book",
      "1 cambio de vestuario",
      "Entrega de 10 fotografías editadas",
      "Cupos limitados en cada edición",
    ],
  },
]

const addons = [
  "Maquillaje profesional",
  "Locaciones especiales",
  "Video Behind the Scenes",
  "Fotografías adicionales",
  "Asesoría de styling",
  "Styling presencial",
]

const bookColectivoWhatsapp = encodeURIComponent(
  "Hola, quiero que me avisen cuándo será el próximo Book Colectivo de La Escena."
)

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

export default function BookClient() {
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
          service: form.package ? `Book - ${form.package}` : 'Book de fotos',
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
      {/* DESCRIPCIÓN */}
      <section className="pt-20 bg-background">
        <div className="container max-w-2xl text-center">
          <p className="text-muted-foreground leading-relaxed">
            Desde nuestra experiencia como
            agencia de talento, sabemos que una buena imagen puede abrir oportunidades y
            marcar la diferencia en un casting o proyecto. Por eso, creamos sesiones
            pensadas para resaltar tu esencia y potenciar tu perfil profesional.
          </p>
        </div>
      </section>

      {/* PAQUETES */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="font-heading text-4xl tracking-wide text-center mb-12">
            Paquetes
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className={`p-8 rounded-lg border flex flex-col ${
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
                <p className="text-xl font-bold text-accent mb-6">{pkg.price}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check size={16} className="text-accent shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                {pkg.whatsapp ? (
                  <a
                    href={`https://wa.me/573106823504?text=${bookColectivoWhatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 font-semibold text-sm uppercase tracking-wider rounded-sm bg-green-600 text-white hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle size={16} />
                    Avísame cuándo será el próximo book
                  </a>
                ) : (
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
                )}
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
          <h2 className="font-heading text-4xl tracking-wide text-center mb-4">
            Solicita tu Book
          </h2>
          <p className="text-muted-foreground text-center mb-10">
            ¿Listo para potenciar tu imagen profesional?
          </p>
          <p className="text-muted-foreground text-center mb-10">
            Completa el formulario y nos pondremos en contacto contigo para asesorarte y encontrar el paquete ideal según tus objetivos.
          </p>
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
                placeholder="Correo electrónico"
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
              className={inputClass}
            >
              <option value="">Paquete de interés</option>
              {packages.map((pkg) => (
                <option key={pkg.name} value={pkg.name}>{pkg.name}</option>
              ))}
            </select>
            <textarea
              name="message"
              placeholder="Cuéntanos un poco sobre lo que necesitas"
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
              {loading ? 'Enviando…' : 'Solicitar mi book'} <ArrowRight size={16} />
            </button>
            {success && (
              <p className="text-sm font-medium text-green-600 text-center">
                ¡Gracias por escribirnos! Hemos recibido tu solicitud y muy pronto nos
                pondremos en contacto contigo.
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  )
}
