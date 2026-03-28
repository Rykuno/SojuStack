<script lang="ts">
  import DesktopNav from "$lib/components/efferd/header/header-three/desktop-nav.svelte";
  import MobileNav from "$lib/components/efferd/header/header-three/mobile-nav.svelte";
  import * as Avatar from "$lib/components/ui/avatar";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Button } from "$lib/components/ui/button";
  import { createScroll } from "$lib/hooks/use-scroll.svelte";
  import { api } from "$lib/integrations/api";
  import Logo from "$lib/svgs/logo.svelte";
  import { cn } from "$lib/utils";
  import { createQuery } from "@tanstack/svelte-query";

  let scroll = createScroll(50);
  const { children } = $props();
  const session = createQuery(() => api().auth.session());
  const user = $derived(session.data?.user);
</script>

<header
  class={cn(
    "sticky top-0 z-50 w-full border-b border-transparent",
    scroll.scrolled &&
      "border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50"
  )}
>
  <nav
    class="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4"
  >
    <div class="flex items-center gap-5">
      <a
        class="rounded-lg px-3 py-2.5 hover:bg-muted dark:hover:bg-muted/50"
        href="/"
      >
        <Logo class="h-4" />
      </a>
      <DesktopNav />
    </div>
    <div class="hidden items-center gap-2 md:flex">
      {#if user}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            {#snippet child({ props })}
              <Avatar.Root {...props}>
                <Avatar.Image src={user?.image} alt={user?.name} />
                <Avatar.Fallback>RI</Avatar.Fallback>
              </Avatar.Root>
            {/snippet}
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Sign Out</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      {:else}
        <Button variant="outline">Sign In</Button>
      {/if}
    </div>
    <MobileNav />
  </nav>
</header>

<main>
  {@render children()}
</main>
