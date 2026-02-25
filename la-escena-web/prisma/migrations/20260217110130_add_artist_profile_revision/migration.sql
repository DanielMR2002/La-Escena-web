-- CreateTable
CREATE TABLE "ArtistProfileRevision" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "status" "ArtistStatus" NOT NULL DEFAULT 'PENDING',
    "adminComment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "ArtistProfileRevision_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArtistProfileRevision" ADD CONSTRAINT "ArtistProfileRevision_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "ArtistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
