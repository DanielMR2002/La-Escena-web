'use client'
export const dynamic = 'force-dynamic'

export default function ClasesPage() {
  const whatsappMessage = encodeURIComponent(
    'Hola, estoy interesado en las clases de baile de La Escena.'
  )

  return (
    <section style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h1>Clases de baile</h1>

      <p style={{ marginTop: '1rem' }}>
        En La Escena ofrecemos clases de baile para todos los niveles,
        impartidas por profesionales activos de la industria artística.
      </p>

      <section style={{ marginTop: '2rem' }}>
        <h2>¿Qué tipos de clases ofrecemos?</h2>
        <ul>
          <li>Clases grupales</li>
          <li>Clases personalizadas</li>
          <li>Entrenamiento profesional</li>
          <li>Preparación para castings</li>
        </ul>
      </section>

      <section style={{ marginTop: '3rem' }}>
        <a
          href={`https://wa.me/573106823504?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#000',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '6px'
          }}
        >
          Contactar por WhatsApp
        </a>
      </section>
    </section>
  )
}
