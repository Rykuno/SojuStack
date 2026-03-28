<script lang="ts" module>
  export const formSchema = z.object({
    title: z.string().min(2).max(50),
    description: z.string().max(2000).optional().default("")
  });
</script>

<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { z } from "zod/v4";
  import { superForm, defaults } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { Button } from "$lib";
  import { createMutation, createQuery } from "@tanstack/svelte-query";
  import { api } from "$lib/integrations/api";

  const form = superForm(defaults(zod4(formSchema)), {
    SPA: true,
    validators: zod4(formSchema)
  });
  const { form: formData, validateForm } = form;

  const todosQuery = createQuery(() => api().todos.findMany());
  const createTodoMutation = createMutation(() => {
    return {
      ...api().todos.create(),
      onSuccess: () => {
        void todosQuery.refetch();
      }
    };
  });

  async function handleSubmit() {
    const result = await validateForm();
    console.log("result", result);
    if (!result.valid) return form.errors.set(result.errors);
    createTodoMutation.mutate({
      ...result.data,
      completed: false
    });
  }
</script>

<div class="max-w-md mx-auto mt-24">
  <Form.Field {form} name="title">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Title</Form.Label>
        <Input {...props} bind:value={$formData.title} />
      {/snippet}
    </Form.Control>
    <Form.Description />
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="description">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Description</Form.Label>
        <Input {...props} bind:value={$formData.description} />
      {/snippet}
    </Form.Control>
    <Form.Description />
    <Form.FieldErrors />
  </Form.Field>
  <Button
    onclick={() => {
      handleSubmit();
    }}>Submit</Button
  >
</div>

<div class="mt-8 max-w-md mx-auto space-y-4">
  {#each todosQuery.data ?? [] as todo}
    <div class="border border-gray-200 rounded-md p-4">
      <h2>{todo.title}</h2>
      <p>{todo.description}</p>
    </div>
  {/each}
</div>
