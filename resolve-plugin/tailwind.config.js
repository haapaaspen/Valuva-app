/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import aspectRatio from '@tailwindcss/aspect-ratio';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    // The ./routes/... path was here, ensure this content array correctly
    // points to all files where you use Tailwind classes.
    // For SvelteKit, "./src/**/*.{html,js,svelte,ts}" usually covers src/routes.
  ],
  theme: {
    extend: {
      colors: {
        'blue': 'oklch(0.77 0.1173 260.05)',
        'eggplant-darkest': 'oklch(0.23 0.0179 338.75)',
        'eggplant-dark': 'oklch(0.28 0.0057 337.67)',
        'eggplant-darkish': 'oklch(0.35 0.0101 319.45)',
      },
    },
  },
  plugins: [
    forms, // Was require('@tailwindcss/forms')
    typography, // Was require('@tailwindcss/typography')
    aspectRatio, // Was require('@tailwindcss/aspect-ratio')
    // Original comments from your file can remain or be cleaned up:
    // If your @plugin directives in app.css (like @tailwindcss/forms)
    // still require JavaScript configuration in Tailwind v4, add them here.
    // e.g., require('@tailwindcss/forms'),
    // Check the v4 documentation for each plugin you use.
    // For many, the @plugin CSS directive might be sufficient.
  ],
}