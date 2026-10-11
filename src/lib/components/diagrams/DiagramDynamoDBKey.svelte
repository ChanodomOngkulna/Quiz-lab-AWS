<div
	class="grid gap-4 sm:grid-cols-2"
	role="img"
	aria-label="เปรียบเทียบ primary key แบบ partition key อย่างเดียวที่ค่าต้องไม่ซ้ำ กับแบบ composite ที่คู่ partition key และ sort key ต้องไม่ซ้ำ"
>
	<section class="rounded-xl border-2 border-ink bg-surface p-3.5">
		<p class="text-[13.5px] font-semibold">Partition key อย่างเดียว</p>
		<div class="mt-2.5 grid grid-cols-[minmax(96px,130px)_1fr] gap-1.5 text-center">
			<div
				class="rounded-md border border-accent-deep bg-accent-soft px-1 py-1 text-[11.5px] font-semibold text-accent-deep"
			>
				partition key
			</div>
			<div class="py-1 text-[11.5px] text-muted">item</div>
			{#each ['u1', 'u2', 'u3'] as k, idx (k)}
				<div class="rounded-md border border-line bg-paper py-1 font-mono text-[12px]">{k}</div>
				<div class="self-center text-start text-[11px] text-muted">แถวที่ {idx + 1}</div>
			{/each}
		</div>
		<p class="mt-2.5 text-[11px] leading-relaxed text-muted">
			ค่า partition key ต้องไม่ซ้ำกันทั้งตาราง
		</p>
	</section>

	<section class="rounded-xl border-2 border-ink bg-surface p-3.5">
		<p class="text-[13.5px] font-semibold">Partition key + Sort key (composite)</p>
		<div class="mt-2.5 grid grid-cols-2 gap-1.5 text-center">
			<div
				class="rounded-md border border-accent-deep bg-accent-soft px-1 py-1 text-[11.5px] font-semibold text-accent-deep"
			>
				partition key
			</div>
			<div class="rounded-md border border-ink bg-paper px-1 py-1 text-[11.5px] font-semibold">
				sort key
			</div>
			{#each [{ pk: 'u1', sk: 't1' }, { pk: 'u1', sk: 't2' }, { pk: 'u1', sk: 't3' }, { pk: 'u2', sk: 't9' }] as row (row.pk + row.sk)}
				<div class="rounded-md border border-line bg-paper py-1 font-mono text-[12px]">
					{row.pk}
				</div>
				<div class="rounded-md border border-line bg-paper py-1 font-mono text-[12px]">
					{row.sk}
				</div>
			{/each}
		</div>
		<p class="mt-2.5 text-[11px] leading-relaxed text-muted">
			partition key ซ้ำได้ — แต่คู่ (partition, sort) ต้องไม่ซ้ำ
		</p>
	</section>
</div>
