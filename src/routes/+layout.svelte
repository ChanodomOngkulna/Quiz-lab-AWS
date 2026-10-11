<script>
	import { page } from '$app/state';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	const links = [
		{ href: '/', label: 'หน้าหลัก' },
		{ href: '/summary', label: 'สรุปเนื้อหา' },
		{ href: '/quiz', label: 'แบบทดสอบ' }
	];

	const isActive = (href) =>
		href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<a
	href="#main"
	class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-surface focus:px-4 focus:py-2"
>
	ข้ามไปที่เนื้อหา
</a>

<header class="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
	<div class="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
		<a
			href="/"
			class="flex items-center gap-2.5 font-semibold text-ink"
			aria-label="กระดาษคำตอบ — หน้าหลัก"
		>
			<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
				<circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="2" />
				<circle cx="12" cy="12" r="4.5" fill="var(--color-accent)" />
			</svg>
			<span class="text-[15px]">AWS-Quiz-CPE</span>
		</a>
		<nav aria-label="เมนูหลัก">
			<ul class="flex items-center gap-1 sm:gap-2">
				{#each links as link (link.href)}
					<li>
						<a
							href={link.href}
							aria-current={isActive(link.href) ? 'page' : undefined}
							class="group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[14px] transition-colors
								{isActive(link.href) ? 'font-medium text-ink' : 'text-muted hover:text-ink'}"
						>
							<span
								class="h-1.5 w-1.5 rounded-full transition-all duration-200
									{isActive(link.href)
									? 'animate-dot-in bg-accent'
									: 'scale-100 bg-transparent group-hover:scale-150 group-hover:bg-accent/60'}"
							></span>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
</header>

<main id="main" class="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
	{@render children()}
</main>

<footer class="border-t border-line">
	<div
		class="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-[13px] text-muted sm:px-6"
	>
		<p>สรุปและข้อสอบจากเอกสารในรายวิชา — ทบทวนก่อนเข้าห้องสอบ</p>
		<a
			href="/summary/comparison"
			class="underline decoration-line underline-offset-4 hover:text-ink"
		>
			แหล่งอ้างอิง AWS
		</a>
	</div>
</footer>
