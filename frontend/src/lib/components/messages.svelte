<script lang="ts">
	import PreviewMessage from "./preview-message.svelte";
	import type { UIMessage } from "@ai-sdk/svelte";

	let {
		loading,
		messages,
	}: {
		loading: boolean;
		messages: UIMessage[];
	} = $props();

	/**
	 * Svelte Action to auto-scroll to bottom when content changes
	 */
	function autoScroll(node: HTMLDivElement) {
		const endMarker = node.querySelector(".scroll-marker") as HTMLElement;
		if (!endMarker) return;

		const observer = new MutationObserver(() => {
			endMarker.scrollIntoView({ behavior: "instant", block: "end" });
		});

		observer.observe(node, {
			childList: true,
			subtree: true,
			attributes: true,
			characterData: true,
		});

		return {
			destroy() {
				observer.disconnect();
			},
		};
	}
</script>

<div
	use:autoScroll
	class="flex min-w-0 flex-1 flex-col gap-6 overflow-y-scroll pt-4 px-4 no-scrollbar"
>
	{#if messages.length === 0}
		<div class="text-center text-foreground/60 py-8">
			<h2 class="text-2xl font-bold mb-2">Hello there!</h2>
			<p>What do you want to create?</p>
		</div>
	{/if}

	{#each messages as message (message.id)}
		<PreviewMessage {message} {loading} />
	{/each}

	{#if loading && messages.length > 0 && messages[messages.length - 1].role === "user"}
		<div class="text-foreground/60 italic">Thinking...</div>
	{/if}

	<div class="scroll-marker min-h-[24px] min-w-[24px] shrink-0"></div>
</div>

<style>
	.no-scrollbar {
		overflow: auto;
		-ms-overflow-style: none;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
	}
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
</style>
