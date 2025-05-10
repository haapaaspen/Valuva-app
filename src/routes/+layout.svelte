<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import { resolveConnected } from '$lib/stores/appState';

  onMount(() => {
    // If running in Electron environment, check DaVinci Resolve connection
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.onResolveConnectionStatus((status) => {
        resolveConnected.set(status);
      });
    }
  });
</script>

<main class="app-container">
  <slot />
</main> 