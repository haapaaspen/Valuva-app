<script lang="ts">
	import type { UIMessage } from "@ai-sdk/svelte";
	import Markdown from "$lib/components/markdown.svelte";
	import { processMessageParts } from "$lib/domains/chat/message-parser";

	let { message, loading }: { message: UIMessage; loading: boolean } =
		$props();

	const processedParts = $derived(processMessageParts(message));
</script>

<div
	class="flex gap-4 {message.role === 'user'
		? 'justify-end'
		: 'justify-start'}"
>
	<div class="max-w-[80%] rounded-lg px-4 py-2 bg-accent text-foreground">
		{#each processedParts as part (part.key)}
			{#if part.type === "text"}
				<Markdown content={part.content} />
			{:else if part.type === "tool"}
				<div class="text-sm opacity-75 mt-2">
					{part.icon}
					{part.displayText}
				</div>
			{/if}
		{/each}
	</div>
</div>
