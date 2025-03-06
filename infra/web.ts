// infra/web.ts

export function web({ auth }: { auth: sst.aws.Auth }) {
    const webInstance = new sst.aws.SvelteKit("Frontend", {
      path: "packages/web",
      domain: {
        name: `${$app.stage}.${process.env.DOMAIN}`,  // vite ignores the $app.stage variable
        dns: sst.aws.dns({
          zone: process.env.ZONE, // Route53 hosted zone ID
        }),
        cert: process.env.CDN_CERT, // when we are in live mode we will use the locally signed certificate
      },
      environment: {
        AUTH_URL: auth.url,
        VITE_AUTH_URL: auth.url,
        VITE_DOMAIN: process.env.DOMAIN || "localhost",
        // VITE_API_URL: api.url, // Injects API_URL into frontend if api it is passed in to the function web({ api})
      },
    });
  
    return {
      web: webInstance,
      frontendUrl: webInstance.url,
    };
  }