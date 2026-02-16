export async function POST(req: Request) {
  const { clientId, artistId } = await req.json()

  await prisma.clientArtistAccess.create({
    data: {
      clientId,
      artistId
    }
  })

  return NextResponse.json({ success: true })
}
