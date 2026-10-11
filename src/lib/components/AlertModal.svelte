<script>
	/**
	 * Accessible modal popup with pop-in animation.
	 * Closes on Escape, overlay click, or the X button. Locks body scroll while open.
	 */
	let { open = false, title, onClose, children, actions } = $props();

	let card = $state(null);

	$effect(() => {
		if (!open) return;
		document.body.style.overflow = 'hidden';
		card?.focus();
		return () => {
			document.body.style.overflow = '';
		};
	});

	function handleKey(e) {
		if (e.key === 'Escape' && open) onClose();
	}
</script>

<svelte:window onkeydown={handleKey} />

{#if open}
	<div class="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
		<button
			type="button"
			class="animate-fade-in absolute inset-0 cursor-default bg-ink/45 backdrop-blur-[2px]"
			aria-label="ปิดหน้าต่างแจ้งเตือน"
			onclick={onClose}
		></button>
		<div
			bind:this={card}
			role="dialog"
			aria-modal="true"
			aria-labelledby="alert-modal-title"
			tabindex="-1"
			class="animate-pop-in relative max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-line bg-surface p-5 shadow-xl outline-none sm:p-6"
		>
			<div class="flex items-start justify-between gap-4">
				<h2 id="alert-modal-title" class="text-[18px] leading-snug font-semibold">
					{title}
				</h2>
				<button
					type="button"
					onclick={onClose}
					class="-m-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-accent-soft hover:text-ink"
				>
					<span class="sr-only">ปิด</span>
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<path
							d="M6 6l12 12M18 6L6 18"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
						/>
					</svg>
				</button>
			</div>
			{#if children}
				<div class="mt-3">
					{@render children()}
				</div>
			{/if}
			{#if actions}
				<div class="mt-6 flex flex-wrap justify-end gap-2.5">
					{@render actions()}
				</div>
			{/if}
		</div>
	</div>
{/if}
