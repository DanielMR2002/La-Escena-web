'use client'

import { motion } from 'framer-motion'

export default function ArtistPageClient({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <motion.article
      style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.article>
  )
}
