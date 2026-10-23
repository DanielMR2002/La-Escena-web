import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function POST() {
  await requireAdmin()
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 30)

  const [revisions, shortlists] = await Promise.all([
    prisma.artistProfileRevision.deleteMany({
      where: { createdAt: { lt: cutoff } },
    }),
    prisma.clientShortlist.deleteMany({
      where: { createdAt: { lt: cutoff } },
    }),
  ])

  return NextResponse.json({ deleted: { revisions: revisions.count, shortlists: shortlists.count } })
}
