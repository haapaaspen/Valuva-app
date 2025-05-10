<script>
  import { guidedPrompts, generalPrompt, chatMode, addGuidedPrompt, updateGuidedPrompt, removeGuidedPrompt, startNewChat } from '$lib/stores/chatStore';
  
  function handleModeChange(mode) {
    chatMode.set(mode);
  }
  
  function handleGuidedPromptChange(id, field, value) {
    updateGuidedPrompt(id, field, value);
  }
</script>

<div class="flex flex-col h-full">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-bold">NEW CHAT</h2>
    <button class="btn btn-primary" on:click={startNewChat}>
      Reset
    </button>
  </div>
  
  <div class="mb-4">
    <h3 class="text-sm uppercase tracking-wider text-gray-400 mb-2">Guided prompts</h3>
    
    {#each $guidedPrompts as prompt (prompt.id)}
      <div class="mb-3 p-3 bg-dark-200 rounded-lg">
        <div class="flex justify-between items-center mb-2">
          <div class="text-sm font-medium">
            {prompt.type === 'main-title' ? 'Main title example' : 'Secondary title example'}
          </div>
          {#if $guidedPrompts.length > 1}
            <button class="text-gray-400 hover:text-red-400" on:click={() => removeGuidedPrompt(prompt.id)}>
              ✕
            </button>
          {/if}
        </div>
        
        <div class="mb-2">
          <input
            type="text"
            class="input w-full"
            placeholder="Enter text content"
            value={prompt.text}
            on:input={(e) => handleGuidedPromptChange(prompt.id, 'text', e.target.value)}
          />
        </div>
        
        <div>
          <input
            type="text"
            class="input w-full"
            placeholder="Style description (e.g., flowy, italic, cool)"
            value={prompt.style}
            on:input={(e) => handleGuidedPromptChange(prompt.id, 'style', e.target.value)}
          />
        </div>
      </div>
    {/each}
    
    <button class="btn btn-ghost mt-2 w-full border border-dashed border-dark-100" on:click={addGuidedPrompt}>
      + Add another prompt
    </button>
  </div>
  
  <div class="mb-4">
    <h3 class="text-sm uppercase tracking-wider text-gray-400 mb-2">General instructions</h3>
    <textarea
      class="input w-full h-32 resize-none"
      placeholder="Add any additional context, style preferences, or specific requirements..."
      bind:value={$generalPrompt}
    ></textarea>
  </div>
  
  <div class="mt-auto">
    <h3 class="text-sm uppercase tracking-wider text-gray-400 mb-2">I want to</h3>
    <div class="grid grid-cols-2 gap-3">
      <button
        class="btn {$chatMode === 'brainstorm' ? 'btn-primary' : 'btn-ghost'}"
        on:click={() => handleModeChange('brainstorm')}
      >
        brainstorm
      </button>
      <button
        class="btn {$chatMode === 'create' ? 'btn-primary' : 'btn-ghost'}"
        on:click={() => handleModeChange('create')}
      >
        create the final product
      </button>
    </div>
    
    <button class="btn btn-secondary w-full mt-4">
      Submit
    </button>
  </div>
</div> 