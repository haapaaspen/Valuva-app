<script>
  import { onMount } from 'svelte';
  import { resolveConnected, resolveInfo } from '$lib/stores/appState';
  import { showAnnotationOverlay } from '$lib/stores/appState';
  
  // Placeholder components - these will be implemented later
  let ChatPanel;
  let CanvasPanel;
  let EffectsPanel;
  
  // Check Resolve connection on mount
  onMount(async () => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      try {
        const info = await window.electronAPI.getResolveInfo();
        resolveInfo.set(info);
      } catch (error) {
        console.error('Failed to get Resolve info:', error);
      }
    }
    
    // For development, we'll create placeholder components later
    import('$components/Chat/ChatPanel.svelte').then(module => {
      ChatPanel = module.default;
    });
    
    import('$components/Canvas/CanvasPanel.svelte').then(module => {
      CanvasPanel = module.default;
    });
    
    import('$components/Effects/EffectsPanel.svelte').then(module => {
      EffectsPanel = module.default;
    });
  });
</script>

<div class="app-container">
  <!-- Left Panel: Chat -->
  <div class="h-screen p-4 bg-dark-300 overflow-y-auto">
    {#if ChatPanel}
      <svelte:component this={ChatPanel} />
    {:else}
      <div class="panel">
        <div class="panel-header">Chat Panel</div>
        <div class="panel-content">
          <p class="text-center text-gray-400 py-4">Loading chat interface...</p>
        </div>
      </div>
    {/if}
  </div>
  
  <!-- Center Panel: Canvas -->
  <div class="h-screen p-4 bg-dark-400 overflow-hidden flex flex-col">
    {#if CanvasPanel}
      <svelte:component this={CanvasPanel} />
    {:else}
      <div class="panel flex-1">
        <div class="panel-header">
          <span>Core Idea</span>
          <button class="btn btn-ghost text-sm px-2 py-1" 
            on:click={() => showAnnotationOverlay.update(v => !v)}>
            Toggle Annotations
          </button>
        </div>
        <div class="flex-1 rounded-lg bg-dark-400 flex items-center justify-center">
          <p class="text-center text-gray-400">Loading canvas...</p>
        </div>
      </div>
    {/if}
  </div>
  
  <!-- Right Panel: Effects -->
  <div class="h-screen p-4 bg-dark-300 overflow-y-auto">
    {#if EffectsPanel}
      <svelte:component this={EffectsPanel} />
    {:else}
      <div class="panel">
        <div class="panel-header">Effects</div>
        <div class="panel-content">
          <p class="text-center text-gray-400 py-4">Loading effects panel...</p>
        </div>
      </div>
    {/if}
  </div>
</div>

<div class="fixed bottom-0 left-0 right-0 bg-dark-500 p-2 text-xs text-center">
  {#if $resolveConnected}
    <span class="text-green-400">Connected to DaVinci Resolve</span>
    {#if $resolveInfo?.projectName}
      <span class="text-gray-400 mx-2">|</span> 
      <span class="text-gray-300">Project: {$resolveInfo.projectName}</span>
    {/if}
  {:else}
    <span class="text-red-400">Not connected to DaVinci Resolve</span>
  {/if}
</div> 