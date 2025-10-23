<script lang="ts">
	import type { Chat } from "@ai-sdk/svelte";
	import { onMount } from "svelte";
	import { replaceState } from "$app/navigation";

	let {
		chatClient,
	}: {
		chatClient: Chat;
	} = $props();

	let mounted = $state(false);
	let textareaRef = $state<HTMLTextAreaElement | null>(null);
	const loading = $derived(
		chatClient.status === "streaming" || chatClient.status === "submitted",
	);

	const adjustHeight = () => {
		if (textareaRef) {
			textareaRef.style.height = "auto";
			textareaRef.style.height = `${textareaRef.scrollHeight + 2}px`;
		}
	};

	const resetHeight = () => {
		if (textareaRef) {
			textareaRef.style.height = "auto";
			textareaRef.style.height = "60px";
		}
	};

	function setInput(value: string) {
		chatClient.input = value;
		adjustHeight();
	}

	async function submitForm(event?: Event) {
		event?.preventDefault();

		if (!chatClient.input.trim() || loading) return;

		await chatClient.handleSubmit(event);
		resetHeight();
		textareaRef?.focus();
	}

	onMount(() => {
		adjustHeight();
		mounted = true;
	});
</script>

<form class="flex w-full gap-2" onsubmit={submitForm}>
	<textarea
		bind:this={textareaRef}
		bind:value={chatClient.input}
		oninput={adjustHeight}
		placeholder="Describe the motion graphics you want to create..."
		class="flex-1 resize-none rounded-lg border border-border p-3 bg-accent text-foreground placeholder:text-foreground/50 focus:outline-none"
		rows="2"
		onkeydown={(event) => {
			if (event.key === "Enter" && !event.shiftKey) {
				event.preventDefault();
				submitForm();
			}
		}}
	></textarea>

	<button
		type="submit"
		disabled={loading || !chatClient.input.trim()}
		class="text-sm border border-primary rounded-md px-4 py-2 hover:border-primary/90 disabled:border-primary/40 disabled:text-foreground/60 disabled:cursor-not-allowed"
	>
		{#if loading}
			<span>⏳</span>
		{:else}
			<span>Send</span>
		{/if}
	</button>
</form>
