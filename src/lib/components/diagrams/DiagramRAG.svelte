<div
	class="rounded-xl border border-line bg-surface p-4 sm:p-5"
	role="img"
	aria-label="ไดอะแกรมขั้นตอนของ RAG: Ingestion ไป Storage ไป Retrieval ไป Generation โดยรับเอกสารจริงเข้ามาแล้วส่งออกคำตอบที่อ้างอิงเอกสาร"
>
	<p class="text-center text-[11.5px] text-muted">อินพุต: เอกสาร PDF กรมธรรม์ / คู่มือองค์กร</p>

	<div class="mt-2 flex flex-col sm:flex-row sm:items-stretch">
		{#each [{ n: '1', title: 'Ingestion', sub: 'อ่านเอกสาร → ตัด chunk → แปลงเป็นเวกเตอร์' }, { n: '2', title: 'Storage', sub: 'เก็บเวกเตอร์ลง Vector Database' }, { n: '3', title: 'Retrieval', sub: 'ค้นข้อความที่ความหมายใกล้คำถามที่สุด' }, { n: '4', title: 'Generation', sub: 'LLM เรียบเรียงคำตอบจาก context ที่ดึงมา' }] as stage, i (stage.title)}
			{#if i > 0}
				<div class="flex items-center justify-center py-1 sm:justify-start" aria-hidden="true">
					<svg class="h-4 w-4 rotate-90 text-muted sm:rotate-0" viewBox="0 0 24 24" fill="none">
						<path
							d="M4 12h14m0 0-5-5m5 5-5 5"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>
			{/if}
			<div class="flex-1 rounded-xl border-2 border-ink px-3 py-2.5">
				<div class="flex items-center gap-2">
					<span
						class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-[12px] font-semibold text-white"
					>
						{stage.n}
					</span>
					<p class="text-[14px] font-semibold">{stage.title}</p>
				</div>
				<p class="mt-1.5 text-[12px] leading-relaxed text-muted">{stage.sub}</p>
			</div>
		{/each}
	</div>

	<p class="mt-3 text-center text-[11.5px] leading-relaxed text-muted">
		เอาต์พุต: คำตอบที่อ้างอิงเอกสารจริง — คำถามของผู้ใช้เข้าที่ขั้น Retrieval ซึ่งจับคู่ด้วยความหมาย
		แทนการเทียบคำตรงตัว
	</p>
</div>
