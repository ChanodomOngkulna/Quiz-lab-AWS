<svg
	viewBox="0 0 140 130"
	class="h-20 w-20"
	role="img"
	aria-label="ภาพดินสอกำลังระบายคำตอบลงในบับเบิลข้อสอบ"
>
	<!-- answer bubble -->
	<circle
		cx="52"
		cy="78"
		r="26"
		fill="var(--color-surface)"
		stroke="var(--color-ink)"
		stroke-width="2.5"
	/>
	<text x="52" y="85" text-anchor="middle" font-size="20" font-weight="600" fill="var(--color-ink)"
		>ก</text
	>

	<!-- pencil shading strokes, tucked in the lower-left arc of the bubble -->
	<g stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round">
		<line class="shade s1" x1="40" y1="86" x2="35" y2="92" />
		<line class="shade s2" x1="47" y1="89" x2="42" y2="95" />
		<line class="shade s3" x1="54" y1="91" x2="49" y2="97" />
	</g>

	<!-- pencil, drawn horizontally then rotated toward the bubble -->
	<g transform="translate(64 50) rotate(-35)">
		<g class="pencil-bob">
			<rect x="30" y="0" width="60" height="14" rx="2" fill="var(--color-accent)" />
			<rect x="86" y="0" width="4" height="14" fill="var(--color-accent-deep)" />
			<rect
				x="90"
				y="0"
				width="13"
				height="14"
				rx="3"
				fill="var(--color-wrong-soft)"
				stroke="var(--color-line)"
			/>
			<polygon
				points="30,0 13,7 30,14"
				fill="var(--color-paper)"
				stroke="var(--color-ink)"
				stroke-width="2"
			/>
			<polygon points="19,4.3 13,7 19,9.7" fill="var(--color-ink)" />
		</g>
	</g>
</svg>

<style>
	.pencil-bob {
		animation: pencil-bob 2.4s ease-in-out infinite;
	}
	@keyframes pencil-bob {
		0%,
		100% {
			transform: translate(0, 0);
		}
		25% {
			transform: translate(-2px, 2px);
		}
		50% {
			transform: translate(1px, 3.5px);
		}
		75% {
			transform: translate(2.5px, -1px);
		}
	}
	.shade {
		opacity: 0;
		animation: shade 2.4s ease-in-out infinite;
	}
	.s2 {
		animation-delay: 0.3s;
	}
	.s3 {
		animation-delay: 0.6s;
	}
	@keyframes shade {
		0%,
		20% {
			opacity: 0;
		}
		35%,
		80% {
			opacity: 1;
		}
		95%,
		100% {
			opacity: 0;
		}
	}
</style>
