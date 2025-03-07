// packages/web/src/routes/callback/+server.ts
import { redirect } from "@sveltejs/kit"
import { client as createAuthClient, setTokens } from "$lib/auth/auth.server"

export async function GET(event) {
  console.log("issuer: ", import.meta.env.VITE_AUTH_URL)

  const code = event.url.searchParams.get("code")
  const authClient = createAuthClient(event)
  const tokens = await authClient.exchange(
    code!,
    event.url.origin + "/callback",
  )
  if (!tokens.err) {
    setTokens(event, tokens.tokens.access, tokens.tokens.refresh)
  } else {
    throw tokens.err
  }
  return redirect(302, `/`)
}