<script lang="ts">
  import { onMount } from 'svelte';
  
  let connected = false;
  let resolveInfo = null;
  
  // Status message based on connection
  $: statusMessage = connected 
    ? `Connected to ${resolveInfo?.productName || 'DaVinci Resolve'} ${resolveInfo?.versionString || ''}`
    : 'Not connected to DaVinci Resolve';

  onMount(() => {
    console.log('App mounted');
    
    // Check if we have access to the valuvaAPI from preload
    if (window.valuvaAPI) {
      // Listen for connection status updates
      window.valuvaAPI.onResolveConnection((isConnected) => {
        connected = isConnected;
      });
      
      // Get Resolve information
      window.valuvaAPI.getResolveInfo()
        .then((info) => {
          if (!info.success) {
            console.error('Resolve info error:', info.error);
            connected = false;
          } else {
            console.log('Resolve info:', info);
            connected = true;
            resolveInfo = info;
          }
        })
        .catch((error) => {
          console.error('Error getting Resolve info:', error);
          connected = false;
        });
    } else {
      connected = false;
      console.error('Valuva API not available');
    }
  });
</script>

<main>
  <div class="app-container">
    <header>
      <h1>Valuva AI Graphics</h1>
      <div class="status-badge" class:connected class:disconnected={!connected}>
        {statusMessage}
      </div>
    </header>

    <div class="content">
      <!-- Your app content goes here -->
      {#if connected}
        <div class="card">
          <h2>Ready to Generate AI Graphicsssssssss</h2>
          <p>Use the tools below to create graphics for your DaVinci Resolve project.</p>
        </div>
      {:else}
        <div class="error-card">
          <h2>Connection Error</h2>
          <p>Please make sure DaVinci Resolve is running and try again.</p>
        </div>
      {/if}
    </div>
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #1e1e1e;
    color: #ffffff;
    height: 100vh;
  }

  .app-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 1rem;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  h1 {
    font-size: 2rem;
    font-weight: 600;
    margin: 0;
  }

  .status-badge {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.875rem;
  }

  .connected {
    background-color: rgba(0, 255, 0, 0.1);
    color: #4caf50;
  }

  .disconnected {
    background-color: rgba(255, 0, 0, 0.1);
    color: #f44336;
  }

  .content {
    flex: 1;
  }

  .card, .error-card {
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1rem;
  }

  .error-card {
    border-left: 4px solid #f44336;
  }

  h2 {
    margin-top: 0;
    font-size: 1.5rem;
  }
</style> 