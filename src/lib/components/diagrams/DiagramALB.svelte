<svg
	viewBox="0 0 720 320"
	class="block w-full min-w-[600px]"
	role="img"
	aria-label="สถาปัตยกรรมเว็บ Multi-AZ: ผู้ใช้เข้าผ่าน ALB ที่ครอบสอง AZ แต่ละ AZ มี target group ของ EC2"
	font-size="13"
>
	<!-- user -->
	<circle
		cx="360"
		cy="22"
		r="9"
		fill="var(--color-surface)"
		stroke="var(--color-ink)"
		stroke-width="1.5"
	/>
	<circle cx="360" cy="18" r="3" fill="var(--color-ink)" />
	<text x="382" y="27" fill="var(--color-muted)" font-size="12"
		>ผู้ใช้ (เข้าผ่าน DNS name ของ ALB)</text
	>
	<path
		d="M 360 32 L 360 56"
		stroke="var(--color-ink)"
		stroke-width="1.5"
		marker-end="url(#alb-arrow)"
	/>

	<!-- ALB bar -->
	<rect
		x="130"
		y="60"
		width="460"
		height="42"
		rx="9"
		fill="var(--color-accent-soft)"
		stroke="var(--color-accent-deep)"
		stroke-width="1.5"
	/>
	<text
		x="360"
		y="86"
		text-anchor="middle"
		font-weight="600"
		font-size="14"
		fill="var(--color-accent-deep)"
	>
		Application Load Balancer — กระจายอยู่ในอย่างน้อย 2 AZ
	</text>

	<!-- arrows to AZs -->
	<path
		d="M 250 102 L 250 130"
		stroke="var(--color-ink)"
		stroke-width="1.5"
		marker-end="url(#alb-arrow)"
	/>
	<path
		d="M 470 102 L 470 130"
		stroke="var(--color-ink)"
		stroke-width="1.5"
		marker-end="url(#alb-arrow)"
	/>
	<defs>
		<marker
			id="alb-arrow"
			viewBox="0 0 8 8"
			refX="7"
			refY="4"
			markerWidth="7"
			markerHeight="7"
			orient="auto"
		>
			<path d="M0,0 L8,4 L0,8 z" fill="var(--color-ink)" />
		</marker>
	</defs>

	<!-- AZ boxes -->
	{#each [{ x: 50, label: 'Availability Zone A' }, { x: 380, label: 'Availability Zone B' }] as az (az.label)}
		<g>
			<rect
				x={az.x}
				y="134"
				width="290"
				height="128"
				rx="10"
				fill="var(--color-surface)"
				stroke="var(--color-muted)"
				stroke-width="1.2"
				stroke-dasharray="5 4"
			/>
			<text x={az.x + 14} y="156" fill="var(--color-muted)" font-size="11.5">{az.label}</text>
			<text x={az.x + 14} y="186" font-size="12.5">Target group</text>
			<rect
				x={az.x + 118}
				y="170"
				width="72"
				height="42"
				rx="7"
				fill="var(--color-paper)"
				stroke="var(--color-ink)"
				stroke-width="1.5"
			/>
			<text x={az.x + 154} y="188" text-anchor="middle" font-size="12">EC2</text>
			<circle cx={az.x + 154} cy="200" r="3.5" fill="var(--color-correct)" />
			<rect
				x={az.x + 200}
				y="170"
				width="72"
				height="42"
				rx="7"
				fill="var(--color-paper)"
				stroke="var(--color-ink)"
				stroke-width="1.5"
			/>
			<text x={az.x + 236} y="188" text-anchor="middle" font-size="12">EC2</text>
			<circle cx={az.x + 236} cy="200" r="3.5" fill="var(--color-correct)" />
			<text x={az.x + 14} y="238" fill="var(--color-muted)" font-size="10.5">
				health check ผ่าน → รับ traffic
			</text>
		</g>
	{/each}

	<text x="360" y="292" text-anchor="middle" fill="var(--color-muted)" font-size="11.5">
		ALB หลีกเลี่ยงเครื่องที่ health check ไม่ผ่าน — ถ้า AZ ใดล่ม อีก AZ ยังให้บริการต่อ
	</text>
</svg>
