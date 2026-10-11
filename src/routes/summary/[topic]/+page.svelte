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
			class="group rounded-lg px-3 py-2 transition-colors hover:bg-surface"
		>
			<p class="text-[12px] text-muted">หัวข้อก่อนหน้า</p>
			<p class="mt-0.5 text-[14.5px] font-medium group-hover:text-accent-deep">{prev.title}</p>
		</a>
	{/if}
	{#if next}
		<a
			href="/summary/{next.slug}"
			class="group rounded-lg px-3 py-2 text-right transition-colors hover:bg-surface sm:col-start-2"
		>
			<p class="text-[12px] text-muted">ถัดไป</p>
			<p class="mt-0.5 text-[14.5px] font-medium group-hover:text-accent-deep">{next.title}</p>
		</a>
	{/if}
</nav>
