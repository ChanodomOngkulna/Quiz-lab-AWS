<div
	class="rounded-xl border border-line bg-surface p-4 sm:p-5"
	role="img"
	aria-label="สถาปัตยกรรมเว็บ Multi-AZ: ผู้ใช้เข้าผ่าน ALB ที่ครอบสอง Availability Zone แต่ละ Zone มี target group ของ EC2 ที่ผ่าน health check"
>
	<div class="flex items-center gap-2.5">
		<span
			class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-paper"
		>
			<svg class="h-4 w-4 text-ink" viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<circle cx="12" cy="8" r="3.2" stroke="currentColor" stroke-width="2" />
				<path
					d="M5.5 19.5c.8-3.4 3.4-5 6.5-5s5.7 1.6 6.5 5"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
				/>
			</svg>
		</span>
		<p class="text-[12px] text-muted">ผู้ใช้ (เข้าผ่าน DNS name ของ ALB)</p>
	</div>

	<div class="flex justify-center py-1 sm:hidden" aria-hidden="true">
		<svg class="h-4 w-4 text-ink" viewBox="0 0 24 24" fill="none">
			<path
				d="M12 4v14m0 0-5-5m5 5 5-5"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</div>

	<div
		class="rounded-xl border-2 border-accent-deep bg-accent-soft px-3 py-2 text-center text-[13px] leading-snug font-semibold text-accent-deep sm:text-[13.5px]"
	>
		Application Load Balancer — กระจายอยู่ในอย่างน้อย 2 AZ
	</div>

	<div class="hidden py-1 sm:grid sm:grid-cols-2" aria-hidden="true">
		{#each [0, 1] as i (i)}
			<div class="flex justify-center">
				<svg class="h-4 w-4 text-ink" viewBox="0 0 24 24" fill="none">
					<path
						d="M12 4v14m0 0-5-5m5 5 5-5"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>
		{/each}
	</div>

	<div class="grid gap-3 sm:grid-cols-2">
		{#each [{ label: 'Availability Zone A' }, { label: 'Availability Zone B' }] as az (az.label)}
			<section class="rounded-xl border border-dashed border-muted bg-surface p-3">
				<p class="text-[11.5px] text-muted">{az.label}</p>
				<p class="mt-1 text-[12.5px]">Target group</p>
				<div class="mt-1.5 flex flex-wrap gap-2">
					{#each [0, 1] as i (i)}
						<span
							class="flex items-center gap-1.5 rounded-lg border-2 border-ink bg-paper px-2.5 py-1.5 text-[12px]"
						>
							EC2
							<span class="h-2 w-2 rounded-full bg-correct" aria-hidden="true"></span>
						</span>
					{/each}
				</div>
				<p class="mt-1.5 text-[10.5px] text-muted">health check ผ่าน → รับ traffic</p>
			</section>
		{/each}
	</div>

	<p class="mt-3 text-center text-[11.5px] leading-relaxed text-muted">
		ALB หลีกเลี่ยงเครื่องที่ health check ไม่ผ่าน — ถ้า AZ ใดล่ม อีก AZ ยังให้บริการต่อ
	</p>
</div>
