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