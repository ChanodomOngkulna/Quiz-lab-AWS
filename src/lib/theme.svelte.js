import { browser } from '$app/environment';

const STORAGE_KEY = 'quiz_theme';

class ThemeStore {
	current = $state('light');

	constructor() {
		if (browser) {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved === 'dark' || saved === 'light') {
				this.current = saved;
			} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
				this.current = 'dark';
			} else {
				this.current = 'light';
			}
			this.apply();

			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
				if (!localStorage.getItem(STORAGE_KEY)) {
					this.current = e.matches ? 'dark' : 'light';
					this.apply();
				}
			});
		}
	}

	get isDark() {
		return this.current === 'dark';
	}

	toggle() {
		this.current = this.current === 'dark' ? 'light' : 'dark';
		if (browser) {
			localStorage.setItem(STORAGE_KEY, this.current);
			this.apply();
		}
	}

	setTheme(mode) {
		if (mode !== 'dark' && mode !== 'light') return;
		this.current = mode;
		if (browser) {
			localStorage.setItem(STORAGE_KEY, this.current);
			this.apply();
		}
	}

	apply() {
		if (!browser) return;
		const isDark = this.current === 'dark';
		if (isDark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
		const meta = document.querySelector('meta[name="theme-color"]');
		if (meta) {
			meta.setAttribute('content', isDark ? '#121316' : '#fbfaf6');
		}
	}
}

export const theme = new ThemeStore();
