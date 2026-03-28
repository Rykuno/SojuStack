<script lang="ts">
  import DesktopNav from "$lib/components/efferd/header/header-three/desktop-nav.svelte";
  import MobileNav from "$lib/components/efferd/header/header-three/mobile-nav.svelte";
  import { Button } from "$lib/components/ui/button";
  import { createScroll } from "$lib/hooks/use-scroll.svelte";
  import Logo from "$lib/svgs/logo.svelte";
  import { cn } from "$lib/utils";

  let scroll = createScroll(50);
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
      <Button variant="outline">Sign In</Button>
      <Button>Get Started</Button>
    </div>
    <MobileNav />
  </nav>
</header>
