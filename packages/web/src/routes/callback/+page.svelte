<!-- packages/web/src/routes/callback/+page.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");
    const state = params.get("state");
    const storedState = localStorage.getItem("auth_state");

    console.log("Callback params:", { token, error, state, storedState });

    if (!storedState || state !== storedState) {
      console.error("State mismatch:", state, storedState);
      goto("/login");
      return;
    }

    if (error) {
      console.error("Auth error:", error);
      goto("/login");
      return;
    }

    if (token) {
      console.log("Token received:", token);
      localStorage.setItem("auth_token", token);
      localStorage.removeItem("auth_state");
      goto("/");
    } else {
      console.log("No token received");
      goto("/login");
    }
  });
</script>

<h1>Authenticating...</h1>