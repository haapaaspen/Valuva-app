<script lang="ts">
	import { cn } from '$lib/utils/shadcn';
	import SparklesIcon from '../icons/sparkles.svelte';
	import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
	import { Button } from '../ui/button';
	import PencilEditIcon from '../icons/pencil-edit.svelte';
	import PreviewAttachment from '../preview-attachment.svelte';
	import { Markdown } from '../markdown';
	import MessageReasoning from '../message-reasoning.svelte';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import type { UIMessage } from '@ai-sdk/svelte';
	import { Card, CardContent } from '../ui/card';

	let { message, readonly, loading }: { message: UIMessage; readonly: boolean; loading: boolean } =
		$props();

	let mode = $state<'view' | 'edit'>('view');
	let loadedFonts = $state<Set<string>>(new Set());
	
	// Auto-load graphics when they're generated
	function loadGraphicsToCanvas(data: any) {
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new CustomEvent('graphicsGenerated', {
				detail: {
					code: data.code,
					duration: data.duration,
					title: data.title
				}
			}));
		}
	}

	// Load fonts into the page for preview
	function loadFontsForPreview(families: string[]) {
		if (typeof window === 'undefined') return;
		
		// Create a script element to load WebFont if not already loaded
		if (!(window as any).WebFont) {
			const script = document.createElement('script');
			script.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
			script.onload = () => loadFontsWithWebFont(families);
			document.head.appendChild(script);
		} else {
			loadFontsWithWebFont(families);
		}
	}

	function loadFontsWithWebFont(families: string[]) {
		const webFont = (window as any).WebFont;
		if (!webFont) return;
		
		webFont.load({
			google: { families },
			active: () => {
				// Mark fonts as loaded
				families.forEach(family => {
					const fontName = family.split(':')[0];
					loadedFonts.add(fontName);
				});
				loadedFonts = new Set(loadedFonts); // Trigger reactivity
			},
			inactive: () => {
				console.log('Some fonts failed to load');
			}
		});
	}
</script>

<div
	class="group/message mx-auto w-full max-w-3xl px-4"
	data-role={message.role}
	in:fly|global={{ opacity: 0, y: 5 }}
>
	<div
		class={cn(
			'flex w-full gap-4 group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl',
			{
				'w-full': mode === 'edit',
				'group-data-[role=user]/message:w-fit': mode !== 'edit'
			}
		)}
	>
		{#if message.role === 'assistant'}
			<div
				class="flex size-8 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border"
			>
				<div class="translate-y-px">
					<SparklesIcon size={14} />
				</div>
			</div>
		{/if}

		<div class="flex w-full flex-col gap-4">
			{#if message.experimental_attachments && message.experimental_attachments.length > 0}
				<div class="flex flex-row justify-end gap-2">
					{#each message.experimental_attachments as attachment (attachment.url)}
						<PreviewAttachment {attachment} />
					{/each}
				</div>
			{/if}

			{#each message.parts as part, i (`${message.id}-${i}`)}
				{@const { type } = part}
				{#if type === 'reasoning'}
					<MessageReasoning {loading} reasoning={part.reasoning} />
				{:else if type === 'text'}
					{#if mode === 'view'}
						<div class="flex flex-row items-start gap-2">
							{#if message.role === 'user' && !readonly}
								<Tooltip>
									<TooltipTrigger>
										{#snippet child({ props })}
											<Button
												{...props}
												variant="ghost"
												class="h-fit rounded-full px-2 text-muted-foreground opacity-0 group-hover/message:opacity-100"
												onclick={() => {
													mode = 'edit';
												}}
											>
												<PencilEditIcon />
											</Button>
										{/snippet}
									</TooltipTrigger>
									<TooltipContent>Edit message</TooltipContent>
								</Tooltip>
							{/if}
							<div
								class={cn('flex flex-col gap-4', {
									'rounded-xl bg-primary px-3 py-2 text-primary-foreground': message.role === 'user'
								})}
							>
								<Markdown md={part.text} />
							</div>
						</div>
					{:else if mode === 'edit'}
						<div class="flex flex-row items-start gap-2">
							<div class="size-8"></div>

							<!-- TODO -->
							<!-- <MessageEditor key={message.id} {message} {setMode} {setMessages} {reload} /> -->
						</div>
					{/if}

					{:else if type === 'tool-invocation'}
					{@const { toolInvocation } = part}
					{@const { toolName, state } = toolInvocation}

					{#if state === 'call'}
						{@const { args } = toolInvocation}
						<div
							class={cn({
								skeleton: toolName !== undefined // Apply skeleton to any tool call
							})}
						>
							{#if toolName === 'generateCanvasGraphics'}
								<Card class="bg-muted/50">
									<CardContent class="p-4">
										<div class="flex items-center gap-2 text-sm text-muted-foreground">
											<div class="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
											Generating canvas graphics{args.title ? `: ${args.title}` : '...'}
										</div>
									</CardContent>
								</Card>
							{:else if toolName === 'webfontloadertool'}
								<Card class="bg-muted/50">
									<CardContent class="p-4">
										<div class="flex items-center gap-2 text-sm text-muted-foreground">
											<div class="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
											Loading web fonts: {args.families.join(', ')}
										</div>
									</CardContent>
								</Card>
							{:else}
								<!-- Fallback for any other tools -->
								<Card class="bg-muted/50">
									<CardContent class="p-4">
										<div class="flex items-center gap-2 text-sm text-muted-foreground">
											<div class="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
											Using tool: {toolName}...
										</div>
									</CardContent>
								</Card>
							{/if}
						</div>
					{:else if state === 'result'}
					{@const { result } = toolInvocation}
						<div>
							{#if toolName === 'generateCanvasGraphics'}
								<Card class="bg-muted/50">
									<CardContent class="p-4">
										<div class="flex items-center gap-2 text-sm font-medium text-primary mb-2">
											<div class="h-2 w-2 rounded-full bg-primary"></div>
											Graphics Generated: {result.data.title}
										</div>
										<div class="text-xs text-muted-foreground">
											Duration: {result.data.duration}s • Generated at {new Date(result.data.timestamp).toLocaleTimeString()}
										</div>
										<div class="mt-2 flex gap-2">
											<Button 
												variant="default"
												size="sm"
												onclick={() => {
													loadGraphicsToCanvas(result.data);
												}}
											>
												Load to Canvas
											</Button>
											<span class="text-xs text-muted-foreground flex items-center">
												✓ Auto-loaded to canvas
											</span>
										</div>
									</CardContent>
								</Card>
								{#key result.data.timestamp}
									{setTimeout(() => loadGraphicsToCanvas(result.data), 100), ''}
								{/key}
							{:else if toolName === 'webfontloadertool'}
								<Card class="bg-muted/50">
									<CardContent class="p-4">
										<div class="flex items-center gap-2 text-sm font-medium text-primary mb-2">
											<div class="h-2 w-2 rounded-full bg-primary"></div>
											Fonts Loaded Successfully
										</div>
										<div class="text-xs text-muted-foreground mb-3">
											Loaded {result.data.fontNames.length} font families • {new Date(result.data.timestamp || Date.now()).toLocaleTimeString()}
										</div>
										
										<!-- Trigger font loading for preview -->
										{loadFontsForPreview(result.data.families), ''}
										
										<!-- Display each loaded font with preview -->
										<div class="space-y-3">
											{#each result.data.fontNames as fontName}
												<div class="border rounded-lg p-3 bg-background">
													<div class="text-xs font-medium text-muted-foreground mb-1">
														{fontName}
													</div>
													<div class="text-lg font-medium transition-all duration-300" 
														 style="font-family: '{fontName}'{loadedFonts.has(fontName) ? '' : ', sans-serif'}">
														The quick brown fox jumps over the lazy dog
													</div>
													<div class="text-sm text-muted-foreground mt-1 transition-all duration-300" 
														 style="font-family: '{fontName}'{loadedFonts.has(fontName) ? '' : ', sans-serif'}">
														ABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890
													</div>
													{#if !loadedFonts.has(fontName)}
														<div class="text-xs text-yellow-600 mt-1 flex items-center gap-1">
															<div class="h-1 w-1 rounded-full bg-yellow-500 animate-pulse"></div>
															Loading font...
														</div>
													{:else}
														<div class="text-xs text-green-600 mt-1 flex items-center gap-1">
															<div class="h-1 w-1 rounded-full bg-green-500"></div>
															Font loaded
														</div>
													{/if}
												</div>
											{/each}
										</div>
									</CardContent>
								</Card>
							{:else}
								<Card class="bg-muted/50">
									<CardContent class="p-4">
										<div class="flex items-center gap-2 text-sm font-medium text-primary mb-2">
											<div class="h-2 w-2 rounded-full bg-primary"></div>
											Tool Completed: {toolName}
										</div>
										<div class="text-xs text-muted-foreground">
											Result: {typeof result === 'object' ? JSON.stringify(result).substring(0, 100) + '...' : result}
										</div>
									</CardContent>
								</Card>
							{/if}
						</div>
					{/if}
				{/if}
			{/each}

			<!-- TODO -->
			<!-- {#if !readonly}
				<MessageActions key={`action-${message.id}`} {chatId} {message} {vote} {isLoading} />
			{/if} -->
		</div>
	</div>
</div>
