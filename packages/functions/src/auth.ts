// packages/functions/src/auth.ts
import { handle } from "hono/aws-lambda";
import { issuer } from "@openauthjs/openauth/issuer";
import { MemoryStorage } from "@openauthjs/openauth/storage/memory";
import { GoogleProvider } from "@openauthjs/openauth/provider/google"
import { GithubProvider } from "@openauthjs/openauth/provider/github";
import { CodeProvider } from "@openauthjs/openauth/provider/code";
import { CodeUI } from "@openauthjs/openauth/ui/code";
import { Resource } from "sst";
import { DynamoDB } from "aws-sdk";
import { subjects } from "./subjects";

const dynamoDb = new DynamoDB.DocumentClient();
const usersTable = Resource.Users.tableName;

async function getUser(email: string) {
  // Get user from database and return user ID
  return "123"
}

interface TokenSet {
    access: string;
    refresh?: string;
    id_token?: string;
    expiry?: number;
    raw: {
        id_token?: string;
    };
}

    interface AuthValue {
    provider: "google" | "github" | "code";
    tokenset: TokenSet;
    clientID: string;
}

const authApp = issuer({
    subjects,
    storage: MemoryStorage(),
    providers: {
        google: GoogleProvider({
            clientID: Resource.GoogleClientID.value,
            clientSecret: Resource.GoogleClientSecret.value,
            scopes: ["openid", "email", "profile"],
        }),
        github: GithubProvider({
            clientID: Resource.GithubClientID.value,
            clientSecret: Resource.GithubClientSecret.value,
            scopes: ["read:user", "user:email"],
        }),
        code: CodeProvider(
            CodeUI({
              sendCode: async (email, code) => {
                console.log(email, code)
              },
            }),
          ),
        // ... other providers
    },
  async success(ctx, value: AuthValue) {
    console.log("Success called with value:", JSON.stringify(value, null, 2));

    if (value.provider === "code") {
      return ctx.subject("user", {
        userId: await getUser(value.clientID),
      })
    } else if (value.provider === "google") {
      return ctx.subject("user", {
        userId: await getUser(value.clientID),
      })
    } else if (value.provider === "github") {
      return ctx.subject("user", {
        userId: await getUser(value.clientID),
      })
    } else {
      throw new Error(`Unsupported provider: ${value.provider}`);
    }

  }
});