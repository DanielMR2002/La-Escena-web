import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export class AuthError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions)

  if (!session) throw new AuthError("No autenticado", 401)
  if (session.user.role !== "ADMIN") throw new AuthError("No autorizado", 403)

  return session
}

export async function requireArtist() {
  const session = await getServerSession(authOptions)

  if (!session) throw new AuthError("No autenticado", 401)
  if (session.user.role !== "ARTIST") throw new AuthError("No autorizado", 403)

  return session
}

export async function requireClient() {
  const session = await getServerSession(authOptions)

  if (!session) throw new AuthError("No autenticado", 401)
  if (session.user.role !== "CLIENT") throw new AuthError("No autorizado", 403)

  return session
}

export async function requireArtistOrAdmin() {
  const session = await getServerSession(authOptions)

  if (!session) throw new AuthError("No autenticado", 401)
  if (session.user.role !== "ARTIST" && session.user.role !== "ADMIN") {
    throw new AuthError("No autorizado", 403)
  }

  return session
}
