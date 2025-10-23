<script lang="ts">
	import type { UIMessage } from "@ai-sdk/svelte";
	import Markdown from "$lib/components/markdown.svelte";

	let { message, loading }: { message: UIMessage; loading: boolean } =
		$props();

	// Dispatch an event so we don't mutate state during render
	function loadGraphicsToCanvas(data: {
		code: string;
		duration: number;
		title?: string;
		timestamp?: string;
	}) {
		if (typeof window !== "undefined") {
			window.dispatchEvent(
				new CustomEvent("graphicsGenerated", {
					detail: {
						code: data.code,
						duration: data.duration,
						title: data.title,
					},
				}),
			);
		}
	}
</script>

<div
	class="flex gap-4 {message.role === 'user'
		? 'justify-end'
		: 'justify-start'}"
>
	<div class="max-w-[80%] rounded-lg px-4 py-2 bg-accent text-foreground">
		{#if message.parts}
			{#each message.parts as part, i (`${message.id}-${i}`)}
				{#if part.type === "text"}
					<Markdown content={part.text} />
				{:else if part.type === "tool-invocation"}
					{@const toolInvocation = (part as any).toolInvocation}
					{@const { toolName, state } = toolInvocation}

					{#if state === "call"}
						<div class="text-sm opacity-75 mt-2">
							🛠️ Using tool: {toolName}
						</div>
					{:else if state === "result"}
						{@const { result } = toolInvocation}
						<div class="text-sm opacity-75 mt-2">
							✅ {toolName} completed
						</div>

						{#if toolName === "generateCanvasGraphics" && result?.data}
							{#key result.data.timestamp}
								{(setTimeout(
									() => loadGraphicsToCanvas(result.data),
									0,
								),
								"")}
							{/key}
						{/if}
					{/if}
				{/if}
			{/each}
		{/if}
	</div>
</div>
