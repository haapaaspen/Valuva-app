# Canvas Graphics Examples

This directory contains example JavaScript files that are **dynamically loaded** into the AI canvas graphics prompt. The examples are automatically included in the prompt every time it's generated.

## How It Works

1. **Dynamic Loading**: The `load-examples.ts` file automatically reads all `.js` files from this directory
2. **Auto-Formatting**: Each example is formatted with proper markdown code blocks for the prompt
3. **File-Based Management**: Simply add new `.js` files here to expand the example library

## Current Examples

### `custom-fonts.js`
- Demonstrates loading Google Fonts and custom fonts
- Shows proper fallback font handling
- Typography hierarchy with multiple font families
- Error handling for font loading failures

## Adding New Examples

To add a new example:

1. Create a new `.js` file in this directory
2. Include descriptive comments at the top
3. Use proper canvas animation structure
4. Follow variable declaration rules (see below)
5. The file will automatically be included in the next prompt generation

## Variable Declaration Rules

**⚠️ CRITICAL: Never declare these pre-provided variables:**
- `width` - Canvas width (1920px)
- `height` - Canvas height (1080px)  
- `ctx` - 2D rendering context
- `canvas` - HTML canvas element
- `utils` - Utility object with methods

**✅ DO declare these variables:**
- `const duration = 10;` - Animation loop duration
- Helper variables: `const centerX = width / 2;`
- Animation state: `const progress = cycle_t / duration;`
- Custom objects: `const particles = [];`

## Font Usage Guidelines

When creating examples with custom fonts:

- **Load fonts asynchronously** before starting animations
- **Always provide fallback fonts** for better compatibility
- **Check font availability** using `utils.fonts[fontName]`
- **Use appropriate font combinations** for visual hierarchy
- **Handle loading errors gracefully** with try/catch

## File Naming Convention

- Use kebab-case for filenames (e.g., `custom-fonts.js`)
- The filename will be converted to a readable title automatically
- Keep names descriptive but concise

## Notes

- Linter errors are expected since these are code snippets for AI context
- Examples should be self-contained and demonstrate specific techniques
- Focus on visual creativity and technical excellence
- Include comments explaining artistic intent and technical details 