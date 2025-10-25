<script lang="ts">
	import { onMount } from "svelte";
	import PreviewMessage from "./preview-message.svelte";
	import type { UIMessage } from "@ai-sdk/svelte";

	let containerRef = $state<HTMLDivElement | null>(null);
	let endRef = $state<HTMLDivElement | null>(null);

	let {
		loading,
		messages,
	}: {
		loading: boolean;
		messages: UIMessage[];
	} = $props();

	$effect(() => {
		if (!(containerRef && endRef)) return;

		const observer = new MutationObserver(() => {
			if (!endRef) return;
			endRef.scrollIntoView({ behavior: "instant", block: "end" });
		});

		observer.observe(containerRef, {
			childList: true,
			subtree: true,
			attributes: true,
			characterData: true,
		});

		return () => observer.disconnect();
	});
</script>

<div
	bind:this={containerRef}
	class="flex min-w-0 flex-1 flex-col gap-6 overflow-y-scroll pt-4 px-4 no-scrollbar"
>
	{#if messages.length === 0}
		<div class="text-center text-foreground/60 py-8">
			<h2 class="text-2xl font-bold mb-2">Hello there!</h2>
			<p>Start a conversation about motion graphics</p>
		</div>
	{/if}

	{#each messages as message (message.id)}
		<PreviewMessage {message} {loading} />
	{/each}

	{#if loading && messages.length > 0 && messages[messages.length - 1].role === "user"}
		<div class="text-foreground/60 italic">Thinking...</div>
	{/if}

	<div bind:this={endRef} class="min-h-[24px] min-w-[24px] shrink-0"></div>
</div>

<style>
	/* Hide scrollbar, allow scroll */
	.no-scrollbar {
		overflow: auto; /* or overflow-y: auto */
		-ms-overflow-style: none; /* IE/Edge */
		scrollbar-width: none; /* Firefox */
		-webkit-overflow-scrolling: touch; /* smooth on iOS */
	}
	.no-scrollbar::-webkit-scrollbar {
		display: none; /* Chrome/Safari */
	}
</style>
