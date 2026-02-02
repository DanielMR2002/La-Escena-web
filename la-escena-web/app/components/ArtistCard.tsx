import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import styles from '../(public)/agencia/agencia.module.css'
import { motion } from 'framer-motion'



type ArtistCardProps = {
  artist: any
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  const image = artist.photos?.[0]

  return (
  <Link href={`/artistas/${artist.slug.current}`}>
    <motion.article className={styles.artistCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}>
        {image && (
          <div style={{ overflow: 'hidden', borderRadius: '12px' }}>
            <Image
              src={urlFor(image).width(400).height(300).url()}
              alt={artist.name}
              width={400}
              height={300}
              style={{
               width: '100%',
               height: 'auto',
               objectFit: 'cover'
              }}
            />
          </div>
        )}
      <div>
        <h3
          style={{
           fontSize: '1.1rem',
           fontWeight: 500,
           marginBottom: '0.25rem'
          }}
        >
        {artist.name}
        </h3>
        <p
          style={{
           fontSize: '0.9rem',
           color: '#666',
           marginBottom: '0.2rem'
          }}
        >
          {artist.city}
        </p>

        <span
          style={{
           fontSize: '0.75rem',
           textTransform: 'uppercase',
           letterSpacing: '0.08em',
           color: '#999'
          }}
        >
          {artist.category}
        </span>
      </div>
    </motion.article>
  </Link>
)

}
