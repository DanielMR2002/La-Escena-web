export const dynamic = "force-dynamic"

import { getClients } from "@/services/user.service"
import { requireAdmin } from "@/lib/auth"

export default async function AdminClientsPage() {

  await requireAdmin()

  const clients = await getClients()

  return (
    <div>
      <h1>Clientes</h1>

      {clients.map((client) => (
        <div key={client.id}>
          <p>{client.email}</p>
        </div>
      ))}
    </div>
  )
}
