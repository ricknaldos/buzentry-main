import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  // DEV MODE: Skip auth check if dev session cookie is present
  if (process.env.DEV_MODE === 'true') {
    const devCookie = req.cookies.get('authjs.session-token')
    if (devCookie) {
      return NextResponse.next()
    }
  }

  const isLoggedIn = !!req.auth

  // Protected routes - dashboard and all related pages
  const protectedRoutes = ['/dashboard', '/overview', '/settings', '/billing', '/guest-access', '/onboarding', '/manage']
  const isOnProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))

  if (isOnProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
