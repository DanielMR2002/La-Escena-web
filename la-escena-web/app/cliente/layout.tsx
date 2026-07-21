import { ReactNode } from "react"
import ClienteHeaderBar from "./ClienteHeaderBar"

export default function ClienteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <ClienteHeaderBar />
      <main className="max-w-6xl mx-auto px-8 py-10">
        {children}
      </main>
    </div>
  )
}
