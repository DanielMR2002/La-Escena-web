export const dynamic = "force-dynamic"

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 60)    return 'hace unos segundos'
  if (diff < 3600)  return `hace ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`
  return `hace ${Math.floor(diff / 86400)} días`
}

export default async function HistorialPage() {
  await requireAdmin()

  const [revisions, shortlists] = await Promise.all([
    prisma.artistProfileRevision.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: { artist: { include: { user: true } } },
    }),
    prisma.clientShortlist.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: { client: true },
    }),
  ])

  type Event = { type: 'revision' | 'shortlist'; text: string; sub: string; date: Date; href: string; status: string }

  const events: Event[] = [
    ...revisions.map(r => ({
      type: 'revision' as const,
      text: r.artist.user.name ?? r.artist.user.email,
      sub: r.status === 'PENDING' ? 'Envió una revisión de perfil' : r.status === 'APPROVED' ? 'Revisión aprobada' : 'Revisión rechazada',
      date: r.createdAt,
      href: `/admin/artists/${r.artistId}`,
      status: r.status,
    })),
    ...shortlists.map(s => ({
      type: 'shortlist' as const,
      text: s.client.name ?? s.client.email,
      sub: s.status === 'PENDING' ? 'Creó una nueva shortlist' : s.status === 'APPROVED' ? 'Shortlist aprobada' : 'Shortlist rechazada',
      date: s.createdAt,
      href: `/admin/clients`,
      status: s.status,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime())

  const statusColor: Record<string, string> = {
    PENDING:  'bg-amber-400/15 text-amber-400',
    APPROVED: 'bg-emerald-400/15 text-emerald-400',
    REJECTED: 'bg-red-400/15 text-red-400',
  }
  const statusLabel: Record<string, string> = {
    PENDING: 'Pendiente', APPROVED: 'Aprobado', REJECTED: 'Rechazado',
  }
  const dotColor: Record<string, string> = {
    revision:  'bg-primary',
    shortlist: 'bg-secondary',
  }

  return (
    <div>
      <Link href="/admin" className="inline-flex items-center gap-2 text-xs text-admin-muted hover:text-admin-foreground mb-8 transition-colors">
        <ArrowLeft size={14} /> Volver al dashboard
      </Link>
      <h1 className="font-heading text-4xl tracking-wide text-admin-foreground mb-2">Historial de actividad</h1>
      <p className="text-xs text-admin-muted mb-8">Los registros se eliminan automáticamente después de 30 días.</p>

      {events.length === 0 ? (
        <p className="text-sm text-admin-muted py-12 text-center">No hay actividad registrada.</p>
      ) : (
        <div className="bg-admin-elevated border border-admin-border rounded-xl divide-y divide-admin-border">
          {events.map((e, i) => (
            <Link key={i} href={e.href} className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors">
              <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor[e.type]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-admin-foreground truncate">{e.text}</p>
                <p className="text-xs text-admin-muted">{e.sub}</p>
              </div>
              <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColor[e.status]}`}>
                {statusLabel[e.status]}
              </span>
              <span className="shrink-0 text-xs text-admin-muted">{timeAgo(e.date)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
