/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "sst-auth",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      region: process.env.DEFAULT_REGION,
    };
  },
  async run() {
    const { 
      usersTable, 
      googleSecrets, 
      githubSecrets 
    }                           = await import("./infra/storage");
    const { auth }              = await import("./infra/auth");
    const { 
      web: webInstance, 
      frontendUrl 
    }                           = await import("./infra/web").then((module) => module.web({ auth }));
  },
});
