'use client'

export default function AboutPage() {
  return (
    <section
      style={{
        padding: '2rem',
        maxWidth: 900,
        margin: '0 auto',
        lineHeight: 1.6
      }}
    >
      <h1>Sobre La Escena</h1>

      <p style={{ marginTop: '1.5rem' }}>
        La Escena es una agencia creativa enfocada en la representación,
        formación y proyección de artistas, bailarines y creadores de
        contenido.
      </p>

      <p style={{ marginTop: '1rem' }}>
        Nuestro objetivo es conectar talento con oportunidades reales dentro
        de la industria artística, audiovisual y publicitaria.
      </p>

      <section style={{ marginTop: '2.5rem' }}>
        <h2>¿Qué nos diferencia?</h2>

        <ul style={{ marginTop: '1rem' }}>
          <li>Artistas activos en la industria</li>
          <li>Procesos claros y profesionales</li>
          <li>Acompañamiento personalizado</li>
          <li>Conexión directa con clientes y proyectos</li>
        </ul>
      </section>
    </section>
  )
}
