'use client'

import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export default function ArtistasLayoutWrapper({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const fromPanel = searchParams.get('from') === 'panel'

  if (fromPanel) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <header className="sticky top-0 z-50 bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Volver
          </button>
          <span className="font-heading text-xl text-primary tracking-wide">LA ESCENA</span>
        </header>
        <main>{children}</main>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <main className="pt-20">{children}</main>
      <Footer />
    </>
  )
}
