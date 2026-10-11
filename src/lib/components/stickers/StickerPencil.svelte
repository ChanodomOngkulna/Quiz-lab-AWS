<svg
	viewBox="0 0 140 130"
	class="h-20 w-20"
	role="img"
	aria-label="ภาพดินสอกำลังระบายคำตอบลงในบับเบิลข้อสอบ"
>
	<!-- answer bubble -->
	<circle
		cx="52"
		cy="80"
		r="26"
		fill="var(--color-surface)"
		stroke="var(--color-ink)"
		stroke-width="2.5"
	/>
	<text x="52" y="88" text-anchor="middle" font-size="21" font-weight="600" fill="var(--color-ink)"
		>ก</text
	>

	<!-- pencil shading strokes, appear in sequence -->
	<g stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round">
		<line class="shade s1" x1="43" y1="68" x2="39" y2="74" />
		<line class="shade s2" x1="51" y1="66" x2="47" y2="72" />
		<line class="shade s3" x1="59" y1="68" x2="55" y2="74" />
		<line class="shade s4" x1="65" y1="73" x2="61" y2="79" />
	</g>

	<!-- pencil, drawn horizontally then rotated toward the bubble -->
	<g transform="translate(64 52) rotate(-35)">
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
	.s4 {
		animation-delay: 0.9s;
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
