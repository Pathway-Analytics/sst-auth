// packages/web/src/routes/login/+server.ts
import { login } from "$lib/auth/actions.server";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent) {
  await login(event);
}