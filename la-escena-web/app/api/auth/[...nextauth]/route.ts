import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma"


const handler = NextAuth({
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt"
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
        return null
        }

        const email = credentials.email as string
        const password = credentials.password as string


        const user = await prisma.user.findUnique({
          where: { email }
        })

        if (!user.password) return null

        const isValid = await bcrypt.compare(
          password,
          user.password
        )


        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          role: user.role
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role as "ADMIN" | "CLIENT"
      }
      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as "ADMIN" | "CLIENT"
      }
      return session
    }

  },

  secret: process.env.NEXTAUTH_SECRET!

})

export { handler as GET, handler as POST }
