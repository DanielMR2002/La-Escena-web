import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter } from 'next/font/google'



const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: {
    default: 'La Escena | Agencia de artistas y creadores',
    template: '%s | La Escena'
  },
  description:
    'La Escena es una agencia de artistas, bailarines y creadores de contenido en Colombia.',
  metadataBase: new URL('https://la-escena-web-dusky.vercel.app'),
  openGraph: {
    siteName: 'La Escena',
    locale: 'es_CO',
    type: 'website'
  },
  robots: {
    index: true,
    follow: true
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
