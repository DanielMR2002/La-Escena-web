export const dynamic = "force-dynamic"

import { requireArtist } from "@/lib/auth"
import { getInternalPosts, urlFor } from "@/lib/sanity"
import NoticiasList from "@/app/artista/NoticiasList"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Noticias | Portal Artista",
}

export default async function ArtistNoticiesPage() {
  await requireArtist()

  const rawPosts = await getInternalPosts()

  const posts = rawPosts.map((post: any) => ({
    ...post,
    imageUrl: post.mainImage
      ? urlFor(post.mainImage).width(800).height(416).fit("crop").url()
      : null,
  }))

  return (
    <>
      <section className="bg-foreground py-20">
        <div className="container text-center space-y-4">
          <h1 className="font-heading text-5xl sm:text-7xl tracking-wide text-primary-foreground">
            Noticias <span className="text-secondary">Internas</span>
          </h1>
          <p className="text-primary-foreground/60 max-w-lg mx-auto">
            Novedades y comunicados internos de La Escena.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
          <NoticiasList posts={posts} />
        </div>
      </section>
    </>
  )
}
