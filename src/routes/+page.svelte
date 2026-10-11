<script>
	import quizData from '$lib/data/quiz.json';
	import ChoiceBubble from '$lib/components/ChoiceBubble.svelte';
	import ExplanationPanel from '$lib/components/ExplanationPanel.svelte';

	const sample = quizData.find((q) => q.id === 82);
	let picked = $state(null);
	let done = $state(false);

	const areas = [
		{
			href: '/summary/dynamodb',
			title: 'AWS Cloud',
			desc: 'สรุป 5 แลป DynamoDB, EFS, IAM, Auto Scaling และ ALB Multi-AZ พร้อมตารางเปรียบเทียบก่อนสอบ',
			count: '40 ข้อ'
		},
		{
			href: '/summary/rag-langchain',
			title: 'RAG & LangChain',
			desc: 'แนวคิด RAG การแก้ hallucination และบทบาทของแต่ละ component ใน LangChain',
			count: '30 ข้อ'
		},
		{
			href: '/summary/subnetting',
			title: 'IP Subnetting',
			desc: 'สูตรคำนวณ block size หา network ID broadcast และ usable range พร้อมตาราง CIDR',
			count: '30 ข้อ'
		}
	];
</script>

<svelte:head>
	<title>กระดาษคำตอบ — ทบทวนสอบ AWS · RAG · Subnetting</title>
	<meta
		name="description"
		content="สรุปเนื้อหา 8 หัวข้อและแบบทดสอบ 100 ข้อ พร้อมเฉลยละเอียดทุกตัวเลือก — ทบทวนก่อนสอบ AWS Cloud, RAG/LangChain และ IP Subnetting"
	/>
</svelte:head>

<!-- hero -->
<section class="pt-14 sm:pt-20">
	<div class="flex items-center gap-2.5" aria-hidden="true">
		{#each ['ก', 'ข', 'ค', 'ง'] as letter, i (letter)}
			<span class="transition-colors {i === 2 ? '' : 'text-muted/40'}">
				<ChoiceBubble {letter} state={i === 2 ? 'selected' : 'default'} />
			</span>
		{/each}
	</div>
	<h1 class="mt-6 max-w-[18ch] text-[34px] leading-[1.25] font-bold sm:text-[40px]">
		ทบทวนก่อนเข้าห้องสอบ
	</h1>
	<p class="mt-4 max-w-[56ch] text-[15.5px] leading-[1.95] text-muted">
		สรุปทั้ง 8 หัวข้อและข้อสอบ 100 ข้อในที่เดียว — ตอบข้อไหนเสร็จ
		เห็นเฉลยทันทีพร้อมเหตุผลของทุกตัวเลือก ว่าทำไมถึงถูกและทำไมถึงผิด
	</p>
	<div class="mt-7 flex flex-wrap gap-3">
		<a
			href="/quiz"
			class="rounded-full bg-ink px-7 py-3 text-[15px] font-medium text-paper transition-colors hover:bg-accent-deep"
		>
			เริ่มทำแบบทดสอบ
		</a>
		<a
			href="/summary"
			class="rounded-full border border-ink/25 px-6 py-3 text-[14.5px] transition-colors hover:border-ink"
		>
			อ่านสรุปก่อนก็ได้
		</a>
	</div>
</section>

<!-- sample question -->
{#if sample}
	<section class="mt-14" aria-labelledby="sample-heading">
		<h2 id="sample-heading" class="text-[13px] font-semibold text-muted">ลองตอบหนึ่งข้อก่อน</h2>
		<div class="mt-3 rounded-2xl border border-line bg-surface p-5 sm:p-7">
			<p class="text-[15.5px] leading-[1.9]">{@html sample.scenario}</p>
			<ul class="mt-5 space-y-2.5">
				{#each sample.choices as c (c.key)}
					{@const state = done
						? c.key === sample.answerKey
							? 'correct'
							: c.key === picked
								? 'wrong'
								: 'dim'
						: picked === c.key
							? 'selected'
							: 'default'}
					<li>
						<button
							type="button"
							onclick={() => {
								if (!done) picked = c.key;
							}}
							disabled={done}
							aria-pressed={picked === c.key && !done}
							class="flex w-full items-center gap-3.5 rounded-xl border-2 px-4 py-2.5 text-left transition-colors duration-200
								{state === 'default' ? 'border-line bg-surface hover:border-accent' : ''}
								{state === 'selected' ? 'border-accent-deep bg-accent-soft' : ''}
								{state === 'correct' ? 'border-correct bg-correct-soft' : ''}
								{state === 'wrong' ? 'border-wrong bg-wrong-soft' : ''}
								{state === 'dim' ? 'border-line bg-surface opacity-55' : ''}"
						>
							<ChoiceBubble letter={c.key} {state} size="sm" />
							<span class="text-[14.5px] leading-relaxed">{@html c.text}</span>
						</button>
					</li>
				{/each}
			</ul>
			{#if done}
				<ExplanationPanel q={sample} chosenKey={picked} order={sample.choices} />
			{:else}
				<div class="mt-5">
					<button
						type="button"
						disabled={!picked}
						onclick={() => (done = true)}
						class="rounded-full bg-ink px-6 py-2 text-[13.5px] font-medium text-paper transition-colors hover:bg-accent-deep disabled:pointer-events-none disabled:opacity-35"
					>
						ดูเฉลย
					</button>
				</div>
			{/if}
		</div>
	</section>
{/if}

<!-- subject areas -->
<section class="mt-16" aria-labelledby="areas-heading">
	<h2 id="areas-heading" class="text-[13px] font-semibold text-muted">ขอบเขตการสอบ</h2>
	<ul class="mt-3 divide-y divide-line border-y border-line">
		{#each areas as area (area.title)}
			<li>
				<a href={area.href} class="group flex flex-wrap items-baseline gap-x-4 gap-y-1 py-5">
					<span class="text-[17px] font-semibold group-hover:text-accent-deep">{area.title}</span>
					<span
						class="rounded-full bg-accent-soft px-3 py-1 text-[12px] font-medium text-accent-deep"
					>
						{area.count}
					</span>
					<span class="w-full max-w-[62ch] text-[13.5px] leading-relaxed text-muted"
						>{area.desc}</span
					>
				</a>
			</li>
		{/each}
	</ul>
</section>

<!-- how to study -->
<section class="mt-16" aria-labelledby="how-heading">
	<h2 id="how-heading" class="text-[13px] font-semibold text-muted">แนะนำลำดับการทบทวน</h2>
	<ol class="mt-5 space-y-5">
		{#each [{ step: 'อ่านสรุปตามหัวข้อที่อ่อน', detail: 'แต่ละหน้าจบด้วยหัวข้อ "จำก่อนสอบ" สำหรับกลับมาอ่านเร็ว ๆ ก่อนเข้าห้องสอบ' }, { step: 'ทำแบบทดสอบ 100 ข้อ', detail: 'ตอบทีละข้อพร้อมเฉลยทันที ปักธงข้อที่สงสัยระหว่างทำไว้ดูตอนจบ' }, { step: 'ทบทวนเฉพาะข้อที่พลาด', detail: 'เว็บจำข้อที่คุณตอบผิดไว้ให้ กด "ทบทวนเฉพาะข้อที่เคยผิด" เพื่อล้างพวกมันให้หมด' }] as item, i (item.step)}
			<li class="flex gap-4">
				<span
					class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-accent text-[13.5px] font-semibold text-accent-deep"
				>
					{i + 1}
				</span>
				<div>
					<p class="text-[15.5px] font-semibold">{item.step}</p>
					<p class="mt-1 max-w-[58ch] text-[14px] leading-[1.85] text-muted">{item.detail}</p>
				</div>
			</li>
		{/each}
	</ol>
</section>
