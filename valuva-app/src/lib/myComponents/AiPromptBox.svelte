<script lang="ts">
    let prompt = $state('');
</script>

<div class="rounded-lg">
    <textarea class="w-full h-full bg-ruoste-vaalein text-eggplant-darkish p-2 rounded-lg resize-none focus:outline-none focus:ring-4 focus:ring-ruoste-vaalein" bind:value={prompt}></textarea>
</div>