<script lang="ts">
	import type { UIMessage } from "@ai-sdk/svelte";

	let { message, loading }: { message: UIMessage; loading: boolean } =
		$props();

	// Dispatch graphics generation events when tool calls are detected
	$effect(() => {
		if (message.role === "assistant" && message.toolInvocations) {
			message.toolInvocations.forEach((tool) => {
				if (
					tool.toolName === "generateCanvasGraphics" &&
					tool.state === "result"
				) {
					const { code, duration, title } = (tool as any).result.data;
					window.dispatchEvent(
						new CustomEvent("graphicsGenerated", {
							detail: { code, duration, title },
						}),
					);
				}
			});
		}
	});
</script>

<div
	class="flex gap-4 {message.role === 'user'
		? 'justify-end'
		: 'justify-start'}"
>
	<div class="max-w-[80%] rounded-lg px-4 py-2 bg-accent text-foreground">
		{#if message.parts}
			{#each message.parts as part}
				{#if part.type === "text"}
					<div class="whitespace-pre-wrap">{part.text}</div>
				{/if}
			{/each}
		{/if}

		{#if message.toolInvocations}
			{#each message.toolInvocations as tool}
				{#if tool.state === "call"}
					<div class="text-sm opacity-75 mt-2">
						🛠️ Using tool: {tool.toolName}
					</div>
				{:else if tool.state === "result"}
					<div class="text-sm opacity-75 mt-2">
						✅ {tool.toolName} completed
					</div>
				{/if}
			{/each}
		{/if}
	</div>
</div>
