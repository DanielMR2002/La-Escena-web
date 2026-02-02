import Link from 'next/link'

export default function HomePage() {
  return (
    <section style={{ padding: '2rem' }}>
      <h1>La Escena</h1>
      <p>
        Agencia de artistas, bailarines y creadores de contenido.
      </p>

      <section style={{ marginTop: '2rem' }}>
        <h2>¿Qué hacemos?</h2>
        <ul>
          <li>Representación artística</li>
          <li>Clases de baile</li>
          <li>Book fotográfico</li>
          <li>Creación de contenido</li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <Link href="/contacto">
          Contactar
        </Link>
      </section>
    </section>
  )
}
