import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      role: "ADMIN" | "CLIENT" | "ARTIST"
      slug?: string
    }
  }

  interface User {
    role: "ADMIN" | "CLIENT" | "ARTIST"
    slug?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "ADMIN" | "CLIENT" | "ARTIST"
    slug?: string
  }
}
