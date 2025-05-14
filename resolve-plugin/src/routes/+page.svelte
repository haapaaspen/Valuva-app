<script lang="ts">
    import AiChatPanel from "$lib/components/AiChatPanel.svelte";
    import Canvas from "$lib/components/Canvas.svelte";
    import EditPanel from "$lib/components/EditPanel.svelte";

	import { resolveApi } from '$lib/resolveApi';
    import { onMount } from 'svelte';

	let isConnected = $state(false);
	onMount(async () => {
		isConnected = await resolveApi.isResolveConnected();
		
		setInterval(async () => {
			try {
				const connected = await Promise.race([
					resolveApi.isResolveConnected(),
					new Promise<boolean>((_, reject) => 
						setTimeout(() => reject(new Error('Connection timeout')), 3000)
					)
				]);
				isConnected = connected;
			} catch (error) {
				console.error('Failed to connect to Resolve:', error);
				isConnected = false;
			}
		}, 5000);
	});

</script>

{#if isConnected}
	<div class="flex h-screen">
		<!-- Left -->
		<div class="w-1/4 bg-gray-100 p-4 overflow-y-auto">
			<AiChatPanel />
		</div>

		<!-- Center -->
		<div class="w-2/4 bg-white">
			<Canvas />
		</div>

		<!-- Right -->
		<div class="w-1/4 bg-gray-100 p-4 overflow-y-auto">
			<EditPanel />
		</div>
	</div>
{:else}
	<div class="flex h-screen">
		<div class="w-full bg-gray-100 p-4 overflow-y-auto">
			<p>Not connected to Resolve</p>
		</div>
	</div>
{/if}