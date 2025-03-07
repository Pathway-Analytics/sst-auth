// infra/auth.ts
import { usersTable, googleSecrets, githubSecrets } from "./storage";
import { email } from "./email";

const region = process.env.DEFAULT_REGION || "us-east-1" ;
const domain = process.env.DOMAIN || "example.com" // Change this to your domain
const zone = process.env.ZONE
const cert = process.env.CDN_CERT

export const auth = new sst.aws.Auth("AuthServer", {
    issuer: {
      handler: "packages/functions/src/auth/auth.handler",
      runtime: "nodejs20.x",
      environment: {
        REGION: region ,
        DOMAIN: domain,
      },
      link: [ email, usersTable, ...googleSecrets, ...githubSecrets], // Link DynamoDB table and Google secrets
    },
    domain: {
    // edit DOMAIN ZONE in .env to match your domain and zone
      name: `auth-${$app.stage}.${process.env.DOMAIN}`,
      dns: sst.aws.dns({
        zone: zone,
      }),
      cert: cert, 
    },  
  });