<script>
	import BlockRenderer from '$lib/components/BlockRenderer.svelte';
	import { topics } from '$lib/data/topics';

	let { data } = $props();

	const topic = $derived(data.topic);
	const idx = $derived(topics.findIndex((t) => t.slug === topic.slug));
	const prev = $derived(idx > 0 ? topics[idx - 1] : null);
	const next = $derived(idx < topics.length - 1 ? topics[idx + 1] : null);

	const toc = $derived(
		topic.blocks
			.filter((b) => b.type === 'h3' || b.type === 'h2')
			.map((b) => ({
				id: b.text
					.replace(/<[^>]+>/g, '')
					.trim()
					.replace(/\s+/g, '-'),
				text: b.text
			}))
	);
</script>

<svelte:head>
	<title>{topic.title} · AWS-Quiz-CPE</title>
	<meta name="description" content={topic.desc} />
</svelte:head>

<article class="pt-12">
	<p class="text-[13px] font-medium text-accent-deep">{topic.kicker}</p>
	<h1 class="mt-2 max-w-[22ch] text-[27px] leading-snug font-bold">{topic.title}</h1>

	{#if toc.length > 2}
		<nav aria-label="สารบัญหน้านี้" class="mt-6 rounded-xl border border-line bg-surface px-5 py-4">
			<p class="text-[12.5px] font-semibold text-muted">ในหน้านี้</p>
			<ul class="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
				{#each toc as item (item.id)}
					<li>
						<a
							href="#{item.id}"
							class="text-[13.5px] text-ink/80 underline decoration-line underline-offset-4 hover:text-accent-deep"
						>
							{@html item.text}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	{/if}

	<div class="mt-8">
		<BlockRenderer blocks={topic.blocks} />
	</div>
</article>

<nav
	aria-label="หัวข้อก่อนหน้าและถัดไป"
	class="mt-14 grid gap-3 border-t border-line pt-6 sm:grid-cols-2"
>
	{#if prev}
		<a
			href="/summary/{prev.slug}"
			class="btn-lift group flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3.5 hover:border-accent/60 hover:bg-accent-soft/40"
		>
			<span
				class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors group-hover:border-accent group-hover:text-accent-deep"
				aria-hidden="true"
			>
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none">
					<path
						d="M20 12H4m0 0 5-5m-5 5 5 5"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</span>
			<span class="min-w-0">
				<span class="block text-[12px] text-muted">หัวข้อก่อนหน้า</span>
				<span
					class="mt-0.5 block truncate text-[14.5px] font-semibold group-hover:text-accent-deep"
				>
					{prev.title}
				</span>
			</span>
		</a>
	{/if}
	{#if next}
		<a
			href="/summary/{next.slug}"
			class="btn-lift group flex items-center justify-end gap-3 rounded-xl border border-line bg-surface px-4 py-3.5 text-right hover:border-accent/60 hover:bg-accent-soft/40 sm:col-start-2"
		>
			<span class="min-w-0">
				<span class="block text-[12px] text-muted">ถัดไป</span>
				<span
					class="mt-0.5 block truncate text-[14.5px] font-semibold group-hover:text-accent-deep"
				>
					{next.title}
				</span>
			</span>
			<span
				class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors group-hover:border-accent group-hover:text-accent-deep"
				aria-hidden="true"
			>
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none">
					<path
						d="M4 12h16m0 0-5-5m5 5-5 5"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</span>
		</a>
	{/if}
</nav>
