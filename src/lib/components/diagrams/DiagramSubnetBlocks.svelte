<svg
	viewBox="0 0 760 240"
	class="block w-full min-w-[640px]"
	role="img"
	aria-label="การแบ่ง 192.168.10.0/24 เป็นบล็อก /26 สี่บล็อก บล็อกละ 64 ไอพี พร้อมตำแหน่ง network ID usable และ broadcast ของบล็อกแรก"
	font-size="13"
>
	<text x="20" y="24" font-weight="600" font-size="14">192.168.10.0/24 แบ่งเป็นบล็อก /26</text>
	<text x="740" y="24" text-anchor="end" fill="var(--color-muted)" font-size="11.5">
		Block size = 256 − 192 = 64
	</text>

	<!-- blocks -->
	{#each [{ i: 0, from: '.0', to: '.63', hot: true }, { i: 1, from: '.64', to: '.127', hot: false }, { i: 2, from: '.128', to: '.191', hot: false }, { i: 3, from: '.192', to: '.255', hot: false }] as b (b.i)}
		<g>
			<rect
				x={20 + b.i * 181}
				y="44"
				width="169"
				height="62"
				rx="8"
				fill={b.hot ? 'var(--color-accent-soft)' : 'var(--color-surface)'}
				stroke={b.hot ? 'var(--color-accent-deep)' : 'var(--color-ink)'}
				stroke-width={b.hot ? 2 : 1.5}
			/>
			<text
				x={20 + b.i * 181 + 84.5}
				y="68"
				text-anchor="middle"
				font-weight={b.hot ? '600' : '400'}
				font-size="12.5"
				font-family="var(--font-mono)"
			>
				{b.from} – {b.to}
			</text>
			<text
				x={20 + b.i * 181 + 84.5}
				y="90"
				text-anchor="middle"
				fill="var(--color-muted)"
				font-size="11"
			>
				Subnet {b.i} · 64 IPs · 62 usable
			</text>
		</g>
	{/each}

	<!-- annotations for block 1 -->
	<path d="M 104 108 L 104 128" stroke="var(--color-accent-deep)" stroke-width="1.2" />
	<path
		d="M 320 108 L 320 128"
		stroke="var(--color-muted)"
		stroke-width="1"
		stroke-dasharray="3 3"
	/>
	<path
		d="M 577 108 L 577 128"
		stroke="var(--color-muted)"
		stroke-width="1"
		stroke-dasharray="3 3"
	/>

	{#each [{ y: 150, label: 'Network ID', value: '192.168.10.0', note: 'ไอพีตัวแรกของบล็อก — ห้ามใช้กับ host', hot: true }, { y: 186, label: 'Usable range', value: '.1 – .62', note: '62 หมายเลขที่ตั้งให้เครื่องได้จริง', hot: true }, { y: 222, label: 'Broadcast IP', value: '192.168.10.63', note: 'ไอพีตัวสุดท้ายของบล็อก — ห้ามใช้กับ host', hot: true }] as a (a.label)}
		<g>
			<rect
				x="20"
				y={a.y - 16}
				width="90"
				height="22"
				rx="5"
				fill={a.hot ? 'var(--color-accent)' : 'var(--color-line)'}
			/>
			<text x="65" y={a.y - 0.5} text-anchor="middle" fill="#fff" font-size="11" font-weight="600">
				{a.label}
			</text>
			<text x="124" y={a.y} font-size="12.5" font-family="var(--font-mono)">{a.value}</text>
			<text x="290" y={a.y} fill="var(--color-muted)" font-size="11.5">{a.note}</text>
			<path
				d="M 104 {a.y - 10} L 104 {a.y - 2}"
				stroke="var(--color-accent-deep)"
				stroke-width="1.2"
			/>
		</g>
	{/each}
</svg>
