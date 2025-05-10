import { writable, derived } from 'svelte/store';
import { generateId } from '$lib/utils/idGenerator';

// Store for guided prompts
export const guidedPrompts = writable<GuidedPrompt[]>([
  {
    id: generateId(),
    type: 'main-title',
    text: '',
    style: ''
  }
]);

// Store for the general context/instructions
export const generalPrompt = writable('');

// Store for chat messages
export const chatMessages = writable<ChatMessage[]>([]);

// Store for chat mode
export const chatMode = writable<'brainstorm' | 'create'>('brainstorm');

// Core idea summary
export const coreIdea = writable('');

// Design artifacts returned by AI
export const designArtifacts = writable<DesignArtifact[]>([]);

// Currently selected artifact
export const selectedArtifact = writable<string | null>(null);

// Helper functions
export function addGuidedPrompt() {
  guidedPrompts.update(prompts => [
    ...prompts,
    {
      id: generateId(),
      type: 'secondary-title',
      text: '',
      style: ''
    }
  ]);
}

export function removeGuidedPrompt(id: string) {
  guidedPrompts.update(prompts => prompts.filter(prompt => prompt.id !== id));
}

export function updateGuidedPrompt(id: string, field: 'text' | 'style', value: string) {
  guidedPrompts.update(prompts => 
    prompts.map(prompt => 
      prompt.id === id ? { ...prompt, [field]: value } : prompt
    )
  );
}

export function addUserMessage(content: string, attachments: string[] = []) {
  const message: ChatMessage = {
    id: generateId(),
    role: 'user',
    content,
    timestamp: Date.now(),
    attachments
  };
  
  chatMessages.update(messages => [...messages, message]);
  return message.id;
}

export function addAssistantMessage(content: string) {
  const message: ChatMessage = {
    id: generateId(),
    role: 'assistant',
    content,
    timestamp: Date.now()
  };
  
  chatMessages.update(messages => [...messages, message]);
  return message.id;
}

export function addDesignArtifact(artifact: Omit<DesignArtifact, 'id'>) {
  const newArtifact: DesignArtifact = {
    ...artifact,
    id: generateId()
  };
  
  designArtifacts.update(artifacts => [...artifacts, newArtifact]);
  return newArtifact.id;
}

export function startNewChat() {
  guidedPrompts.set([
    {
      id: generateId(),
      type: 'main-title',
      text: '',
      style: ''
    }
  ]);
  generalPrompt.set('');
  chatMessages.set([]);
  coreIdea.set('');
  designArtifacts.set([]);
  selectedArtifact.set(null);
  chatMode.set('brainstorm');
} 