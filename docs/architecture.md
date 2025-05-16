

## SvelteKit Full-Stack: 
- Frontend `(routes/(app)/chat/[chatId]/+page.svelte`, `lib/components/`
- Backend `(routes/(app)/api/chat/+server.ts`, `lib/server/`



# Final server integration
Implemented during the final stages of production. Before that, this serves as a reference.

## Motivation
This protects our LLM API keys because they never leave the Valuva server.

## System Interaction

```
┌─────────────┐       ┌─────────────┐      ┌──────────────┐
│  User's     │       │  Valuva     │      │   LLM        │
│  Computer   │       │  Server     │      │   Provider   │
└─────┬───────┘       └─────┬───────┘      └──────┬───────┘
      │                     │                     │
      │  1. Request token   │                     │
      │────────────────────>│                     │
      │                     │                     │
      │  2. Receive token   │                     │
      │<────────────────────│                     │
      │                     │                     │
      │                     │                     │
      │  3. Send AI Request │                     │
      │   (with Valuva token)                     │
      │────────────────────>│                     │
      │                     │ 4. Validate Valuva token
      │                     │ 5. Use secure LLM API key
      │                     │    to make LLM request
      │                     │────────────────────>│
      │                     │                     │ 6. LLM Response
      │                     │<────────────────────│
      │                     │                     │ 7. Stream/Send LLM Response
      │                     │<────────────────────│    back to client
      │                     │                     │
```