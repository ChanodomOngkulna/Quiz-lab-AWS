<div
	class="rounded-xl border border-line bg-surface p-4 sm:p-5"
	role="img"
	aria-label="การแบ่ง 192.168.10.0/24 เป็นบล็อก /26 สี่บล็อก บล็อกละ 64 ไอพี พร้อมตำแหน่ง network ID usable range และ broadcast ของบล็อกแรก"
>
	<div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
		<p class="text-[14px] font-semibold">192.168.10.0/24 แบ่งเป็นบล็อก /26</p>
		<p class="font-mono text-[11.5px] text-muted">Block size = 256 − 192 = 64</p>
	</div>

	<div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
		{#each [{ i: 0, from: '.0', to: '.63', hot: true }, { i: 1, from: '.64', to: '.127', hot: false }, { i: 2, from: '.128', to: '.191', hot: false }, { i: 3, from: '.192', to: '.255', hot: false }] as b (b.i)}
			<div
				class="rounded-lg border-2 px-2.5 py-2 {b.hot
					? 'border-accent-deep bg-accent-soft'
					: 'border-ink bg-surface'}"
			>
				<p class="text-center font-mono text-[12.5px] font-medium">{b.from} – {b.to}</p>
				<p class="mt-0.5 text-center text-[10.5px] leading-snug text-muted">
					Subnet {b.i} · 64 IPs · 62 usable
				</p>
			</div>
		{/each}
	</div>

	<ul class="mt-4 space-y-2">
		{#each [{ label: 'Network ID', value: '192.168.10.0', note: 'ไอพีตัวแรกของบล็อก — ห้ามใช้กับ host' }, { label: 'Usable range', value: '.1 – .62', note: '62 หมายเลขที่ตั้งให้เครื่องได้จริง' }, { label: 'Broadcast IP', value: '192.168.10.63', note: 'ไอพีตัวสุดท้ายของบล็อก — ห้ามใช้กับ host' }] as a (a.label)}
			<li class="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
				<span class="rounded-md bg-accent px-2 py-0.5 text-[11px] font-semibold text-white">
					{a.label}
				</span>
				<span class="font-mono text-[12.5px]">{a.value}</span>
				<span class="text-[11.5px] text-muted">{a.note}</span>
			</li>
		{/each}
	</ul>
</div>
