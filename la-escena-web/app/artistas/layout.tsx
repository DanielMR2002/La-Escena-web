import { Suspense } from 'react'
import ArtistasLayoutWrapper from './ArtistasLayoutWrapper'

export default function ArtistasLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <ArtistasLayoutWrapper>{children}</ArtistasLayoutWrapper>
    </Suspense>
  )
}
