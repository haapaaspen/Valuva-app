<script>
  import { selectedElement, selectedElementStyles, updateSelectedElementStyle } from '$lib/stores/canvasStore';
  
  // Demo effect controls - in a real implementation these would be dynamic based on the selected element
  const textEffects = [
    { 
      name: 'Font Size', 
      property: 'fontSize', 
      type: 'range', 
      min: 8, 
      max: 120, 
      step: 1, 
      unit: 'px', 
      default: 16
    },
    { 
      name: 'Font Weight', 
      property: 'fontWeight', 
      type: 'range', 
      min: 100, 
      max: 900, 
      step: 100, 
      default: 400
    },
    { 
      name: 'Letter Spacing', 
      property: 'letterSpacing', 
      type: 'range', 
      min: -5, 
      max: 20,
      step: 0.5, 
      unit: 'px', 
      default: 0
    },
    { 
      name: 'Text Color', 
      property: 'color', 
      type: 'color', 
      default: '#ffffff' 
    }
  ];
  
  const effects = [
    { 
      name: 'Shadow Distance', 
      property: 'textShadow', 
      type: 'range', 
      min: 0, 
      max: 20, 
      step: 1, 
      unit: 'px',
      complex: true, 
      default: 0
    },
    { 
      name: 'Shadow Blur', 
      property: 'textShadow', 
      type: 'range', 
      min: 0, 
      max: 20, 
      step: 1, 
      unit: 'px',
      complex: true, 
      default: 0
    },
    { 
      name: 'Shadow Color', 
      property: 'textShadow', 
      type: 'color',
      complex: true, 
      default: '#000000' 
    }
  ];
  
  // Default values for demo
  let shadowDistance = 0;
  let shadowBlur = 0;
  let shadowColor = '#000000';
  
  function updateShadow() {
    const shadow = `${shadowDistance}px ${shadowDistance}px ${shadowBlur}px ${shadowColor}`;
    updateSelectedElementStyle('textShadow', shadow);
  }
  
  function handleControlChange(effect, event) {
    let value = event.target.value;
    
    if (effect.unit) {
      value = `${value}${effect.unit}`;
    }
    
    if (effect.complex) {
      if (effect.property === 'textShadow') {
        if (effect.name === 'Shadow Distance') {
          shadowDistance = event.target.value;
        } else if (effect.name === 'Shadow Blur') {
          shadowBlur = event.target.value;
        } else if (effect.name === 'Shadow Color') {
          shadowColor = event.target.value;
        }
        updateShadow();
      }
    } else {
      updateSelectedElementStyle(effect.property, value);
    }
  }
</script>

<div class="flex flex-col h-full">
  <div class="panel-header">
    <span>Effects</span>
  </div>
  
  <!-- Text Effects Section -->
  <div class="mb-6">
    <h3 class="text-sm uppercase tracking-wider text-gray-400 mb-3">Text Effects</h3>
    
    {#each textEffects as effect}
      <div class="mb-4">
        <div class="flex justify-between mb-2">
          <label class="text-sm font-medium">{effect.name}</label>
          {#if effect.type === 'range'}
            <span class="text-xs text-gray-400">
              {effect.property in $selectedElementStyles 
                ? $selectedElementStyles[effect.property] 
                : `${effect.default}${effect.unit || ''}`}
            </span>
          {/if}
        </div>
        
        {#if effect.type === 'range'}
          <input 
            type="range" 
            min={effect.min} 
            max={effect.max} 
            step={effect.step} 
            class="w-full bg-dark-200 rounded-full appearance-none h-2"
            value={effect.property in $selectedElementStyles 
              ? parseInt($selectedElementStyles[effect.property]) 
              : effect.default}
            on:input={(e) => handleControlChange(effect, e)}
          />
        {:else if effect.type === 'color'}
          <div class="flex items-center">
            <input 
              type="color" 
              class="w-8 h-8 bg-transparent border-0 p-0"
              value={effect.property in $selectedElementStyles 
                ? $selectedElementStyles[effect.property] 
                : effect.default}
              on:input={(e) => handleControlChange(effect, e)}
            />
            <input 
              type="text" 
              class="input ml-2 flex-1"
              value={effect.property in $selectedElementStyles 
                ? $selectedElementStyles[effect.property] 
                : effect.default}
              on:input={(e) => handleControlChange(effect, e)}
            />
          </div>
        {/if}
      </div>
    {/each}
  </div>
  
  <!-- Special Effects Section -->
  <div>
    <h3 class="text-sm uppercase tracking-wider text-gray-400 mb-3">Special Effects</h3>
    
    {#each effects as effect}
      <div class="mb-4">
        <div class="flex justify-between mb-2">
          <label class="text-sm font-medium">{effect.name}</label>
          {#if effect.type === 'range'}
            <span class="text-xs text-gray-400">
              {effect.name === 'Shadow Distance' 
                ? shadowDistance 
                : effect.name === 'Shadow Blur'
                  ? shadowBlur
                  : effect.default}{effect.unit || ''}
            </span>
          {/if}
        </div>
        
        {#if effect.type === 'range'}
          <input 
            type="range" 
            min={effect.min} 
            max={effect.max} 
            step={effect.step} 
            class="w-full bg-dark-200 rounded-full appearance-none h-2"
            value={effect.name === 'Shadow Distance' 
              ? shadowDistance 
              : effect.name === 'Shadow Blur'
                ? shadowBlur
                : effect.default}
            on:input={(e) => handleControlChange(effect, e)}
          />
        {:else if effect.type === 'color'}
          <div class="flex items-center">
            <input 
              type="color" 
              class="w-8 h-8 bg-transparent border-0 p-0"
              value={effect.name === 'Shadow Color' ? shadowColor : effect.default}
              on:input={(e) => handleControlChange(effect, e)}
            />
            <input 
              type="text" 
              class="input ml-2 flex-1"
              value={effect.name === 'Shadow Color' ? shadowColor : effect.default}
              on:input={(e) => handleControlChange(effect, e)}
            />
          </div>
        {/if}
      </div>
    {/each}
  </div>
  
  <!-- Element Selection Message -->
  {#if !$selectedElement}
    <div class="mt-6 p-4 bg-dark-200 rounded-lg text-center text-gray-400 text-sm">
      <p>Select an element on the canvas to edit its properties</p>
    </div>
  {/if}
</div> 