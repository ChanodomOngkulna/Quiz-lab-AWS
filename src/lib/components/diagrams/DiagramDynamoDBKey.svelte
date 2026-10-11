<svg
	viewBox="0 0 720 250"
	class="block w-full min-w-[600px]"
	role="img"
	aria-label="เปรียบเทียบ primary key แบบ partition key อย่างเดียวที่ค่าต้องไม่ซ้ำ กับแบบ composite ที่คู่ partition key และ sort key ต้องไม่ซ้ำ"
	font-size="13"
>
	<!-- left panel: simple key -->
	<g>
		<text x="30" y="26" font-weight="600" font-size="13.5">Partition key อย่างเดียว</text>
		<rect
			x="30"
			y="38"
			width="300"
			height="160"
			rx="10"
			fill="var(--color-surface)"
			stroke="var(--color-ink)"
			stroke-width="1.5"
		/>
		<!-- header row -->
		<rect
			x="46"
			y="52"
			width="130"
			height="26"
			rx="5"
			fill="var(--color-accent-soft)"
			stroke="var(--color-accent-deep)"
			stroke-width="1"
		/>
		<text
			x="111"
			y="69"
			text-anchor="middle"
			font-size="11.5"
			fill="var(--color-accent-deep)"
			font-weight="600">partition key</text
		>
		<text x="220" y="69" text-anchor="middle" font-size="11.5" fill="var(--color-muted)">item</text>
		<!-- rows: unique keys -->
		{#each ['u1', 'u2', 'u3'] as k, idx (k)}
			<rect
				x="46"
				y={86 + idx * 34}
				width="130"
				height="26"
				rx="5"
				fill="var(--color-paper)"
				stroke="var(--color-line)"
			/>
			<text
				x="111"
				y={103 + idx * 34}
				text-anchor="middle"
				font-size="12"
				font-family="var(--font-mono)">{k}</text
			>
			<text x="220" y={103 + idx * 34} text-anchor="middle" font-size="11" fill="var(--color-muted)"
				>แถวที่ {idx + 1}</text
			>
		{/each}
		<text x="180" y="224" text-anchor="middle" fill="var(--color-muted)" font-size="11"
			>ค่า partition key ต้องไม่ซ้ำกันทั้งตาราง</text
		>
	</g>

	<!-- right panel: composite key -->
	<g>
		<text x="390" y="26" font-weight="600" font-size="13.5"
			>Partition key + Sort key (composite)</text
		>
		<rect
			x="390"
			y="38"
			width="300"
			height="160"
			rx="10"
			fill="var(--color-surface)"
			stroke="var(--color-ink)"
			stroke-width="1.5"
		/>
		<rect
			x="406"
			y="52"
			width="120"
			height="26"
			rx="5"
			fill="var(--color-accent-soft)"
			stroke="var(--color-accent-deep)"
			stroke-width="1"
		/>
		<text
			x="466"
			y="69"
			text-anchor="middle"
			font-size="11.5"
			fill="var(--color-accent-deep)"
			font-weight="600">partition key</text
		>
		<rect
			x="534"
			y="52"
			width="120"
			height="26"
			rx="5"
			fill="var(--color-paper)"
			stroke="var(--color-ink)"
			stroke-width="1"
		/>
		<text x="594" y="69" text-anchor="middle" font-size="11.5" font-weight="600">sort key</text>
		<!-- u1 group: 3 sort keys -->
		{#each ['t1', 't2', 't3'] as sk, idx (sk)}
			<rect
				x="406"
				y={86 + idx * 26}
				width="120"
				height="22"
				rx="5"
				fill="var(--color-paper)"
				stroke="var(--color-line)"
			/>
			<text
				x="466"
				y={101 + idx * 26}
				text-anchor="middle"
				font-size="11.5"
				font-family="var(--font-mono)">u1</text
			>
			<rect
				x="534"
				y={86 + idx * 26}
				width="120"
				height="22"
				rx="5"
				fill="var(--color-paper)"
				stroke="var(--color-line)"
			/>
			<text
				x="594"
				y={101 + idx * 26}
				text-anchor="middle"
				font-size="11.5"
				font-family="var(--font-mono)">{sk}</text
			>
		{/each}
		<!-- u2 group: 1 sort key -->
		<rect
			x="406"
			y="164"
			width="120"
			height="22"
			rx="5"
			fill="var(--color-paper)"
			stroke="var(--color-line)"
		/>
		<text x="466" y="179" text-anchor="middle" font-size="11.5" font-family="var(--font-mono)"
			>u2</text
		>
		<rect
			x="534"
			y="164"
			width="120"
			height="22"
			rx="5"
			fill="var(--color-paper)"
			stroke="var(--color-line)"
		/>
		<text x="594" y="179" text-anchor="middle" font-size="11.5" font-family="var(--font-mono)"
			>t9</text
		>
		<text x="540" y="224" text-anchor="middle" fill="var(--color-muted)" font-size="11"
			>partition key ซ้ำได้ — แต่คู่ (partition, sort) ต้องไม่ซ้ำ</text
		>
	</g>
</svg>
