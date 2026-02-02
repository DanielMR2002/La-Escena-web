'use client'

import { useState } from 'react'
import styles from '@/styles/contact.module.css'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    city: '',
    date: '',
    message: ''
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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
        body: JSON.stringify(form)
      })

      if (res.ok) {
        setForm({
          name: '',
          email: '',
          company: '',
          service: '',
          city: '',
          date: '',
          message: ''
        })
        setSuccess(true)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const whatsappMessage = encodeURIComponent(
    `Hola, estoy interesado en ${form.service || 'sus servicios'}.
Mi nombre es ${form.name || ''}.`
  )

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        name="name"
        placeholder="Nombre"
        value={form.name}
        onChange={handleChange}
        required
      />

      <input
        name="email"
        type="email"
        placeholder="Correo electrónico"
        value={form.email}
        onChange={handleChange}
        required
      />

      <input
        name="company"
        placeholder="Empresa"
        value={form.company}
        onChange={handleChange}
      />

      <select
        name="service"
        value={form.service}
        onChange={handleChange}
        required
      >
        <option value="">Servicio</option>
        <option value="Agencia">Agencia</option>
        <option value="Clases de baile">Clases de baile</option>
        <option value="Book">Book fotográfico</option>
        <option value="Contenido">Creación de contenido</option>
      </select>

      <input
        name="city"
        placeholder="Ciudad"
        value={form.city}
        onChange={handleChange}
      />

      <input
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
      />

      <textarea
        name="message"
        placeholder="Mensaje"
        value={form.message}
        onChange={handleChange}
        required
      />

      {/* Botón correo */}
      <button
        type="submit"
        className={styles.submitButton}
        disabled={loading}
      >
        {loading ? 'Enviando…' : 'Enviar por correo'}
      </button>

      {success && (
        <p className={styles.success}>
          ¡Mensaje enviado correctamente!
        </p>
      )}

      {/* WhatsApp */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsappButton}
      >
        Contactar por WhatsApp
      </a>
    </form>
  )
}
