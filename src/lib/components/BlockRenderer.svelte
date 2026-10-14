<script>
	import DiagramRAG from './diagrams/DiagramRAG.svelte';
	import DiagramALB from './diagrams/DiagramALB.svelte';
	import DiagramSubnetBlocks from './diagrams/DiagramSubnetBlocks.svelte';
	import DiagramDynamoDBKey from './diagrams/DiagramDynamoDBKey.svelte';

	let { blocks } = $props();

	const diagrams = {
		'rag-pipeline': DiagramRAG,
		'alb-multi-az': DiagramALB,
		'subnet-blocks': DiagramSubnetBlocks,
		'dynamodb-keys': DiagramDynamoDBKey
	};

	const anchor = (text) =>
		text
			.replace(/<[^>]+>/g, '')
			.trim()
			.replace(/\s+/g, '-');
</script>

{#snippet itemBody(item, depth)}
	<div class="text-[15px] leading-[1.85] [&_a]:text-accent-deep [&_a]:underline">
		{@html item.text}
	</div>
	{#if item.plain?.length}
		{#each item.plain as ptext (ptext)}
			<p class="mt-1 text-[14.5px] leading-[1.85] text-ink/80">{@html ptext}</p>
		{/each}
	{/if}
	{#if item.children}
		<div class="mt-1.5">
			{@render renderGroup(item.children, depth + 1)}
		</div>
	{/if}
{/snippet}

{#snippet renderGroup(group, depth)}
	{#if group.ordered}
		<ol
			class="list-decimal space-y-2 {depth === 0
				? 'pl-7'
				: 'ml-6 pl-6'} marker:font-medium marker:text-muted"
		>
			{#each group.items as item (item.text)}
				<li>
					{@render itemBody(item, depth)}
				</li>
			{/each}
		</ol>
	{:else}
		<ul class="list-none space-y-2 {depth === 0 ? '' : 'ml-6'}">
			{#each group.items as item (item.text)}
				<li class="relative {depth === 0 ? 'pl-6' : 'pl-5'}">
					<span
						class="absolute top-[.7em] left-0 {depth === 0
							? 'h-2 w-2'
							: 'h-1.5 w-1.5'} rounded-full border {depth === 0
							? 'border-accent'
							: 'border-muted'} bg-transparent"
						aria-hidden="true"
					></span>
					{@render itemBody(item, depth)}
				</li>
			{/each}
		</ul>
	{/if}
{/snippet}

<div class="summary-blocks">
	{#each blocks as block, i (i)}
		{#if block.type === 'h2'}
			<h2
				id={anchor(block.text)}
				class="mt-12 scroll-mt-20 border-b border-line pb-2 text-[21px] leading-snug font-semibold"
			>
				{@html block.text}
			</h2>
		{:else if block.type === 'h3'}
			<h3 id={anchor(block.text)} class="mt-9 scroll-mt-20 text-[17px] leading-snug font-semibold">
				{@html block.text}
			</h3>
		{:else if block.type === 'h4'}
			<h4 class="mt-7 text-[15.5px] leading-snug font-semibold">{@html block.text}</h4>
		{:else if block.type === 'p'}
			<p class="mt-4 text-[15px] leading-[1.9] [&_a]:text-accent-deep [&_a]:underline">
				{@html block.text}
			</p>
		{:else if block.type === 'list'}
			<div class="mt-4">
				{@render renderGroup(block.list, 0)}
			</div>
		{:else if block.type === 'table'}
			<div class="mt-5 overflow-x-auto rounded-lg border border-line bg-surface">
				<table class="w-full border-collapse text-[14px] leading-normal">
					<thead>
						<tr>
							{#each block.header as cell (cell)}
								<th class="border-b-2 border-ink px-4 py-2.5 text-left font-semibold"
									>{@html cell}</th
								>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each block.rows as row, row_index (row_index)}
							<tr>
								{#each row as cell (cell)}
									<td class="border-b border-line px-4 py-2.5 align-top">{@html cell}</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else if block.type === 'callout'}
			<aside
				class="mt-5 rounded-r-lg border-l-[3px] border-accent bg-surface px-4 py-3 text-[14px] leading-[1.9] whitespace-pre-line text-ink/85"
			>
				{@html block.text}
			</aside>
		{:else if block.type === 'code'}
			<pre
				class="mt-5 overflow-x-auto rounded-lg border border-line bg-[#f4f0e3] p-4 text-[13px] leading-relaxed dark:bg-[#181920]"><code
					>{@html block.text}</code
				></pre>
		{:else if block.type === 'checklist'}
			<ul class="mt-4 space-y-2.5">
				{#each block.items as item (item)}
					<li class="flex items-start gap-3 text-[15px] leading-[1.8]">
						<span
							class="mt-[5px] h-[17px] w-[17px] shrink-0 rounded-[4px] border-2 border-muted/60 bg-surface"
							aria-hidden="true"
						></span>
						{@html item}
					</li>
				{/each}
			</ul>
		{:else if block.type === 'diagram'}
			{@const Diagram = diagrams[block.id]}
			{#if Diagram}
				<figure class="mt-8">
					<Diagram />
				</figure>
			{/if}
		{/if}
	{/each}
</div>

<style>
	.summary-blocks > :first-child {
		margin-top: 0;
	}
	.summary-blocks :global(strong) {
		font-weight: 600;
	}
	.summary-blocks :global(a) {
		overflow-wrap: anywhere;
	}
	.summary-blocks :global(code) {
		overflow-wrap: anywhere;
	}
</style>
