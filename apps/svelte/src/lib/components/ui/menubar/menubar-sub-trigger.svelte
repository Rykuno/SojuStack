<script lang="ts">
	import { Menubar as MenubarPrimitive } from "bits-ui";
	import { cn, type WithoutChild } from "$lib/utils.js";
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';

	let {
		ref = $bindable(null),
		class: className,
		inset = undefined,
		children,
		...restProps
	}: WithoutChild<MenubarPrimitive.SubTriggerProps> & {
		inset?: boolean;
	} = $props();
</script>

<MenubarPrimitive.SubTrigger
	bind:ref
	data-slot="menubar-sub-trigger"
	data-inset={inset}
	class={cn(
		"focus:bg-accent focus:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground gap-2 rounded-xl px-3 py-2 text-sm data-inset:pl-9.5 [&_svg:not([class*='size-'])]:size-4 flex cursor-default items-center outline-none select-none",
		className
	)}
	{...restProps}
>
	{@render children?.()}
	<ChevronRightIcon class="cn-rtl-flip ml-auto size-4" />
</MenubarPrimitive.SubTrigger>
