<script lang="ts">
    import type { PageData } from './$types';
    import { getContext } from 'svelte';
    import type { ResolveApiController } from '$lib/resolveBridge';

    let { data }: { data: PageData } = $props();
    
    const resolveApi = getContext<ResolveApiController>('resolveApi');
    
    let binName = $state('TestBin123'); // Pre-fill for quick testing
    let binDescription = $state('');
    let isCreating = $state(false);
    let error = $state('');
    let success = $state('');
    
    async function createBin() {
        console.log('Create Bin button clicked. Attempting to create bin with name:', binName);
        if (!binName) {
            error = 'Bin name is required';
            console.error(error);
            return;
        }
        
        isCreating = true;
        error = '';
        success = '';
        
        try {
            const result = await resolveApi.createBin(binName);
            console.log('API call result:', result);
            if (result && result.success) {
                success = `Bin "${result.name || binName}" created successfully!`;
                binName = '';
                binDescription = '';
            } else {
                error = `Failed to create bin: ${result ? result.message || 'Unknown error' : 'Unknown error'}`;
            }
        } catch (err) {
            console.error('Error during createBin API call:', err);
            error = err instanceof Error ? err.message : 'Failed to create bin via API call';
        } finally {
            isCreating = false;
        }
    }
</script>

<input type="text" bind:value={binName} placeholder="Enter bin name" />
<button onclick={createBin} disabled={isCreating}>
    {#if isCreating}Creating...{:else}Create Bin{/if}
</button>

{#if error}<p style="color: red;">Error: {error}</p>{/if}
{#if success}<p style="color: green;">{success}</p>{/if}