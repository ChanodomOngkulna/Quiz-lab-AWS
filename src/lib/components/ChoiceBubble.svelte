<script>
	/**
	 * Answer-sheet bubble with the letter ก ข ค ง.
	 * state: default | selected | correct | wrong | dim
	 */
	let { letter, state = 'default', size = 'md' } = $props();

	const sizes = {
		md: 'h-8 w-8 text-[14px]',
		sm: 'h-6.5 w-6.5 text-[12px]',
		xs: 'h-5 w-5 text-[10.5px]'
	};
	const states = {
		default: 'border-line bg-surface text-ink',
		selected: 'border-accent-deep bg-accent text-white',
		correct: 'border-correct bg-correct text-white',
		wrong: 'border-wrong bg-wrong text-white',
		dim: 'border-line bg-surface text-muted'
	};
</script>

<span
	class="flex shrink-0 items-center justify-center rounded-full border-2 font-semibold transition-colors duration-200 {sizes[
		size
	]} {states[state]} {state === 'selected' ? 'bubble-pop' : ''}"
	aria-hidden="true"
>
	{letter}
</span>

<style>
	.bubble-pop {
		animation: bubble-pop 240ms ease-out;
	}
	@keyframes bubble-pop {
		0% {
			transform: scale(1);
		}
		45% {
			transform: scale(1.22);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
