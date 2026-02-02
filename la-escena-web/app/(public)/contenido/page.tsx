'use client'

export default function ContenidoPage() {
  const whatsappMessage = encodeURIComponent(
    'Hola, estoy interesado en los servicios de creación de contenido de La Escena.'
  )

  return (
    <section style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h1>Creación de contenido</h1>

      <p style={{ marginTop: '1rem' }}>
        En La Escena creamos contenido visual y digital enfocado en marcas,
        artistas y proyectos que buscan destacar en plataformas digitales.
      </p>

      <section style={{ marginTop: '2rem' }}>
        <h2>Servicios que ofrecemos</h2>
        <ul>
          <li>Contenido para redes sociales</li>
          <li>Producción audiovisual</li>
          <li>Dirección creativa</li>
          <li>Contenido con talento artístico</li>
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
