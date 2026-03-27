<script lang="ts">
  import { api } from "$lib/integrations/api";
  import { createMutation, createQuery } from "@tanstack/svelte-query";

  // props
  const { data } = $props();

  // state
  let title = $state("");

  // queries
  const sessionQuery = createQuery(() => api().auth.session());
  const todosQuery = createQuery(() => api().todos.findMany());
  const createTodoMutation = createMutation(() => ({
    ...api().todos.create(),
    onSuccess: async () => {
      await data.queryClient.invalidateQueries();
    }
  }));

  $effect(() => {
    console.log(sessionQuery.data);
  });
</script>

<div>
  {#if sessionQuery.data}
    <p>Logged in as {sessionQuery.data.user.email}</p>
  {:else}
    <p>Logged out</p>
  {/if}
</div>

<input type="text" name="title" bind:value={title} />
<button
  type="submit"
  onclick={() =>
    createTodoMutation.mutate({ title, completed: false, description: "" })}
  >Create</button
>

<ul>
  {#each todosQuery.data ?? [] as todo (todo.id)}
    <h1>{todo.title}</h1>
  {/each}
</ul>
