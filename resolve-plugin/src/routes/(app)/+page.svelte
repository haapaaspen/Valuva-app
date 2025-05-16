<script lang="ts">
	import '../../app.css';
    import AiChatPanel from "$lib/components/AiChatPanel.svelte";
    import Canvas from "$lib/components/Canvas.svelte";
    import EditPanel from "$lib/components/EditPanel.svelte";

	import { resolveApi } from '$lib/resolveApi';
    import { onMount } from 'svelte';
    import Viewport from '$lib/components/Viewport.svelte';

	let isConnected = $state(true);
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


<div class="flex h-screen bg-vaalea">
	<!-- Left -->
	<AiChatPanel />

	<!-- Center -->
	<div class="flex flex-col flex-1">
		<Viewport />
		<Canvas />
	</div>

	<!-- Right -->
	<EditPanel />
</div>