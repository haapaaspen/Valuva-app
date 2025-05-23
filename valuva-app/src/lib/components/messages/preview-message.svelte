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

	let { message, readonly, loading }: { message: UIMessage; readonly: boolean; loading: boolean } =
		$props();

	let mode = $state<'view' | 'edit'>('view');
	
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
								skeleton: ['generateCanvasGraphics'].includes(toolName)
							})}
						>
							{#if toolName === 'generateCanvasGraphics'}
								<div class="rounded-lg border bg-muted/50 p-4">
									<div class="flex items-center gap-2 text-sm text-muted-foreground">
										<div class="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
										Generating canvas graphics: {args.title}
									</div>
								</div>
							{/if}
						</div>
					{:else if state === 'result'}
					{@const { result } = toolInvocation}
						<div>
							{#if toolName === 'generateCanvasGraphics'}
								<div class="rounded-lg border bg-green-50 p-4">
									<div class="flex items-center gap-2 text-sm font-medium text-green-700 mb-2">
										<div class="h-2 w-2 rounded-full bg-green-500"></div>
										Graphics Generated: {result.data.title}
									</div>
									<div class="text-xs text-green-600">
										Duration: {result.data.duration}s • Generated at {new Date(result.data.timestamp).toLocaleTimeString()}
									</div>
									<div class="mt-2 flex gap-2">
										<button 
											class="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
											onclick={() => {
												loadGraphicsToCanvas(result.data);
											}}
										>
											Load to Canvas
										</button>
										<span class="text-xs text-green-600 flex items-center">
											✓ Auto-loaded to canvas
										</span>
									</div>
								</div>
								{#key result.data.timestamp}
									{setTimeout(() => loadGraphicsToCanvas(result.data), 100), ''}
								{/key}
							{:else}
								<pre>{JSON.stringify(result, null, 2)}</pre>
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
