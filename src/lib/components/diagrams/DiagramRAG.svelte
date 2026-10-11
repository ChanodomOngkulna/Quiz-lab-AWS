<svg
	viewBox="0 0 760 200"
	class="block w-full min-w-[640px]"
	role="img"
	aria-label="ไดอะแกรมขั้นตอนของ RAG: Ingestion ไป Storage ไป Retrieval ไป Generation"
	font-size="13"
>
	<!-- stage boxes -->
	{#each [{ x: 20, n: '1', title: 'Ingestion', sub: ['อ่านเอกสาร → ตัด chunk', '→ แปลงเป็นเวกเตอร์'] }, { x: 200, n: '2', title: 'Storage', sub: ['เก็บเวกเตอร์', 'ลง Vector Database'] }, { x: 380, n: '3', title: 'Retrieval', sub: ['ค้นข้อความที่ความหมาย', 'ใกล้คำถามที่สุด'] }, { x: 560, n: '4', title: 'Generation', sub: ['LLM เรียบเรียงคำตอบ', 'จาก context ที่ดึงมา'] }] as stage (stage.title)}
		<g>
			<rect
				x={stage.x}
				y="48"
				width="170"
				height="92"
				rx="10"
				fill="var(--color-surface)"
				stroke="var(--color-ink)"
				stroke-width="1.5"
			/>
			<circle cx={stage.x + 24} cy="48" r="13" fill="var(--color-accent)" />
			<text
				x={stage.x + 24}
				y="52.5"
				text-anchor="middle"
				fill="#fff"
				font-weight="600"
				font-size="12.5"
			>
				{stage.n}
			</text>
			<text x={stage.x + 85} y="84" text-anchor="middle" font-weight="600" font-size="14.5">
				{stage.title}
			</text>
			<text x={stage.x + 85} y="106" text-anchor="middle" fill="var(--color-muted)" font-size="11">
				{stage.sub[0]}
			</text>
			<text x={stage.x + 85} y="123" text-anchor="middle" fill="var(--color-muted)" font-size="11">
				{stage.sub[1]}
			</text>
		</g>
	{/each}

	<!-- arrows -->
	{#each [190, 370, 550] as ax (ax)}
		<path
			d="M {ax} 94 L {ax + 10} 94"
			stroke="var(--color-ink)"
			stroke-width="1.5"
			marker-end="url(#rag-arrow)"
		/>
	{/each}
	<defs>
		<marker
			id="rag-arrow"
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

	<!-- input / output labels -->
	<text x="105" y="30" text-anchor="middle" fill="var(--color-muted)" font-size="11.5">
		เอกสาร PDF กรมธรรม์ / คู่มือ
	</text>
	<path
		d="M 105 34 L 105 46"
		stroke="var(--color-muted)"
		stroke-width="1.2"
		stroke-dasharray="3 3"
	/>
	<text x="645" y="30" text-anchor="middle" fill="var(--color-muted)" font-size="11.5">
		คำตอบที่อ้างอิงเอกสารจริง
	</text>
	<path
		d="M 645 34 L 645 46"
		stroke="var(--color-muted)"
		stroke-width="1.2"
		stroke-dasharray="3 3"
	/>

	<text x="380" y="176" text-anchor="middle" fill="var(--color-muted)" font-size="11.5">
		คำถามของผู้ใช้เข้าที่ขั้น Retrieval — ระบบจับคู่ความหมายแทนการเทียบคำตรงตัว
	</text>
</svg>
