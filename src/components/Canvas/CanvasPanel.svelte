<script>
  import { onMount } from 'svelte';
  import { coreIdea } from '$lib/stores/chatStore';
  import { htmlContent, cssContent, jsContent, canvasDimensions, annotationMode, showAnnotationOverlay } from '$lib/stores/canvasStore';
  
  let canvasRef;
  let annotationLayerRef;
  let isDrawing = false;
  let currentPath = [];
  
  // For demo purposes, we'll include some example content
  onMount(() => {
    if (!$htmlContent) {
      $htmlContent = `
<div class="container">
  <h1 class="title">Welcome to Valuva</h1>
  <p class="subtitle">AI-Powered Motion Graphics</p>
</div>`;
    }
    
    if (!$cssContent) {
      $cssContent = `
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: white;
  font-family: sans-serif;
}

.title {
  font-size: 64px;
  font-weight: bold;
  margin-bottom: 16px;
  background: linear-gradient(to right, #38bdf8, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 24px;
  opacity: 0.8;
}`;
    }
    
    $coreIdea = "A modern, clean design with gradients for the main title and a simple subtitle.";
  });
  
  function handleAnnotationModeChange(mode) {
    $annotationMode = mode;
  }
  
  function startDrawing(e) {
    if ($annotationMode === 'pen' && $showAnnotationOverlay) {
      isDrawing = true;
      const rect = annotationLayerRef.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      currentPath = [[x, y]];
    }
  }
  
  function draw(e) {
    if (isDrawing && $annotationMode === 'pen' && $showAnnotationOverlay) {
      const rect = annotationLayerRef.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      currentPath = [...currentPath, [x, y]];
      renderAnnotations();
    }
  }
  
  function stopDrawing() {
    isDrawing = false;
    // In a real implementation, we would add this path to the annotations store
    // For now, we'll just reset the current path
    currentPath = [];
  }
  
  function renderAnnotations() {
    // In a real implementation, this would use SVG to render all paths
    // For now, we'll just draw the current path using canvas 2D context
    if (annotationLayerRef && currentPath.length > 1) {
      const ctx = annotationLayerRef.getContext('2d');
      ctx.clearRect(0, 0, annotationLayerRef.width, annotationLayerRef.height);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(currentPath[0][0], currentPath[0][1]);
      
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i][0], currentPath[i][1]);
      }
      
      ctx.stroke();
    }
  }
</script>

<div class="flex flex-col h-full">
  <div class="panel-header">
    <span>Core Idea</span>
    <div>
      <button 
        class="btn btn-ghost text-sm px-2 py-1" 
        on:click={() => $showAnnotationOverlay = !$showAnnotationOverlay}
      >
        {$showAnnotationOverlay ? 'Hide' : 'Show'} Annotations
      </button>
    </div>
  </div>
  
  <div class="mb-4">
    <textarea
      class="input w-full h-16 resize-none"
      placeholder="AI-generated summary that the user can edit..."
      bind:value={$coreIdea}
    ></textarea>
  </div>
  
  <div class="relative flex-1 rounded-lg bg-dark-500 overflow-hidden">
    <!-- Canvas container with aspect ratio -->
    <div class="w-full h-full flex items-center justify-center">
      <div 
        class="relative" 
        style="width: {$canvasDimensions.width / 2}px; height: {$canvasDimensions.height / 2}px;"
      >
        <!-- HTML Preview -->
        <iframe
          bind:this={canvasRef}
          title="Preview"
          class="absolute inset-0 w-full h-full border-0 bg-black"
          srcdoc={`
            <!DOCTYPE html>
            <html>
              <head>
                <style>${$cssContent}</style>
              </head>
              <body style="margin:0; overflow:hidden; width:100%; height:100%;">
                ${$htmlContent}
                <script>${$jsContent}</script>
              </body>
            </html>
          `}
          sandbox="allow-scripts"
        ></iframe>
        
        <!-- Annotation Layer -->
        {#if $showAnnotationOverlay}
          <canvas
            bind:this={annotationLayerRef}
            class="absolute inset-0 w-full h-full pointer-events-auto z-10"
            width={$canvasDimensions.width / 2}
            height={$canvasDimensions.height / 2}
            on:mousedown={startDrawing}
            on:mousemove={draw}
            on:mouseup={stopDrawing}
            on:mouseleave={stopDrawing}
          ></canvas>
        {/if}
      </div>
    </div>
  </div>
  
  <!-- Toolbar -->
  {#if $showAnnotationOverlay}
    <div class="flex justify-center mt-4 space-x-2">
      <button 
        class="btn btn-ghost {$annotationMode === 'none' ? 'bg-dark-200' : ''}" 
        on:click={() => handleAnnotationModeChange('none')}
      >
        Select
      </button>
      <button 
        class="btn btn-ghost {$annotationMode === 'pen' ? 'bg-dark-200' : ''}" 
        on:click={() => handleAnnotationModeChange('pen')}
      >
        Draw
      </button>
      <button 
        class="btn btn-ghost {$annotationMode === 'text' ? 'bg-dark-200' : ''}" 
        on:click={() => handleAnnotationModeChange('text')}
      >
        Text
      </button>
      <button 
        class="btn btn-ghost {$annotationMode === 'shape' ? 'bg-dark-200' : ''}" 
        on:click={() => handleAnnotationModeChange('shape')}
      >
        Shape
      </button>
    </div>
  {/if}
</div>

<style>
  /* This component's styles can be added here */
</style> 