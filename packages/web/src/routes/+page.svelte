<!-- packages/web/src/routes/+page.svelte -->
<script lang="ts">
    const token = localStorage.getItem("auth_token");
  </script>
  
  <h1>Welcome</h1>
  {#if token}
    <p>Logged in! Token: {token}</p>
    <button on:click={() => { localStorage.removeItem("auth_token"); location.reload(); }}>Logout</button>
  {:else}
    <a href="/login">Login</a>
  {/if}