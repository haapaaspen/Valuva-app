<script lang="ts">
	import Chat from '$lib/components/chat.svelte';

	import AiChatPanel from "$lib/myComponents/AiChatPanel.svelte";
    import Canvas from "$lib/myComponents/Canvas.svelte";
    import EditPanel from "$lib/myComponents/EditPanel.svelte";
	import { resolveApi } from '$lib/resolveApi';
    import { onMount } from 'svelte';

	let { data } = $props();
</script>


<div class="flex h-screen bg-vaalea">
	<!-- Left -->
	<Chat chat={undefined} initialMessages={[]} readonly={false} user={data.user} />

	<!-- Center -->
	<div class="flex flex-col flex-1">
		<Canvas />
	</div>

	<!-- Right -->
	<EditPanel />
</div>
<!-- TODO <DataStreamHandler {id} /> -->
