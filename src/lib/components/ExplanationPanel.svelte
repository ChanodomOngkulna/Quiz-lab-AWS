<script>
	import ChoiceBubble from './ChoiceBubble.svelte';

	let { q, chosenKey, order } = $props();

	const correct = $derived(chosenKey === q.answerKey);
	const explanations = $derived(
		order.map((c) => q.explanations.find((e) => e.key === c.key)).filter((e) => e != null)
	);
</script>

<div class="reveal mt-6" aria-live="polite">
	<div
		class="flex items-center gap-3 rounded-xl border px-4 py-3
			{correct ? 'border-correct bg-correct-soft' : 'border-wrong bg-wrong-soft'}"
	>
		{#if correct}
			<svg class="h-6 w-6 shrink-0 text-correct" viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
				<path
					d="M8 12.5l2.6 2.6L16 9.7"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<p class="text-[15px] font-semibold text-correct">ตอบถูก</p>
		{:else}
			<svg class="h-6 w-6 shrink-0 text-wrong" viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
				<path
					d="M9 9l6 6M15 9l-6 6"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
				/>
			</svg>
			<p class="flex flex-wrap items-center gap-2 text-[15px] font-semibold text-wrong">
				ยังไม่ถูก — เฉลยคือตัวเลือก <span class="inline-flex"
					><ChoiceBubble letter={q.answerKey} state="correct" size="sm" /></span
				>
			</p>
		{/if}
	</div>

	{#if explanations.length}
		<ul class="mt-4 space-y-3.5">
			{#each explanations as e (e.key)}
				<li class="flex gap-3">
					<span class="mt-0.5"
						><ChoiceBubble
							letter={e.key}
							state={e.verdict === 'correct' ? 'correct' : 'dim'}
							size="sm"
						/></span
					>
					<div class="min-w-0 text-[14px] leading-[1.85] whitespace-pre-line text-ink/85">
						{@html e.text}
					</div>
				</li>
			{/each}
		</ul>
	{/if}

	{#if q.notes.length}
		<div class="mt-5 rounded-xl bg-surface px-4 py-3.5">
			<p class="text-[12.5px] font-semibold text-muted">คำอธิบายเพิ่มเติม</p>
			<ul class="mt-2 space-y-2">
				{#each q.notes as note, i (i)}
					<li class="flex gap-2.5 text-[14px] leading-[1.85] whitespace-pre-line text-ink/85">
						<span
							class="mt-[.65em] h-1.5 w-1.5 shrink-0 rounded-full border border-muted"
							aria-hidden="true"
						></span>
						<span>{@html note}</span>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
	.reveal {
		animation: reveal 260ms ease-out both;
	}
	@keyframes reveal {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
