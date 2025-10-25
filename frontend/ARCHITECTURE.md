# Architecture Documentation

## Overview

This application follows a **domain-driven architecture** with clear separation of concerns between client, server, and presentation layers.

## Directory Structure

```
src/lib/
├── domains/                           # Domain-specific business logic
│   ├── animation/                     # Animation domain
│   │   ├── animation-store.svelte.ts  # Centralized state (animation + timeline + export)
│   │   ├── animation-service.ts       # Business logic (play, pause, seek, load)
│   │   ├── render-service.ts          # Rendering engine (compile, cache, playback)
│   │   ├── export-service.ts          # Video & PNG export functionality
│   │   └── types.ts                   # Animation-specific types
│   │
│   ├── chat/                          # Chat domain
│   │   ├── chat-store.svelte.ts       # Chat state
│   │   ├── chat-client.ts             # Chat orchestration & cross-domain communication
│   │   ├── message-parser.ts          # AI message parsing
│   │   └── types.ts                   # Chat-specific types
│   │
│   └── ai/                            # AI-specific shared code
│       └── tool-schemas.ts            # Zod schemas for AI tools (shared client/server)
│
├── components/                        # UI components (thin, presentational)
│   ├── canvas.svelte
│   ├── chat.svelte
│   ├── messages.svelte
│   ├── preview-message.svelte
│   ├── input-box.svelte
│   ├── timeline.svelte
│   └── export-dropdown.svelte
│
└── server/                            # Server-only code
    └── ai/
        ├── chat-handler.ts            # Server-side chat logic
        ├── models.ts                  # AI provider configuration
        ├── prompts.ts                 # System prompts
        └── tools.ts                   # AI tool definitions

routes/
└── api/
    └── chat/
        └── +server.ts                 # Thin API endpoint (delegates to chat-handler)
```

## Design Principles

### 1. Domain-Driven Organization
Code is organized by **domain** (what it does) rather than by technical role (how it's implemented):
- ✅ `domains/animation/` - everything animation-related
- ✅ `domains/chat/` - everything chat-related
- ❌ `hooks/`, `services/`, `utils/` - technical folders mix concerns

### 2. Clear Layer Separation

#### **Store Layer** (`.svelte.ts`)
- Contains ONLY reactive state using Svelte 5 runes (`$state`)
- No business logic
- Example: `animation-store.svelte.ts`

#### **Service Layer** (`.ts`)
- Contains ALL business logic
- Manipulates store state
- Pure TypeScript (easily testable)
- Example: `animation-service.ts`, `render-service.ts`

#### **Component Layer** (`.svelte`)
- Thin presentational components
- Bind to DOM, react to state changes
- Delegate all logic to services
- Example: `canvas.svelte`, `chat.svelte`

### 3. Server/Client Split

#### Client Code (`lib/domains/`)
- State management (stores)
- Business logic (services)
- UI components

#### Shared Code (`lib/domains/ai/`)
- Type definitions
- Zod schemas
- Can be imported by both client and server

#### Server Code (`lib/server/`)
- AI provider configuration
- System prompts
- Tool implementations
- Never imports client code

#### API Routes (`routes/api/`)
- Thin bridge between client and server
- Parse request → delegate to server service → return response
- No business logic

### 4. Cross-Domain Communication

Domains communicate through services, not context or props drilling:

```typescript
// In chat-client.ts
handleAIMessage(message) {
    const graphicsData = findGraphicsResult(message);
    if (graphicsData) {
        // Chat domain → Animation domain
        AnimationService.loadFromAI(graphicsData);
    }
}
```

## Data Flow

### User Creates Animation

```
1. User types message
   → input-box.svelte

2. Chat component handles submission
   → chat.svelte creates ChatClient
   → ChatClient.getChat().handleSubmit()

3. Request sent to server
   → POST /api/chat
   → +server.ts receives request

4. Server processes with AI
   → ChatHandler.handleRequest()
   → streamText() with Claude
   → AI decides to use generateCanvasGraphics tool
   → Tool executes, returns graphics data

5. Response streams back to client
   → ChatClient receives message
   → ChatClient.handleAIMessage() parses response

6. Cross-domain communication
   → findGraphicsResult() extracts graphics data
   → AnimationService.loadFromAI() updates animation
   → RenderService.compile() compiles code

7. UI updates reactively
   → canvas.svelte reacts to animation.code change
   → Renders new animation
```

## Key Files Explained

### `animation-store.svelte.ts`
Consolidates all animation-related state (previously split across `animation.svelte.ts` and `timeline.svelte.ts`):
- Animation properties (code, duration, dimensions)
- Timeline state (currentTime, isPlaying)
- Export state (isExporting, progress)
- Timeline utilities (FPS, quantizeTime, etc.)

### `animation-service.ts`
Centralized control for animation operations:
- `loadFromAI()` - Load animation from AI tool
- `play()`, `pause()`, `stop()`, `togglePlayPause()`
- `seek()` - Jump to specific time
- `setDimensions()` - Resize canvas

### `render-service.ts`
Handles rendering and performance:
- `compile()` - Convert code string to executable function
- `renderFrame()` - Render specific frame
- `startPlayback()`, `stopPlayback()` - Control animation loop
- Frame caching for performance
- Singleton pattern

### `chat-client.ts`
Orchestrates chat and coordinates with other domains:
- Extends `@ai-sdk/svelte` Chat class with custom functionality
- `isLoading` getter - Convenient loading state check
- `handleAIMessage()` - Process AI responses and trigger animations
- Cross-domain communication (chat → animation)
- Error handling built into constructor

### `message-parser.ts`
Parses AI message structure:
- `processMessageParts()` - Extract text and tool invocations
- `findGraphicsResult()` - Find completed graphics generation

### `chat-handler.ts` (Server)
Server-side chat orchestration:
- Configure `streamText()` with model, prompts, tools
- Handle streaming response
- Error handling

## Benefits of This Architecture

1. **Clear Boundaries** - Each layer has a single responsibility
2. **Easy to Test** - Services are pure TypeScript
3. **Easy to Find** - Code organized by domain, not technical role
4. **Type Safety** - TypeScript throughout with shared types
5. **Maintainable** - Logic in services, not scattered across components
6. **Scalable** - Easy to add new domains or features

## Migration Notes

### What Changed

**Before:**
- `lib/hooks/` - State files
- `lib/services/` - Service files  
- `lib/utils/` - Utility files
- `lib/types/` - Context types
- Business logic mixed in components

**After:**
- `lib/domains/animation/` - All animation code together
- `lib/domains/chat/` - All chat code together
- `lib/server/ai/` - All server code together
- Components are thin wrappers

### Breaking Changes

None! All external APIs remain the same. Components still work the same way from a user perspective.

### Files Removed

- ❌ `lib/hooks/animation.svelte.ts` → Merged into `domains/animation/animation-store.svelte.ts`
- ❌ `lib/hooks/timeline.svelte.ts` → Merged into `domains/animation/animation-store.svelte.ts`
- ❌ `lib/services/animation-service.ts` → Moved to `domains/animation/animation-service.ts`
- ❌ `lib/services/render-service.ts` → Moved to `domains/animation/render-service.ts`
- ❌ `lib/services/exporter-service.svelte.ts` → Moved to `domains/animation/export-service.ts`
- ❌ `lib/utils/message-processor.ts` → Moved to `domains/chat/message-parser.ts`
- ❌ `lib/types/context.ts` → No longer needed (direct domain communication)

## Adding New Features

### Adding a New Tool

1. **Define schema** in `lib/domains/ai/tool-schemas.ts`:
```typescript
export const myToolSchema = z.object({ ... });
```

2. **Implement tool** in `lib/server/ai/tools.ts`:
```typescript
export const myTool = tool({
    description: '...',
    parameters: myToolSchema,
    execute: async (params) => { ... }
});
```

3. **Add to chat handler** in `lib/server/ai/chat-handler.ts`:
```typescript
tools: {
    generateCanvasGraphics,
    myTool, // Add here
}
```

4. **Handle result** in `lib/domains/chat/chat-client.ts`:
```typescript
handleAIMessage(message) {
    // Parse and dispatch to appropriate domain
}
```

### Adding a New Domain

Create a new folder in `lib/domains/`:
```
lib/domains/my-domain/
├── my-domain-store.svelte.ts   # State
├── my-domain-service.ts        # Business logic
└── types.ts                    # Types
```

## Common Patterns

### Accessing State in Components
```svelte
<script lang="ts">
    import { animation, timeline } from '$lib/domains/animation/animation-store.svelte';
    
    // Read reactive state
    const progress = timeline.currentTime / animation.duration;
</script>
```

### Calling Service Methods
```svelte
<script lang="ts">
    import { AnimationService } from '$lib/domains/animation/animation-service';
    
    function handlePlay() {
        AnimationService.play();
    }
</script>
```

### Cross-Domain Communication
```typescript
// In one domain's service
import { OtherDomainService } from '../other-domain/other-domain-service';

function doSomething() {
    // Coordinate with other domain
    OtherDomainService.doSomethingElse();
}
```

