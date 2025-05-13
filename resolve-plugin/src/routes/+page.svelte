<script lang="ts">
    import type { PageData } from './$types';
    import { getContext } from 'svelte';
    import type { ResolveApiController } from '$lib/resolveBridge';

    let { data }: { data: PageData } = $props();
    
    const resolveApi = getContext<ResolveApiController>('resolveApi');
    
    let binName = '';
    let binDescription = '';
    let isCreating = false;
    let error = '';
    let success = '';
    
    async function createBin() {
        if (!binName) {
            error = 'Bin name is required';
            return;
        }
        
        isCreating = true;
        error = '';
        success = '';
        
        try {
            await resolveApi.createBin(binName);
            success = `Bin "${binName}" created successfully!`;
            binName = '';
            binDescription = '';
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to create bin';
        } finally {
            isCreating = false;
        }
    }
</script>

<button onclick={createBin}>Create Bin</button>