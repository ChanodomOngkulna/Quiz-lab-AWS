<script>
	import { quiz } from '$lib/quiz/store.svelte.js';
	import { categories } from '$lib/data/topics';
	import ChoiceBubble from '$lib/components/ChoiceBubble.svelte';
	import ExplanationPanel from '$lib/components/ExplanationPanel.svelte';
	import StickerConfetti from '$lib/components/stickers/StickerConfetti.svelte';

	const chipClass = {
		aws: 'bg-accent-soft text-accent-deep',
		rag: 'bg-[#ebe7f8] text-[#5b4aa0] dark:bg-[#282244] dark:text-[#c4b5fd]',
		subnet: 'bg-[#e1eef3] text-[#2c6a84] dark:bg-[#162f3d] dark:text-[#7dd3fc]'
	};
	const catLabel = { aws: 'AWS Cloud', rag: 'RAG & LangChain', subnet: 'IP Subnetting' };

	const current = $derived(quiz.current);
	const checked = $derived(current ? quiz.isChecked(current.q.id) : false);
	const selectedKey = $derived(current ? quiz.selectedOf(current.q.id) : null);
	const isLast = $derived(quiz.run ? quiz.run.index === quiz.run.order.length - 1 : false);
	const wrongIds = $derived(quiz.wrongIds());

	function handleKey(e) {
		if (quiz.phase !== 'running' || !current) return;
		if (e.key >= '1' && e.key <= '4') {
			const c = current.choices[+e.key - 1];
			if (c && !checked) quiz.select(current.q.id, c.key);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (checked) quiz.next();
			else if (selectedKey) quiz.check(current.q.id);
		} else if ((e.key === 'f' || e.key === 'F') && !e.metaKey && !e.ctrlKey && !e.altKey) {
			quiz.toggleFlag(current.q.id);
		}
	}

	const fmtDuration = (ms) => {
		const s = Math.max(0, Math.round(ms / 1000));
		const m = Math.floor(s / 60);
		if (m < 60) return `${m} นาที ${s % 60} วินาที`;
		return `${Math.floor(m / 60)} ชั่วโมง ${m % 60} นาที`;
	};

	const strip = (html) =>
		html
			.replace(/<[^>]+>/g, '')
			.replace(/\s+/g, ' ')
			.trim();
	const short = (html) => {
		const t = strip(html);
		return t.length > 90 ? t.slice(0, 90) + '…' : t;
	};

	const resultCats = $derived(
		quiz.result
			? categories.map((c) => {
					const ids = quiz.result.order.filter((id) => quiz.question(id).category === c.id);
					const correct = ids.filter(
						(id) => quiz.result.answers[id] === quiz.question(id).answerKey
					).length;
					return { ...c, total: ids.length, correct };
				})
			: []
	);
	const resultWrong = $derived(
		quiz.result
			? quiz.result.order.filter((id) => quiz.result.answers[id] !== quiz.question(id).answerKey)
			: []
	);
	const resultFlagged = $derived(
		quiz.result ? quiz.result.flags.filter((id) => quiz.result.order.includes(id)) : []
	);
</script>

<svelte:window onkeydown={handleKey} />

<svelte:head>
	<title>แบบทดสอบ 100 ข้อ · AWS-Quiz-CPE</title>
	<meta
		name="description"
		content="แบบทดสอบ 100 ข้อ AWS Cloud, RAG/LangChain และ IP Subnetting — ตอบแล้วเห็นเฉลยพร้อมเหตุผลของทุกตัวเลือกทันที"
	/>
</svelte:head>

{#if quiz.phase === 'idle'}
	<!-- ================= start screen ================= -->
	<section class="pt-12">
		<h1 class="rise-in text-[28px] leading-tight font-bold">แบบทดสอบ 100 ข้อ</h1>
		<p class="rise-in rise-d1 mt-3 max-w-[54ch] text-[15px] leading-[1.9] text-muted">
			ทำทั้งชุดต่อเนื่อง — ตอบเสร็จแต่ละข้อจะเห็นเฉลยทันทีพร้อมเหตุผลว่าทำไมแต่ละตัวเลือกถูกหรือผิด
			ปักธงข้อที่สงสัยไว้ทบทวนตอนจบ และเราจะจำข้อที่คุณพลาดไว้ให้ย้อนทำใหม่
		</p>

		<ul class="rise-in rise-d2 mt-5 flex flex-wrap gap-2" aria-label="หมวดข้อสอบ">
			{#each categories as c (c.id)}
				<li class="rounded-full px-3.5 py-1.5 text-[13px] font-medium {chipClass[c.id]}">
					{c.label} · {c.count} ข้อ
				</li>
			{/each}
		</ul>

		{#if quiz.run}
			<div
				class="rise-in rise-d3 mt-8 rounded-xl border border-accent/50 bg-accent-soft p-5 sm:p-6"
			>
				<p class="text-[15px] font-semibold">คุณมีความคืบหน้าค้างไว้</p>
				<p class="mt-1 text-[14px] leading-relaxed text-ink/75">
					ตอบแล้ว {quiz.answeredCount} จาก {quiz.runTotal} ข้อ
					{quiz.run.mode === 'wrong-only' ? '(โหมดทบทวนข้อที่ผิด)' : ''}
				</p>
				<div class="mt-4 flex flex-wrap gap-3">
					<button
						type="button"
						onclick={() => quiz.resume()}
						class="btn-lift rounded-full bg-accent-deep px-6 py-2.5 text-[14.5px] font-medium text-white transition-colors hover:bg-accent"
					>
						ทำต่อจากที่ค้างไว้
					</button>
					<button
						type="button"
						onclick={() => quiz.discardRun()}
						class="rounded-full border border-ink/25 px-5 py-2.5 text-[14px] text-ink/75 transition-colors hover:border-wrong hover:text-wrong"
					>
						เริ่มใหม่ทั้งหมด
					</button>
				</div>
			</div>
		{:else}
			<div class="rise-in rise-d3 mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
				<button
					type="button"
					onclick={() => quiz.startRun('full')}
					class="btn-lift rounded-full bg-ink px-8 py-3 text-[15px] font-medium text-paper transition-colors hover:bg-accent-deep"
				>
					เริ่มทำ 100 ข้อ
				</button>
				<label class="flex cursor-pointer items-center gap-2.5 text-[14px] text-ink/80 select-none">
					<input
						type="checkbox"
						class="peer sr-only"
						checked={quiz.prefs.shuffle}
						onchange={(e) => quiz.setShuffle(e.currentTarget.checked)}
					/>
					<span
						class="relative h-6 w-11 rounded-full bg-line transition-colors peer-checked:bg-accent after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-surface after:shadow-sm after:transition-transform peer-checked:after:translate-x-5"
						aria-hidden="true"
					></span>
					สลับลำดับข้อและตัวเลือก
				</label>
			</div>
		{/if}

		{#if wrongIds.length > 0 && !quiz.run}
			<button
				type="button"
				onclick={() => quiz.startRun('wrong-only')}
				class="btn-lift mt-4 rounded-full border border-accent-deep/40 px-5 py-2 text-[13.5px] font-medium text-accent-deep transition-colors hover:bg-accent-soft"
			>
				ทบทวนเฉพาะข้อที่เคยผิด ({wrongIds.length} ข้อ)
			</button>
		{/if}

		{#if quiz.stats.lastResult}
			<p class="mt-8 border-t border-line pt-5 text-[13.5px] text-muted">
				ผลครั้งล่าสุด: ตอบถูก {quiz.stats.lastResult.score} จาก {quiz.stats.lastResult.total} ข้อ ·
				<button
					type="button"
					class="font-medium text-accent-deep underline underline-offset-4"
					onclick={() => quiz.viewLastResult()}
				>
					ดูรายละเอียด
				</button>
			</p>
		{/if}
	</section>
{:else if quiz.phase === 'running' && current}
	<!-- ================= runner ================= -->
	<div
		class="sticky top-14 z-30 -mx-4 border-b border-line bg-paper/95 px-4 py-2.5 backdrop-blur sm:-mx-6 sm:px-6 sm:py-3"
	>
		<div class="flex items-center gap-2 sm:gap-3">
			<p class="text-[12.5px] font-medium whitespace-nowrap tabular-nums sm:text-[13px]">
				ข้อ {quiz.run.index + 1} / {quiz.runTotal}
			</p>
			<div class="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-line">
				<div
					class="h-full rounded-full bg-accent transition-[width] duration-300"
					style:width="{(quiz.answeredCount / quiz.runTotal) * 100}%"
				></div>
			</div>
			<button
				type="button"
				onclick={() => quiz.toggleFlag(current.q.id)}
				aria-pressed={quiz.isFlagged(current.q.id)}
				title="ปักธงข้อนี้ (F)"
				class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-accent-soft {quiz.isFlagged(
					current.q.id
				)
					? 'text-accent-deep'
					: 'text-muted'}"
			>
				<span class="sr-only">ปักธงข้อนี้</span>
				<svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path d="M6 21V3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
					<path
						d="M6 4h11.5l-3 4.5 3 4.5H6"
						stroke="currentColor"
						stroke-width="2"
						stroke-linejoin="round"
						fill={quiz.isFlagged(current.q.id) ? 'currentColor' : 'none'}
					/>
				</svg>
			</button>
			<button
				type="button"
				onclick={() => (quiz.gridOpen = !quiz.gridOpen)}
				aria-expanded={quiz.gridOpen}
				class="rounded-full px-2.5 py-1.5 text-[12px] font-medium text-muted transition-colors hover:bg-accent-soft hover:text-ink sm:px-3 sm:text-[12.5px]"
			>
				<span class="sm:hidden">แผนที่</span>
				<span class="hidden sm:inline">แผนที่ข้อ</span>
			</button>
			<button
				type="button"
				onclick={() => quiz.pause()}
				class="rounded-full px-2.5 py-1.5 text-[12px] font-medium text-muted transition-colors hover:bg-accent-soft hover:text-ink sm:px-3 sm:text-[12.5px]"
			>
				พัก
			</button>
		</div>
	</div>

	{#if quiz.gridOpen}
		<nav class="mt-4 rounded-xl border border-line bg-surface p-4" aria-label="ภาพรวมการตอบทุกข้อ">
			<ol class="grid grid-cols-8 gap-1.5 sm:grid-cols-10">
				{#each quiz.run.order as id, i (id)}
					{@const st = quiz.stateOf(id)}
					<li>
						<button
							type="button"
							onclick={() => quiz.jump(i)}
							aria-current={quiz.run.index === i ? 'true' : undefined}
							aria-label="ข้อ {quiz.question(id).id} — {st === 'correct'
								? 'ตอบถูก'
								: st === 'wrong'
									? 'ตอบผิด'
									: 'ยังไม่ตอบ'}{quiz.isFlagged(id) ? ' ปักธงไว้' : ''}"
							class="relative h-8 w-full rounded-md border text-[12px] font-medium tabular-nums transition-colors
								{st === 'todo' ? 'border-line bg-surface text-muted hover:border-muted' : ''}
								{st === 'correct' ? 'border-correct/50 bg-correct-soft text-correct' : ''}
								{st === 'wrong' ? 'border-wrong/50 bg-wrong-soft text-wrong' : ''}
								{quiz.run.index === i ? 'ring-2 ring-accent ring-offset-1 ring-offset-surface' : ''}"
						>
							{quiz.question(id).id}
							{#if quiz.isFlagged(id)}
								<span
									class="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border border-surface bg-accent"
									aria-hidden="true"
								></span>
							{/if}
						</button>
					</li>
				{/each}
			</ol>
		</nav>
	{/if}

	<article class="mt-6 rounded-2xl border border-line bg-surface p-5 sm:p-7">
		<div class="flex flex-wrap items-center gap-3">
			<span class="rounded-full px-3 py-1 text-[12px] font-medium {chipClass[current.q.category]}">
				{catLabel[current.q.category]}
			</span>
			<span class="text-[12.5px] text-muted">ข้อสอบข้อที่ {current.q.id}</span>
			{#if quiz.isFlagged(current.q.id)}
				<span class="ml-auto flex items-center gap-1 text-[12px] font-medium text-accent-deep">
					<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<path d="M6 21V3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
						<path
							d="M6 4h11.5l-3 4.5 3 4.5H6"
							stroke="currentColor"
							stroke-width="2"
							stroke-linejoin="round"
							fill="currentColor"
						/>
					</svg>
					ปักธงไว้
				</span>
			{/if}
		</div>

		<p class="mt-4 text-[16px] leading-[1.95]">{@html current.q.scenario}</p>

		<ul class="mt-6 space-y-2.5">
			{#each current.choices as c, i (c.key)}
				{@const state = checked
					? c.key === current.q.answerKey
						? 'correct'
						: c.key === quiz.answerOf(current.q.id)
							? 'wrong'
							: 'dim'
					: selectedKey === c.key
						? 'selected'
						: 'default'}
				<li>
					<button
						type="button"
						onclick={() => quiz.select(current.q.id, c.key)}
						disabled={checked}
						aria-pressed={selectedKey === c.key && !checked}
						class="flex w-full items-center gap-3.5 rounded-xl border-2 px-4 py-3 text-left transition-all duration-200 active:scale-[.99]
							{state === 'default' ? 'border-line bg-surface hover:border-accent' : ''}
							{state === 'selected' ? 'border-accent-deep bg-accent-soft' : ''}
							{state === 'correct' ? 'border-correct bg-correct-soft' : ''}
							{state === 'wrong' ? 'border-wrong bg-wrong-soft' : ''}
							{state === 'dim' ? 'border-line bg-surface opacity-55' : ''}"
					>
						<ChoiceBubble letter={c.key} {state} />
						<span class="min-w-0 text-[15px] leading-relaxed">{@html c.text}</span>
						{#if !checked}
							<span
								class="ml-auto hidden shrink-0 self-center text-[11px] text-muted/70 tabular-nums sm:block"
							>
								{i + 1}
							</span>
						{/if}
					</button>
				</li>
			{/each}
		</ul>

		{#if checked}
			<ExplanationPanel
				q={current.q}
				chosenKey={quiz.answerOf(current.q.id)}
				order={current.choices}
			/>
		{/if}

		<div class="mt-7 flex items-center justify-between gap-3 border-t border-line pt-5">
			<button
				type="button"
				onclick={() => quiz.prev()}
				disabled={quiz.run.index === 0}
				class="rounded-full px-4 py-2 text-[13.5px] font-medium text-muted transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-35"
			>
				ข้อก่อนหน้า
			</button>
			{#if !checked}
				<button
					type="button"
					onclick={() => quiz.check(current.q.id)}
					disabled={!selectedKey}
					class="btn-lift rounded-full bg-ink px-7 py-2.5 text-[14.5px] font-medium text-paper transition-colors hover:bg-accent-deep disabled:pointer-events-none disabled:opacity-35"
				>
					ตรวจคำตอบ
				</button>
			{:else}
				<button
					type="button"
					onclick={() => quiz.next()}
					class="btn-lift rounded-full bg-accent-deep px-7 py-2.5 text-[14.5px] font-medium text-white transition-colors hover:bg-accent"
				>
					{isLast ? 'ดูสรุปผล' : 'ข้อถัดไป'}
				</button>
			{/if}
		</div>
	</article>

	<p class="mt-4 hidden text-center text-[12px] text-muted/80 sm:block">
		คีย์ลัด: กด 1–4 เลือกตัวเลือก · Enter ตรวจคำตอบและไปต่อ · F ปักธง
	</p>
{:else if quiz.phase === 'finished' && quiz.result}
	<!-- ================= results ================= -->
	<section class="pt-12">
		<div class="relative">
			{#if quiz.result.score / quiz.result.total >= 0.8}
				<StickerConfetti />
			{/if}
			{#if quiz.result.mode === 'wrong-only'}
				<p
					class="inline-block rounded-full bg-accent-soft px-3.5 py-1.5 text-[12.5px] font-medium text-accent-deep"
				>
					โหมดทบทวนข้อที่เคยผิด
				</p>
			{/if}
			<h1 class="animate-pop-in mt-3 text-[28px] leading-tight font-bold">
				ตอบถูก {quiz.result.score} จาก {quiz.result.total} ข้อ
			</h1>
		</div>
		<p class="mt-2 text-[15px] text-muted">
			คิดเป็น {Math.round((quiz.result.score / quiz.result.total) * 100)}% · ใช้เวลา {fmtDuration(
				quiz.result.endedAt - quiz.result.startedAt
			)}
		</p>

		<ul class="mt-8 space-y-4">
			{#each resultCats as c (c.id)}
				<li>
					<div class="flex items-baseline justify-between text-[13.5px]">
						<span class="font-medium">{c.label}</span>
						<span class="text-muted tabular-nums">{c.correct} / {c.total}</span>
					</div>
					<div class="mt-1.5 h-2 overflow-hidden rounded-full bg-line">
						<div
							class="h-full rounded-full {c.correct === c.total
								? 'bg-correct'
								: 'bg-accent'} transition-[width] duration-500"
							style:width="{c.total ? (c.correct / c.total) * 100 : 0}%"
						></div>
					</div>
				</li>
			{/each}
		</ul>

		{#if resultWrong.length}
			<h2 class="mt-12 text-[18px] font-semibold">ทบทวนข้อที่ผิด ({resultWrong.length})</h2>
			<ul class="mt-4 space-y-3">
				{#each resultWrong as id (id)}
					{@const q = quiz.question(id)}
					<li class="overflow-hidden rounded-xl border border-line bg-surface">
						<details>
							<summary class="cursor-pointer list-none px-4 py-3.5 sm:px-5">
								<span class="flex items-start gap-3">
									<ChoiceBubble letter={String(id)} state="wrong" size="sm" />
									<span class="min-w-0">
										<span class="block text-[13px] font-medium text-muted"
											>{catLabel[q.category]}</span
										>
										<span class="mt-0.5 block text-[14px] leading-relaxed">{short(q.scenario)}</span
										>
									</span>
								</span>
							</summary>
							<div class="border-t border-line px-4 pt-2 pb-5 sm:px-5">
								<p class="mt-2 text-[15px] leading-[1.9]">{@html q.scenario}</p>
								<ExplanationPanel {q} chosenKey={quiz.result.answers[id]} order={q.choices} />
							</div>
						</details>
					</li>
				{/each}
			</ul>
		{:else}
			<p
				class="mt-12 rounded-xl border border-correct/40 bg-correct-soft px-5 py-4 text-[15px] font-medium text-correct"
			>
				รอบนี้ไม่มีข้อที่ผิดเลย — เยี่ยมมาก
			</p>
		{/if}

		{#if resultFlagged.length}
			<h2 class="mt-12 text-[18px] font-semibold">ข้อที่ปักธงไว้ ({resultFlagged.length})</h2>
			<ul class="mt-4 space-y-3">
				{#each resultFlagged as id (id)}
					{@const q = quiz.question(id)}
					{@const wasWrong = quiz.result.answers[id] !== q.answerKey}
					<li class="overflow-hidden rounded-xl border border-line bg-surface">
						<details>
							<summary class="cursor-pointer list-none px-4 py-3.5 sm:px-5">
								<span class="flex items-start gap-3">
									<ChoiceBubble
										letter={String(id)}
										state={wasWrong ? 'wrong' : 'correct'}
										size="sm"
									/>
									<span class="min-w-0">
										<span class="block text-[13px] font-medium text-muted"
											>{catLabel[q.category]}</span
										>
										<span class="mt-0.5 block text-[14px] leading-relaxed">{short(q.scenario)}</span
										>
									</span>
								</span>
							</summary>
							<div class="border-t border-line px-4 pt-2 pb-5 sm:px-5">
								<p class="mt-2 text-[15px] leading-[1.9]">{@html q.scenario}</p>
								<ExplanationPanel {q} chosenKey={quiz.result.answers[id]} order={q.choices} />
							</div>
						</details>
					</li>
				{/each}
			</ul>
		{/if}

		<div class="mt-12 flex flex-wrap gap-3 border-t border-line pt-7">
			{#if wrongIds.length}
				<button
					type="button"
					onclick={() => quiz.startRun('wrong-only')}
					class="btn-lift rounded-full bg-ink px-6 py-2.5 text-[14.5px] font-medium text-paper transition-colors hover:bg-accent-deep"
				>
					ทำเฉพาะข้อที่เคยผิดใหม่ ({wrongIds.length} ข้อ)
				</button>
			{/if}
			<button
				type="button"
				onclick={() => quiz.restart()}
				class="rounded-full border border-ink/25 px-5 py-2.5 text-[14px] text-ink/80 transition-colors hover:border-ink hover:text-ink"
			>
				กลับไปหน้าเริ่ม
			</button>
		</div>

		<p class="mt-6 text-[13.5px] text-muted">
			อ่านสรุปเพิ่มก่อนสอบ:
			{#each categories as c, i (c.id)}
				{#if i > 0}·{/if}
				<a href={c.href} class="font-medium text-accent-deep underline underline-offset-4"
					>{c.label}</a
				>
			{/each}
		</p>
	</section>
{/if}
