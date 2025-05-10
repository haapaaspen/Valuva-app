/** @type {import('svelte/compiler').CompileOptions} */
const config = {
  // Consult https://svelte.dev/docs#compile-time
  // for more information about preprocessors
  compilerOptions: {
    dev: process.env.NODE_ENV !== 'production',
  }
};

export default config; 