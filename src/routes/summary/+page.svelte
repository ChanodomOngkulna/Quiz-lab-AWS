<script>
	import { topics, topicGroups } from '$lib/data/topics';

	const bySlug = Object.fromEntries(topics.map((t) => [t.slug, t]));

	const labNum = (slug) => {
		const idx = topicGroups[0].slugs.indexOf(slug);
		return idx >= 0 ? idx + 1 : null;
	};
</script>

<svelte:head>
	<title>สรุปเนื้อหา · กระดาษคำตอบ</title>
	<meta
		name="description"
		content="สรุปทบทวน 8 หัวข้อ: AWS Cloud Quest 5 แลป, RAG/LangChain, IP Subnetting และตารางเปรียบเทียบก่อนสอบ"
	/>
</svelte:head>

<section class="pt-12">
	<h1 class="text-[28px] leading-tight font-bold">สรุปเนื้อหา</h1>
	<p class="mt-3 max-w-[52ch] text-[15px] leading-[1.9] text-muted">
		อ่านสรุปแต่ละหัวข้อก่อนไปทำแบบทดสอบ — แต่ละหน้าจบด้วยสิ่งที่ควรจำก่อนเข้าห้องสอบ
	</p>
</section>

<div class="mt-10 space-y-12">
	{#each topicGroups as group (group.label)}
		<section aria-labelledby={'group-' + group.label}>
			<h2 id={'group-' + group.label} class="text-[13px] font-semibold text-muted">
				{group.label}
			</h2>
			<ul class="mt-3 divide-y divide-line border-y border-line">
				{#each group.slugs as slug (slug)}
					{@const topic = bySlug[slug]}
					{@const num = labNum(slug)}
					<li>
						<a
							href="/summary/{slug}"
							class="group flex items-baseline gap-4 py-5 transition-colors hover:bg-surface/70"
						>
							{#if num}
								<span
									class="flex h-8 w-8 shrink-0 translate-y-1 items-center justify-center rounded-full border border-accent text-[13px] font-semibold text-accent-deep transition-all duration-200 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-accent-soft"
								>
									{num}
								</span>
							{:else}
								<span
									class="flex h-8 w-8 shrink-0 translate-y-1 items-center justify-center rounded-full border border-line text-[13px] text-muted transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6"
									aria-hidden="true"
								>
									★
								</span>
							{/if}
							<span class="min-w-0">
								<span
									class="block text-[16px] leading-snug font-semibold transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent-deep"
								>
									{topic.title}
								</span>
								<span class="mt-1 block max-w-[58ch] text-[13.5px] leading-relaxed text-muted">
									{topic.desc}
								</span>
							</span>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</div>

<section class="mt-14 rounded-xl border border-line bg-surface p-6 sm:p-8">
	<h2 class="text-[18px] font-semibold">พร้อมแล้วใช่ไหม</h2>
	<p class="mt-2 max-w-[56ch] text-[14.5px] leading-[1.9] text-muted">
		ลองทำแบบทดสอบ 100 ข้อ — ตอบแล้วเห็นเฉลยทันทีพร้อมเหตุผลของทุกตัวเลือก
		เก็บสถิติข้อที่พลาดไว้ทบทวน
	</p>
	<a
		href="/quiz"
		class="btn-lift mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-[14.5px] font-medium text-paper transition-colors hover:bg-accent-deep"
	>
		เริ่มทำแบบทดสอบ
	</a>
</section>
