// packages/web/src/routes/logout/+server.ts
import { redirect } from "@sveltejs/kit";
import { logout } from "$lib/auth/actions.server";

export async function GET(event) {
  logout(event);
  return redirect(302, `/login`);
}
