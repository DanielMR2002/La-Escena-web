import { ReactNode } from "react"
import AdminSidebar from "./AdminSidebar"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-admin-background">
      <AdminSidebar />
      <main className="flex-1 min-w-0 p-6 lg:p-10 text-admin-foreground">
        {children}
      </main>
    </div>
  )
}
