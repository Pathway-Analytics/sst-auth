// infra/auth.ts
import { usersTable, googleSecrets, githubSecrets } from "./storage";

export const auth = new sst.aws.Auth("AuthServer", {
    issuer: {
      handler: "packages/functions/src/auth/auth.handler",
      runtime: "nodejs20.x",
      link: [usersTable, ...googleSecrets, ...githubSecrets], // Link DynamoDB table and Google secrets
    },
    domain: {
    // edit DOMAIN ZONE in .env to match your domain and zone
      name: `auth-${$app.stage}.${process.env.DOMAIN}`,
      dns: sst.aws.dns({
        zone: process.env.ZONE,
      }),
      cert: process.env.DEFAULT_REGION_CERT, 
    },  
  });