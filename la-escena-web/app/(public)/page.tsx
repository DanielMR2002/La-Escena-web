import type { Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'Agencia de Bailarines y Artistas en Colombia',
  description:
    'La Escena S.A.S. conecta marcas y productores con bailarines y artistas de alto talento para eventos, producciones audiovisuales y experiencias únicas.',
  openGraph: {
    title: 'La Escena | Agencia de Bailarines en Colombia',
    description:
      'Conectamos marcas y productores con talento artístico profesional y verificado.',
  },
}

export default function HomePage() {
  return <HomeClient />
}
