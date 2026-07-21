import "./globals.css"
import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Providers from "@/app/components/Providers"

export const metadata: Metadata = {
  title: {
    default: "La Escena | Agencia de Bailarines y Artistas en Colombia",
    template: "%s | La Escena",
  },
  description:
    "La Escena S.A.S. — Agencia de bailarines y artistas. Conectamos marcas y productores con talento artístico profesional en Colombia.",
  openGraph: {
    siteName: "La Escena",
    locale: "es_CO",
    type: "website",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="es">
      <body>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  )
}
