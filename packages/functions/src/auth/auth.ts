import { handle } from "hono/aws-lambda";
import { Hono } from "hono";
import { issuer } from "@openauthjs/openauth/issuer";
import { MemoryStorage } from "@openauthjs/openauth/storage/memory";
import { GoogleProvider } from "@openauthjs/openauth/provider/google";
import { GithubProvider } from "@openauthjs/openauth/provider/github";
import { CodeProvider } from "@openauthjs/openauth/provider/code";
import { CodeUI } from "@openauthjs/openauth/ui/code";
import { Resource } from "sst";
import { DynamoDB } from "aws-sdk";
import { subjects } from "./subjects";

const app = new Hono();
const dynamoDb = new DynamoDB.DocumentClient();
const usersTable = Resource.UsersTable.name;

async function getUser(email: string) {
  // Get user from database and return user ID
  return "123";
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
          console.log(email, code);
        },
      })
    ),
    // ... other providers
  },
  async success(ctx, value: AuthValue) {
    console.log("Success called with value:", JSON.stringify(value, null, 2));

    let user = {
      userId: "",
      email: "",
      name: ""
    };

    if (value.provider === "code") {
      user.userId = await getUser(value.clientID);
    } else if (value.provider === "google") {
      user.userId = await getUser(value.clientID);
      const idToken = value.tokenset.id_token;
      if (!idToken) throw new Error("Missing ID token for Google provider");
      const payload = JSON.parse(Buffer.from(idToken.split(".")[1], "base64").toString());
      user.email = payload.email || "no email";
      user.name = payload.name || "no name";
    } else if (value.provider === "github") {
      // Fetch user details from GitHub API using access token
      const accessToken = value.tokenset.access;
      if (!accessToken) throw new Error("Missing access token for GitHub provider");
      const response = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch GitHub user data");

      const userData = await response.json() as { id: number; email: string | null; name: string; login: string };
      user.userId = userData.id.toString(); // GitHub's unique user ID
      user.email = userData.email || user.userId; // Email might be null if not public
      user.name = userData.name || userData.login; // Fallback to login if name is unavailable
    } else {
      throw new Error(`Unsupported provider: ${value.provider}`);
    }

    return ctx.subject("user", { userId: user.userId });
  }
});

// for debugging we can use auth-stage.yourdomain.com/test to log the routes in CloudWatch logs
app.get("/test", (c) => {
  console.log("Issuer routes:", authApp.routes);
  console.log("App routes:", app.routes);
  return c.text("Auth server is running");
});

app.route("/", authApp);

export const handler = handle(app);