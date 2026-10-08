'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'

type Props = {
  title: string
  description: string
  hotmartUrl: string
  buttonLabel: string
  image: string
}

export default function CourseCard({ title, description, hotmartUrl, buttonLabel, image }: Props) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden flex flex-col hover:border-accent/50 transition-colors">
      <div className="relative aspect-video bg-zinc-800">
        {!imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">
            Imagen próximamente
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-heading text-xl tracking-wide mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{description}</p>
        <a
          href={hotmartUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-colors"
        >
          {buttonLabel} <ExternalLink size={16} />
        </a>
      </div>
    </div>
  )
}
