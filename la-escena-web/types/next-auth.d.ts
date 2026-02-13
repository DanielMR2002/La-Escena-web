import NextAuth from "next-auth"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      role: "ADMIN" | "CLIENT"
    } & DefaultSession["user"]
  }

  interface User {
    role: "ADMIN" | "CLIENT"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "ADMIN" | "CLIENT"
  }
}
