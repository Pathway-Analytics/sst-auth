// packages/web/src/hooks.server.ts
import { redirect, type Handle } from "@sveltejs/kit"
import { client as createAuthClient, setTokens } from "$lib/auth/auth.server"
import { subjects } from "../../functions/src/auth/subjects"

export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname === "/callback") {
    return resolve(event)
  }

  const client = createAuthClient(event)
  try {
    const accessToken = event.cookies.get("access_token")
    if (accessToken) {
      const refreshToken = event.cookies.get("refresh_token")
      const verified = await client.verify(subjects, accessToken, {
        refresh: refreshToken,
      })
      if (!verified.err) {
        if (verified.tokens)
          setTokens(event, verified.tokens.access, verified.tokens.refresh)
        event.locals.session = verified.subject.properties
        return resolve(event)
      }
    }
  } catch (e) {}

  const { url } = await client.authorize(event.url.origin + "/callback", "code")
  return redirect(302, url)
}