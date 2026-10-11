<script>
	// deterministic pieces — no SSR/hydration mismatch
	const colors = ['var(--color-accent)', 'var(--color-correct)', '#e9c46a', 'var(--color-ink)'];
	const pieces = Array.from({ length: 18 }, (_, i) => ({
		left: ((i * 53) % 96) + 2,
		delay: (((i * 37) % 18) / 10).toFixed(1),
		duration: (2.4 + ((i * 29) % 10) / 10).toFixed(1),
		size: 6 + ((i * 13) % 6),
		color: colors[i % 4],
		round: i % 3 === 0
	}));
</script>

<div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
	{#each pieces as p, i (i)}
		<span
			class="confetti-piece"
			style="left:{p.left}%; width:{p.size}px; height:{p.round
				? p.size
				: p.size * 1.7}px; background:{p.color}; border-radius:{p.round
				? '50%'
				: '2px'}; animation-delay:{p.delay}s; animation-duration:{p.duration}s"
		></span>
	{/each}
</div>

<style>
	.confetti-piece {
		position: absolute;
		top: -14px;
		animation-name: confetti-fall;
		animation-timing-function: cubic-bezier(0.3, 0.4, 0.6, 1);
		animation-iteration-count: 1;
		animation-fill-mode: both;
	}
	@keyframes confetti-fall {
		0% {
			transform: translateY(-16px) rotate(0deg);
			opacity: 0;
		}
		8% {
			opacity: 1;
		}
		100% {
			transform: translateY(320px) rotate(520deg);
			opacity: 0;
		}
	}
</style>
