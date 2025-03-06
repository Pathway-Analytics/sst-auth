<!-- packages/web/src/routes/login/+page.svelte -->
<script lang="ts">
    import { goto } from "$app/navigation";
    const authUrl = import.meta.env.VITE_AUTH_URL;
  
    function loginWith(provider: string) {
      const redirectUri = `${window.location.origin}/callback`;
      const state = Math.random().toString(36).substring(2);
      localStorage.setItem("auth_state", state); // Store state to prevent UnknownStateError
      const url = `${authUrl}/${provider}/authorize?redirect_uri=${encodeURIComponent(
        redirectUri
      )}&state=${state}`;
      console.log(`Redirecting to ${url} for ${provider}`);
      window.location.href = url;
    }
  </script>
  
  <h1>Login</h1>
  <button on:click={() => loginWith("google")}>Login with Google</button>
  <button on:click={() => loginWith("github")}>Login with GitHub</button>
  <button on:click={() => loginWith("code")}>Login with Code</button>