<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import {
    FieldGroup,
    Field,
    FieldLabel
  } from "$lib/components/ui/field/index.js";
  import { api } from "$lib/integrations/api";
  import { createMutation, useQueryClient } from "@tanstack/svelte-query";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";

  const queryClient = useQueryClient();
  const id = $props.id();

  let email = $state<string | null>(null);
  let otp = $state<string | null>(null);
  let showOtp = $state(false);

  const sendSignInOtpMutation = createMutation(() => {
    return {
      ...api().auth.sendSignInOtp(),
      onSuccess: async () => {
        showOtp = true;
      }
    };
  });

  const verifySignInOtpMutation = createMutation(() => {
    return {
      ...api().auth.verifySignInOtp(),
      onSuccess: async () => {
        await queryClient.invalidateQueries();
        void goto(resolve("/todos"), { replaceState: false });
      }
    };
  });
</script>

<Card.Root class="mx-auto w-full max-w-sm">
  <Card.Header>
    <Card.Title class="text-2xl">Login</Card.Title>
    <Card.Description
      >Enter your email below to login to your account</Card.Description
    >
  </Card.Header>
  <Card.Content>
    {#if !showOtp}
      <FieldGroup>
        <Field>
          <FieldLabel for="email-{id}">Email</FieldLabel>
          <Input
            id="email-{id}"
            type="email"
            placeholder="m@example.com"
            required
            bind:value={email}
          />
        </Field>
        <Field>
          <Button
            type="submit"
            class="w-full"
            onclick={() => sendSignInOtpMutation.mutate(email)}>Login</Button
          >
        </Field>
      </FieldGroup>
    {/if}
    {#if showOtp}
      <FieldGroup>
        <Field>
          <FieldLabel for="otp-{id}">OTP</FieldLabel>
          <Input
            id="otp-{id}"
            type="text"
            placeholder="123456"
            required
            bind:value={otp}
          />
        </Field>
        <Field>
          <Button
            type="submit"
            class="w-full"
            onclick={() => verifySignInOtpMutation.mutate({ email, otp })}
            >Verify</Button
          >
        </Field>
      </FieldGroup>
    {/if}
  </Card.Content>
</Card.Root>
