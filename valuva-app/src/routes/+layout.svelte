<script lang="ts">
	import '../app.css';
	import { ThemeProvider } from '@sejohnson/svelte-themes';
	import { Toaster } from '$lib/components/ui/sonner';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(async () => {
		// Load GSAP from CDN and make it global
		if (typeof window !== 'undefined' && !window.gsap) {
			try {
				// Create script tag for GSAP with all plugins
				const script = document.createElement('script');
				script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/all.min.js';
				
				script.onload = () => {
					// Register all plugins once loaded
					window.gsap.registerPlugin(
						window.TextPlugin,
						window.ScrambleTextPlugin,
						window.SplitText,
						window.MotionPathPlugin,
						window.DrawSVGPlugin,
						window.MorphSVGPlugin,
						window.Physics2DPlugin,
						window.CustomEase,
						window.CustomBounce,
						window.CustomWiggle,
						window.Flip
					);
					
					console.log('✅ GSAP loaded globally with all plugins');
					
					// Dispatch custom event so other components know GSAP is ready
					window.dispatchEvent(new CustomEvent('gsapLoaded'));
				};
				
				script.onerror = () => {
					console.error('❌ Failed to load GSAP');
				};
				
				document.head.appendChild(script);
			} catch (error) {
				console.error('Error loading GSAP:', error);
			}
		}
	});
</script>

<ThemeProvider attribute="class" disableTransitionOnChange>
	<Toaster position="top-center" />
	{@render children()}
</ThemeProvider>
