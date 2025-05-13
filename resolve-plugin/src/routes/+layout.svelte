<script lang="ts">
	import '../app.css';
	import { setContext } from 'svelte';
	import { resolveApiControllerInstance } from '$lib/resolveBridge';
	import type { ResolveApiController } from '$lib/resolveBridge';

	let { children } = $props();

	setContext('resolveApi', resolveApiControllerInstance);
</script>

{@render children()}
