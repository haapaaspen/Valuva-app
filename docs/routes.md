# /items/{itemId}?sessionId={chatSessionId}

src/routes/
  (app)/
    +layout.svelte       <-- Root app layout (optional, auth)
    items/
      [itemId]/            <-- Dynamic segment for the item ID
        +layout.svelte     <-- Editor layout (optional, sets up flex/grid)
        +page.svelte     <-- Main editor page: /items/{itemId}


Example:

<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  import EditorViewport from '$lib/components/EditorViewport.svelte';
  import EditControlsPanel from '$lib/components/EditControlsPanel.svelte';
  import ChatPanel from '$lib/components/ChatPanel.svelte';

  // Get the current item ID from the route parameters
  // This is available because of the [itemId] directory name
  $: itemId = $page.params.itemId;

  // State derived from URL Search Parameters
  // /items/{itemId}?chat=true&sessionId={chatSessionId}&controls=true
  $: showChatPanel = $page.url.searchParams.has('chat');
  $: activeChatSessionId = $page.url.searchParams.get('sessionId'); // Can be null if ?sessionId is not present
  $: showControlsPanel = $page.url.searchParams.has('controls');

  // --- Functions to update the URL and toggle panels / select session ---

  // Toggles the visibility of a panel (chat or controls)
  function togglePanel(panelName) {
      const params = new URLSearchParams($page.url.searchParams);
      const isCurrentlyShown = params.has(panelName);

      if (isCurrentlyShown) {
          params.delete(panelName);
          // If closing chat, also remove the session ID from params
          if (panelName === 'chat' && params.has('sessionId')) {
              params.delete('sessionId');
          }
      } else {
          params.set(panelName, 'true'); // Or just params.set(panelName, '')
          // If opening chat and no session is selected, maybe set a default or indicate creation needed?
          // For now, let's assume the ChatPanel handles session selection/creation internally
      }
      goto(`${$page.url.pathname}?${params.toString()}`, { keepfocus: true });
  }

  // Navigates to show the chat panel with a specific session selected
  function selectChatSession(sessionId) {
       const params = new URLSearchParams($page.url.searchParams);
       params.set('chat', 'true'); // Ensure chat panel is open
       params.set('sessionId', sessionId);
       goto(`${$page.url.pathname}?${params.toString()}`, { keepfocus: true });
  }

  // Handle internal chat panel events (e.g., user creates a new session)
  function handleNewSessionCreated(event) {
      const newSessionId = event.detail.sessionId;
      selectChatSession(newSessionId); // Update URL to reflect the new session
  }

</script>

<!-- Overall container, maybe using flexbox or grid -->
<div class="editor-layout">

  <!-- Main Viewport Area -->
  <div class="viewport-area">
    <EditorViewport {itemId} />
  </div>

  <!-- Controls Panel -->
  {#if showControlsPanel}
    <div class="controls-area">
      <EditControlsPanel {itemId} />
    </div>
  {/if}

  <!-- Chat Panel -->
  {#if showChatPanel}
    <div class="chat-area">
      <!-- Pass itemId and activeChatSessionId to the ChatPanel -->
      <ChatPanel {itemId} {activeChatSessionId} on:sessionselected={e => selectChatSession(e.detail.sessionId)} on:newsessioncreated={handleNewSessionCreated} />
    </div>
  {/if}

  <!-- Example UI elements to toggle panels -->
  <div class="panel-toggles">
    <button on:click={() => togglePanel('controls')}>Controls ({showControlsPanel ? 'Hide' : 'Show'})</button>
    <button on:click={() => togglePanel('chat')}>Chat ({showChatPanel ? 'Hide' : 'Show'})</button>
  </div>

</div>

<style>
  /* Basic Layout Example (Flexbox) */
  .editor-layout {
    display: flex;
    height: 100vh; /* Adjust as needed */
    overflow: hidden;
  }

  .viewport-area {
    flex-grow: 1;
    overflow: auto;
  }

  .controls-area, .chat-area {
    width: 300px; /* Example width, adjust as needed */
    flex-shrink: 0;
    overflow-y: auto; /* Add scroll if panel content is tall */
    border-left: 1px solid #ccc; /* Example separator */
    /* Add background, padding, etc. */
  }

  /* Add styles for panel-toggles */
</style>