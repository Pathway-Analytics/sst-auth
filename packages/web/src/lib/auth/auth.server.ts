// packages/web/src/lib/auth/auth.server.ts
import { createClient } from "@openauthjs/openauth/client"
import type { RequestEvent } from "@sveltejs/kit"

export function client(event: RequestEvent) {
  return createClient({
    clientID: "sst-auth-example",
    issuer: import.meta.env.VITE_AUTH_URL,
    fetch: event.fetch,
  })
}

export function setTokens(
  event: RequestEvent,
  access: string,
  refresh: string,
) {
  event.cookies.set("refresh_token", refresh, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 34560000,
  })
  event.cookies.set("access_token", access, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 34560000,
  })
}