<script>
	import { theme } from '$lib/theme.svelte.js';

	const isDark = $derived(theme.isDark);
</script>

<button
	type="button"
	role="switch"
	aria-checked={isDark}
	aria-label={isDark ? 'สลับเป็นธีมสว่าง' : 'สลับเป็นธีมมืด'}
	title={isDark ? 'เปลี่ยนเป็นธีมสว่าง (Light mode)' : 'เปลี่ยนเป็นธีมมืด (Dark mode)'}
	onclick={() => theme.toggle()}
	class="group relative inline-flex h-7 w-[48px] shrink-0 cursor-pointer items-center rounded-full border border-line bg-surface p-0.5 transition-all duration-200 hover:border-accent focus-visible:outline-2 focus-visible:outline-accent active:scale-95 sm:h-7.5 sm:w-[52px]"
>
	<!-- Track background ambient icons -->
	<div
		class="pointer-events-none flex w-full items-center justify-between px-1 text-muted/60 transition-opacity"
		aria-hidden="true"
	>
		<!-- Mini Sun icon (left side of track) -->
		<svg
			class="h-3 w-3 transition-colors duration-200 {isDark
				? 'text-muted/40'
				: 'text-accent opacity-0'}"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<circle cx="12" cy="12" r="4" />
			<path
				d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
			/>
		</svg>

		<!-- Mini Moon icon (right side of track) -->
		<svg
			class="h-3 w-3 transition-colors duration-200 {isDark
				? 'text-accent opacity-0'
				: 'text-muted/50'}"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
		</svg>
	</div>

	<!-- Sliding Thumb Knob -->
	<span
		class="pointer-events-none absolute inline-flex h-5.5 w-5.5 items-center justify-center rounded-full border border-line bg-paper shadow-sm transition-transform duration-200 ease-out sm:h-6 sm:w-6
			{isDark ? 'translate-x-[22px] sm:translate-x-[24px]' : 'translate-x-0.5'}"
		aria-hidden="true"
	>
		{#if isDark}
			<!-- Moon icon inside knob -->
			<svg
				class="h-3.5 w-3.5 rotate-[-12deg] text-accent transition-transform duration-200"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<path
					d="M12.3 2a10 10 0 0 0-.19 1.4 10 10 0 0 0 10 10c.5 0 .97-.07 1.43-.19A10 10 0 1 1 12.3 2Z"
				/>
			</svg>
		{:else}
			<!-- Sun icon inside knob -->
			<svg
				class="h-3.5 w-3.5 text-accent transition-transform duration-200"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
				<path
					d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
				/>
			</svg>
		{/if}
	</span>
</button>
