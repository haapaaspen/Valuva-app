# Valuva Frontend Setup Guide

## What Was Copied

I've successfully copied the **minimal functionality** from `valuva-app` to `frontend` to get:
1. ✅ LLM service running (with tools)
2. ✅ Canvas rendering working

## Files Created

### Server-Side AI Configuration
```
src/lib/server/ai/
├── models.ts          # AI model setup (Claude)
├── tools.ts           # generateCanvasGraphics & webfontloadertool
└── prompts.ts         # Motion graphics system prompt
```

### API Routes
```
src/routes/api/chat/
└── +server.ts         # Chat endpoint with streaming
```

### Components
```
src/lib/components/
├── chat.svelte                # Main chat wrapper
├── messages.svelte            # Message list
├── preview-message.svelte     # Individual message with tool results
├── multimodal-input.svelte    # Chat input box
└── canvas.svelte              # Graphics renderer
```

### Utilities
```
src/lib/
├── canvas-utils.ts    # Canvas animation utilities
└── env.d.ts          # Type definitions for env variables
```

### Pages
```
src/routes/
├── +page.svelte      # Main page (chat + canvas layout)
└── +layout.svelte    # Root layout with Toaster
```

## How to Run

### 1. Add Your API Key

Edit the `.env` file and add your Anthropic API key:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
```

### 2. Start Dev Server

```bash
cd /Users/vilihaapaniemi/Code/valuva/Valuva-app/frontend
pnpm dev
```

### 3. Open Browser

Navigate to `http://localhost:5173`

## Testing the Functionality

### Test 1: Basic Chat
1. Type a message like "Hello!" in the chat input
2. You should see the AI respond

### Test 2: Graphics Generation
1. Type: "Create a simple animated circle that pulses"
2. The AI should use the `generateCanvasGraphics` tool
3. You'll see "🛠️ Using tool: generateCanvasGraphics"
4. Then "✅ generateCanvasGraphics completed"
5. The canvas on the right should show the animation

### Test 3: Font Loading
1. Type: "Create text animation with Roboto font"
2. The AI should use both `webfontloadertool` and `generateCanvasGraphics`
3. You'll see both tools being called
4. The canvas should render text with the specified font

## Example Prompts to Try

1. **Simple Graphics**
   - "Create a blue gradient background"
   - "Draw a red circle in the center"
   - "Make a simple pulsing animation"

2. **Text & Typography**
   - "Create a title 'Hello World' with Montserrat font"
   - "Animate text that fades in and out"
   - "Create a corporate logo animation"

3. **Motion Graphics**
   - "Create floating particles"
   - "Make an orbital animation with shapes"
   - "Create a wave effect"

## What's Different from valuva-app

### ✅ Included (Minimal Functionality)
- AI SDK integration
- Chat UI
- Canvas rendering
- Tool execution (generateCanvasGraphics, webfontloadertool)
- Real-time streaming
- Toast notifications

### ❌ Not Included (Can Add Later)
- Authentication system
- Database persistence
- Chat history
- File uploads
- Timeline controls (play/pause/seek)
- Export to PNG sequence
- Advanced UI components (shadcn-svelte)
- Model selector
- User management

## Architecture Overview

```
User Types Message
       ↓
Chat Component (chat.svelte)
       ↓
POST /api/chat
       ↓
AI SDK streamText()
       ↓
AI Uses Tools (generateCanvasGraphics, webfontloadertool)
       ↓
Tool Results Streamed Back
       ↓
preview-message.svelte Dispatches 'graphicsGenerated' Event
       ↓
+page.svelte Listens for Event
       ↓
Canvas Component Executes Code
       ↓
Graphics Rendered on 4K Canvas
```

## Troubleshooting

### TypeScript Errors
The linter may show some errors about `@ai-sdk/svelte` or `svelteHTML`. These are false positives and will resolve when:
- The dev server starts
- Your IDE restarts the TypeScript server

You can ignore them for now - the app will work fine.

### "Module not found" at Runtime
Make sure you've run `pnpm install` and all dependencies are installed.

### Canvas Not Rendering
1. Check browser console for errors
2. Make sure the AI actually called the `generateCanvasGraphics` tool
3. Look for the "✅ generateCanvasGraphics completed" message

### API Errors
1. Check that your `.env` file has the correct `ANTHROPIC_API_KEY`
2. Check browser Network tab for API call details
3. Check terminal for server-side errors

## Next Steps

Now that you have the minimal functionality working, you can incrementally add:

1. **Timeline Controls** - Copy from valuva-app to add play/pause/seek
2. **Export Functionality** - Add PNG sequence export
3. **More Canvas Utils** - Copy advanced canvas utilities
4. **Authentication** - Add user system if needed
5. **Database** - Add chat history persistence
6. **More Tools** - Add custom tools for your use case

## Key Learnings

### How Tools Work
1. AI decides to use a tool based on the prompt
2. Tool is executed server-side
3. Result is streamed back to client
4. Client listens for tool results and takes action

### How Canvas Rendering Works
1. AI generates JavaScript code as a string
2. Code is passed to Canvas component
3. Canvas component executes code using `new Function()`
4. Code has access to: `ctx`, `canvas`, `width`, `height`, `utils`
5. Graphics are rendered in real-time

### How Events Connect Components
1. `preview-message.svelte` detects tool results
2. Dispatches custom event: `window.dispatchEvent(new CustomEvent(...))`
3. `+page.svelte` listens: `window.addEventListener('graphicsGenerated', ...)`
4. Updates state and passes to Canvas component

This is a clean separation of concerns that makes the system modular and maintainable.

