<script lang="ts">
    import {
        exportStatus,
        exportVideo,
        exportPngSequence,
    } from "$lib/services/exporter-service.svelte";

    let showDropdown = $state(false);
    let dropdownEl: HTMLDivElement | undefined;

    function handleExport(type: "video" | "png") {
        showDropdown = false;
        if (type === "video") {
            exportVideo();
        } else {
            exportPngSequence();
        }
    }

    function handleClickOutside(event: MouseEvent) {
        if (dropdownEl && !dropdownEl.contains(event.target as Node)) {
            showDropdown = false;
        }
    }

    $effect(() => {
        if (showDropdown) {
            document.addEventListener("click", handleClickOutside);
            return () => {
                document.removeEventListener("click", handleClickOutside);
            };
        }
    });
</script>

<div class="relative" bind:this={dropdownEl}>
    <button
        class="text-sm border border-primary rounded-md px-4 py-2 hover:border-primary/90 flex items-center gap-2 transition-colors {showDropdown
            ? 'bg-background'
            : ''}"
        disabled={exportStatus.isExporting}
        onclick={(e) => {
            e.stopPropagation();
            showDropdown = !showDropdown;
        }}
        title="Export animation"
    >
        {#if exportStatus.isExporting}
            <span>Exporting... {exportStatus.progress}%</span>
        {:else}
            <span>Export</span>
            <svg
                class="w-4 h-4 transition-transform {showDropdown
                    ? 'rotate-180'
                    : ''}"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                />
            </svg>
        {/if}
    </button>

    {#if showDropdown && !exportStatus.isExporting}
        <div
            class="absolute right-0 bottom-full mb-2 w-48 bg-background border border-border rounded-md shadow-lg z-50 overflow-hidden"
        >
            <button
                class="w-full text-left px-4 py-2 text-sm border-b border-border hover:bg-primary/10 transition-colors flex flex-col gap-0.5"
                onclick={() => handleExport("video")}
            >
                <span class="font-medium">Export Video</span>
                <span class="text-xs text-foreground/50">WebM format</span>
            </button>
            <button
                class="w-full text-left px-4 py-2 text-sm hover:bg-primary/10 transition-colors flex flex-col gap-0.5"
                onclick={() => handleExport("png")}
            >
                <span class="font-medium">Export PNG Sequence</span>
                <span class="text-xs text-foreground/50">ZIP archive</span>
            </button>
        </div>
    {/if}
</div>
