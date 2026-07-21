export const dynamic = "force-dynamic"

import Link from "next/link"
import { requireAdmin } from "@/lib/auth"
import { getClients } from "@/services/user.service"
import ClientsListClient, { type ClientListItem } from "./ClientsListClient"

export default async function AdminClientsPage() {
  await requireAdmin()
  const clients = await getClients()

  const items: ClientListItem[] = clients.map(c => ({
    id:           c.id,
    name:         c.name,
    email:        c.email,
    createdAt:    c.createdAt.toISOString(),
    artistCount:  c.clientAccess.length,
    pendingShortlist: c.clientShortlists[0]
      ? {
          id:          c.clientShortlists[0].id,
          artistNames: c.clientShortlists[0].artistNames as string[],
          createdAt:   c.clientShortlists[0].createdAt.toISOString(),
        }
      : null,
  }))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-4xl">Clientes</h1>
        <Link href="/admin/clients/create">
          <button className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-red-700 transition-colors">
            + Crear Cliente
          </button>
        </Link>
      </div>
      <ClientsListClient clients={items} />
    </div>
  )
}
