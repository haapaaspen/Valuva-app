# Valuva AI Frontend - Minimal Setup

This is a minimal implementation of the Valuva AI chatbot with canvas graphics rendering capabilities. It includes:

## Features

- ✅ **LLM Service**: AI SDK integration with Anthropic Claude
- ✅ **Tool Support**: `generateCanvasGraphics` and `webfontloadertool` tools
- ✅ **Chat UI**: Simple chat interface with message rendering
- ✅ **Canvas Rendering**: 4K canvas (1920x1080) for graphics rendering
- ✅ **Real-time Graphics Generation**: AI generates code that executes on canvas

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit `.env` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=your_actual_api_key_here
```

### 3. Run Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
frontend/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── chat.svelte              # Main chat component
│   │   │   ├── messages.svelte          # Message list display
│   │   │   ├── preview-message.svelte   # Individual message + tool calls
│   │   │   ├── multimodal-input.svelte  # Chat input
│   │   │   └── canvas.svelte            # Canvas rendering component
│   │   ├── server/
│   │   │   └── ai/
│   │   │       ├── models.ts            # AI model configuration
│   │   │       ├── tools.ts             # AI tool definitions
│   │   │       └── prompts.ts           # System prompts
│   │   └── canvas-utils.ts              # Canvas utility functions
│   └── routes/
│       ├── api/
│       │   └── chat/
│       │       └── +server.ts           # Chat API endpoint
│       ├── +page.svelte                 # Main page (chat + canvas)
│       └── +layout.svelte               # Root layout
└── package.json
```

## How It Works

1. **User sends a message** in the chat interface
2. **Message is sent to `/api/chat`** endpoint
3. **AI processes the message** with access to tools:
   - `generateCanvasGraphics`: Creates JavaScript code for canvas graphics
   - `webfontloadertool`: Loads Google Fonts
4. **Tool results are dispatched as events** from `preview-message.svelte`
5. **Canvas component listens for events** and executes the generated code
6. **Graphics are rendered** on the 4K canvas in real-time

## Key Components

### Chat Component (`chat.svelte`)
- Manages the chat state using AI SDK's `Chat` class
- Handles message submission and streaming
- Displays messages and input

### Canvas Component (`canvas.svelte`)
- Renders AI-generated graphics code
- Provides animation playback controls
- Handles code execution in a safe context

### API Endpoint (`api/chat/+server.ts`)
- Streams AI responses using AI SDK
- Executes tools when called by the AI
- Returns structured data for canvas rendering

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key for Claude | Yes |

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm check` - Run type checking

## Tech Stack

- **SvelteKit** - Web framework
- **Svelte 5** - UI framework with runes
- **AI SDK** - Vercel's AI SDK for LLM integration
- **Anthropic Claude** - LLM provider
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **GSAP** - Animation library (optional, for advanced graphics)

## Next Steps

To extend this minimal setup:

1. Add authentication (from valuva-app)
2. Add database persistence for chat history
3. Add more tools (image generation, data visualization, etc.)
4. Add timeline controls for canvas animations
5. Add export functionality (PNG sequences, video)
6. Add more sophisticated canvas utilities

## Differences from valuva-app

This is a **minimal** version that includes only:
- Core LLM functionality
- Essential chat UI
- Basic canvas rendering

It **excludes**:
- Authentication system
- Database (Drizzle ORM, Postgres)
- File uploads
- Chat history persistence
- Advanced UI components (shadcn-svelte)
- Export functionality
- Timeline controls
- Advanced canvas utilities

These can be added incrementally as needed.
