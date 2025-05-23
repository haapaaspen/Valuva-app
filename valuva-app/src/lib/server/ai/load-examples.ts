import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

export interface CanvasExample {
  name: string;
  filename: string;
  code: string;
}

export function loadCanvasExamples(): CanvasExample[] {
  // Try different path approaches to find the examples directory
  const possiblePaths = [
    // Direct relative path from current working directory
    join(process.cwd(), 'src/lib/server/ai/examples-added-to-prompt'),
    // Alternative path structure
    join(process.cwd(), 'valuva-app/src/lib/server/ai/examples-added-to-prompt'),
    // Resolve from current directory
    resolve('./src/lib/server/ai/examples-added-to-prompt'),
    resolve('./valuva-app/src/lib/server/ai/examples-added-to-prompt')
  ];

  let examplesDir = '';
  
  // Find the first existing path
  for (const path of possiblePaths) {
    if (existsSync(path)) {
      examplesDir = path;
      console.log(`Found examples directory at: ${path}`);
      break;
    }
  }

  if (!examplesDir) {
    console.log(`Examples directory not found. Tried paths:
${possiblePaths.map(p => `  - ${p}`).join('\n')}
Continuing without examples.`);
    return [];
  }

  try {
    const files = readdirSync(examplesDir);
    const jsFiles = files.filter(file => file.endsWith('.js'));
    
    if (jsFiles.length === 0) {
      console.log('No .js example files found in examples directory - this is normal when no examples are added yet');
      return [];
    }

    console.log(`Loading ${jsFiles.length} canvas examples: ${jsFiles.join(', ')}`);

    return jsFiles.map(filename => {
      try {
        const code = readFileSync(join(examplesDir, filename), 'utf-8');
        const name = filename.replace('.js', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        return {
          name,
          filename,
          code
        };
      } catch (fileError) {
        console.warn(`Failed to read example file ${filename}:`, fileError);
        return null;
      }
    }).filter((example): example is CanvasExample => example !== null);
  } catch (error) {
    console.warn('Failed to read examples directory:', error);
    return [];
  }
}

export function formatExamplesForPrompt(examples: CanvasExample[]): string {
  if (examples.length === 0) {
    return '';
  }

  return examples.map((example, index) => 
    `### Example ${index + 1}: ${example.name}
\\\`\\\`\\\`javascript
${example.code}
\\\`\\\`\\\``
  ).join('\n\n');
} 