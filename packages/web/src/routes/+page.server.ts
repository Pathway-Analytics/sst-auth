// packages/web/src/routes/+page.server.ts
export async function load(event) {
    return {
      subject: event.locals.session,
    }
  }