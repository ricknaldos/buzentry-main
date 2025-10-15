import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"
import type { NextAuthConfig } from "next-auth"
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter"
import { kv } from "@vercel/kv"

export const authConfig = {
  adapter: UpstashRedisAdapter(kv),
  secret: process.env.AUTH_SECRET,
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: "BuzEntry <noreply@support.buzentry.com>",
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/verify",
    error: "/login",
    newUser: "/dashboard", // Redirect new users to dashboard after first sign in
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')

      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      }

      return true
    },
    async redirect({ url, baseUrl }) {
      // Handle callbackUrl from magic link
      // If url contains callbackUrl query param, use it
      if (url.includes('callbackUrl=')) {
        const urlObj = new URL(url, baseUrl);
        const callbackUrl = urlObj.searchParams.get('callbackUrl');
        if (callbackUrl) {
          // Ensure callback URL is relative or same origin
          if (callbackUrl.startsWith('/')) return `${baseUrl}${callbackUrl}`;
          if (callbackUrl.startsWith(baseUrl)) return callbackUrl;
        }
      }
      // If url is relative, use it
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // If url is same origin, use it
      if (url.startsWith(baseUrl)) return url;
      // Default to dashboard for successful sign ins
      return `${baseUrl}/dashboard`;
    },
    async session({ session, user }) {
      // For database session strategy, we use the user object from the adapter
      if (user && session.user) {
        session.user.id = user.id
      }
      return session
    },
    async signIn({ user }) {
      // When user signs in (via magic link or auto-login), check if app profile exists
      // If not, wait for it to be created by Stripe webhook or create a temporary one
      if (user.email) {
        const { getUserByEmail } = await import('@/lib/user-db');
        const appProfile = await getUserByEmail(user.email);

        // If no app profile exists, user probably came through direct login without payment
        // Let them through - dashboard will show appropriate message
        console.log(`Sign in: ${user.email}, has app profile: ${!!appProfile}`);
      }
      return true;
    },
  },
  session: {
    strategy: "database",
    maxAge: 365 * 24 * 60 * 60, // 1 year in seconds
  },
  trustHost: true,
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
