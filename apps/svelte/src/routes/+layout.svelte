<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import { QueryClientProvider } from "@tanstack/svelte-query";
  // import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";

  const { data, children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<QueryClientProvider client={data.queryClient}>
  <main>
    {@render children()}
  </main>
  <!-- <SvelteQueryDevtools /> -->
</QueryClientProvider>
