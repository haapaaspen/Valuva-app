<script lang="ts">
    import AiChatPanel from "$lib/components/AiChatPanel.svelte";
    import Canvas from "$lib/components/Canvas.svelte";
    import EditPanel from "$lib/components/EditPanel.svelte";

</script>


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
