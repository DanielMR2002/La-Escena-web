'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    city: '',
    date: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setForm({ name: '', email: '', company: '', service: '', city: '', date: '', message: '' })
        setSuccess(true)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-4 py-2.5 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          name="name"
          placeholder="Nombre completo"
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

      <div className="grid sm:grid-cols-2 gap-4">
        <input
          name="company"
          placeholder="Empresa (opcional)"
          value={form.company}
          onChange={handleChange}
          className={inputClass}
        />
        <select
          name="service"
          value={form.service}
          onChange={handleChange}
          required
          className={inputClass}
        >
          <option value="">Servicio de interés</option>
          <option value="Agencia">Agencia de Talento</option>
          <option value="Clases de baile">Clases de Baile</option>
          <option value="Book">Book de Fotos</option>
          <option value="Contenido">Creación de Contenido</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <input
          name="city"
          placeholder="Ciudad"
          value={form.city}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <textarea
        name="message"
        placeholder="Cuéntanos sobre tu proyecto..."
        value={form.message}
        onChange={handleChange}
        required
        rows={5}
        className={`${inputClass} resize-none`}
      />

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 px-10 py-3 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {loading ? 'Enviando…' : 'Enviar Mensaje'} <ArrowRight size={16} />
      </button>

      {success && (
        <p className="text-sm font-medium text-green-600">
          ¡Mensaje enviado correctamente!
        </p>
      )}
    </form>
  )
}
