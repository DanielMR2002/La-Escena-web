export const dynamic = "force-dynamic"

export default async function AdminClientsPage() {

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/admin/clients/list`,
    { cache: "no-store" }
  )

  const clients = await res.json()

  return (
    <div>
      <h1>Clientes</h1>
      {clients.map((client: any) => (
        <p key={client.id}>{client.email}</p>
      ))}
    </div>
  )
}
