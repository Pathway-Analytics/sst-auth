// packages/web/src/lib/authClient.ts
import { goto } from "$app/navigation";

const CLIENT_ID = "svelte-client"; // Replace if your setup requires a specific client ID

// Initiate login by redirecting to the OpenAuth server's authorize endpoint
export async function login(provider: "google" | "github") {
  const authUrl = `${import.meta.env.VITE_AUTH_URL}/${provider}/authorize?response_type=code&redirect_uri=${window.location.origin}/auth/callback&client_id=${CLIENT_ID}`;
  window.location.href = authUrl;
}

// Handle the callback, process the token, and redirect
export async function handleCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const error = urlParams.get("error");

  if (error) {
    console.error("OAuth error:", error, urlParams.get("error_description"));
    goto("/login");
    return;
  }

  if (token) {
    // Store the token in a cookie (or use localStorage if preferred)
    document.cookie = `auth-token=${token}; path=/; secure; samesite=strict`;
    goto("/"); // Redirect to home or dashboard
  } else {
    console.log("No token received");
    goto("/login");
  }
}

// Optional: Logout function to clear the token
export async function logout() {
  document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  goto("/login");
}