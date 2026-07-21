'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ArtistPageClient({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <motion.article
      style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Volver
      </button>
      {children}
    </motion.article>
  )
}
