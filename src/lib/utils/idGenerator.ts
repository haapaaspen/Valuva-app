/**
 * Simple utility to generate unique IDs
 * Not cryptographically secure, but enough for our purposes
 */

let counter = 0;

/**
 * Generates a unique ID with a timestamp and counter
 */
export function generateId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 7);
  const counterStr = (counter++).toString(36);
  
  return `id-${timestamp}-${randomPart}-${counterStr}`;
} 