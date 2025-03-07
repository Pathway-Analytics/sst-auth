<!-- packages/web/src/routes/+page.svelte -->
<script lang="ts">
  const { data } = $props();
</script>

<h1>Welcome</h1>
{#if data}
  <p>Logged in! Token: {data.subject.id}</p>
  <a href="/logout">Logout</a>
{:else}
  <a href="/login">Login</a>
{/if}