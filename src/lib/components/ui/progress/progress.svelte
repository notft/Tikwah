<script lang="ts">
	import { Progress as ProgressPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type $$Props = ProgressPrimitive.Props;

	let className: $$Props["class"] = undefined;
	export let max: $$Props["max"] = 100;
	export let value: $$Props["value"] = undefined;
	export { className as class };
</script>

<ProgressPrimitive.Root
	class={cn("bg-[#D1CDE9] relative h-4 w-full overflow-hidden", className)}
	{...$$restProps}
>
	<div
		class={`bg-[#ACA7C7] h-full w-full flex-1 transition-all`}
		style={`transform: translateX(-${100 - (100 * (value ?? 0)) / (max ?? 1)}%)`}
	></div>
</ProgressPrimitive.Root>
