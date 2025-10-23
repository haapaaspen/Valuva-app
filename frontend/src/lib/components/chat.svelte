<script lang="ts">
	import { Chat } from "@ai-sdk/svelte";
	import { toast } from "svelte-sonner";
	import Messages from "./messages.svelte";
	import MultimodalInput from "./multimodal-input.svelte";
	import { untrack } from "svelte";
	import type { UIMessage } from "@ai-sdk/svelte";

	let {
		initialMessages,
	}: {
		initialMessages: UIMessage[];
	} = $props();

	const chatClient = $derived(
		new Chat({
			id: crypto.randomUUID(),
			initialMessages: untrack(() => initialMessages),
			sendExtraMessageFields: true,
			generateId: crypto.randomUUID.bind(crypto),
			onError: (error: Error) => {
				console.error(error);
				toast.error(error.message || "Something went wrong");
			},
		}),
	);
</script>

<div class="flex h-full min-w-0 flex-col">
	<Messages
		loading={chatClient.status === "streaming" ||
			chatClient.status === "submitted"}
		messages={chatClient.messages}
	/>

	<div class="p-6">
		<MultimodalInput {chatClient} />
	</div>
</div>
