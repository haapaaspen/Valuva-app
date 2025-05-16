

<script lang="ts">
    import Postit from './artifacts/Postit.svelte';
    import Toolbar from './Toolbar.svelte';
    import Viewport from './Viewport.svelte';
    // children: viewport, blueprints
</script>

<div class="flex flex-col  h-full">
    <div class="fixed bottom-0 w-2/4 flex justify-center pb-4">
        <Toolbar />
    </div>
</div>