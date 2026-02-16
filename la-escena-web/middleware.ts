import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // ADMIN puede entrar a todo
    if (token?.role === "ADMIN") {
      return NextResponse.next()
    }

    // CLIENT solo puede entrar a su propio slug
    if (pathname.startsWith("/cliente/")) {
      const slugFromUrl = pathname.split("/")[2]

      if (token?.slug !== slugFromUrl) {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: [
    "/admin/:path*",
    "/cliente/:path*",
    "/artista/:path*"
  ]
}
