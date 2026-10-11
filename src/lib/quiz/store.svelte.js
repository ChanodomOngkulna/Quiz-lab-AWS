import { browser } from '$app/environment';
import quizData from '$lib/data/quiz.json';

const KEY_RUN = 'awsquiz:v1:run';
const KEY_STATS = 'awsquiz:v1:stats';
const KEY_PREFS = 'awsquiz:v1:prefs';
const KEY_RESULT = 'awsquiz:v1:result';

function load(key, fallback) {
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}

function save(key, value) {
	try {
		if (value === null) localStorage.removeItem(key);
		else localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// storage unavailable — quiz still works, just no persistence
	}
}

function shuffled(arr) {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

const byId = new Map(quizData.map((q) => [q.id, q]));

class QuizStore {
	phase = $state('idle');
	run = $state(null);
	result = $state(null);
	prefs = $state({ shuffle: true });
	stats = $state({ perQuestion: {}, lastResult: null });
	selected = $state({});
	gridOpen = $state(false);

	constructor() {
		if (!browser) return;
		this.run = load(KEY_RUN, null);
		this.result = load(KEY_RESULT, null);
		this.prefs = { shuffle: true, ...load(KEY_PREFS, {}) };
		this.stats = { perQuestion: {}, lastResult: null, ...load(KEY_STATS, {}) };
	}

	get total() {
		return quizData.length;
	}

	question(id) {
		return byId.get(id);
	}

	get current() {
		if (this.phase !== 'running' || !this.run) return null;
		const id = this.run.order[this.run.index];
		const q = byId.get(id);
		if (!q) return null;
		const order = this.run.choiceOrder[id] ?? [0, 1, 2, 3];
		return { q, choices: order.map((i) => q.choices[i]) };
	}

	get answeredCount() {
		return this.run ? Object.keys(this.run.answers).length : 0;
	}

	get runTotal() {
		return this.run ? this.run.order.length : 0;
	}

	isChecked(id) {
		return this.run?.answers[id] != null;
	}

	answerOf(id) {
		return this.run?.answers[id] ?? null;
	}

	selectedOf(id) {
		return this.selected[id] ?? null;
	}

	isCorrect(id) {
		const a = this.answerOf(id);
		return a != null && a === byId.get(id)?.answerKey;
	}

	isFlagged(id) {
		return this.run?.flags.includes(id) ?? false;
	}

	/** todo | correct | wrong (flag shown separately) */
	stateOf(id) {
		if (!this.isChecked(id)) return 'todo';
		return this.isCorrect(id) ? 'correct' : 'wrong';
	}

	wrongIds() {
		return Object.entries(this.stats.perQuestion)
			.filter(([, s]) => s.wrong > 0)
			.map(([id]) => Number(id));
	}

	setShuffle(v) {
		this.prefs.shuffle = v;
		save(KEY_PREFS, this.prefs);
	}

	startRun(mode = 'full') {
		let ids = mode === 'wrong-only' ? this.wrongIds() : quizData.map((q) => q.id);
		if (ids.length === 0) return;
		if (this.prefs.shuffle) ids = shuffled(ids);
		const choiceOrder = {};
		for (const id of ids) {
			const order = [0, 1, 2, 3];
			choiceOrder[id] = this.prefs.shuffle ? shuffled(order) : order;
		}
		this.run = {
			order: ids,
			choiceOrder,
			index: 0,
			answers: {},
			flags: [],
			startedAt: Date.now(),
			mode
		};
		this.selected = {};
		this.gridOpen = false;
		this.phase = 'running';
		save(KEY_RUN, this.run);
	}

	resume() {
		if (this.run) {
			this.phase = 'running';
			this.gridOpen = false;
		}
	}

	pause() {
		this.phase = 'idle';
	}

	discardRun() {
		this.run = null;
		this.selected = {};
		save(KEY_RUN, null);
	}

	select(id, key) {
		if (!this.run || this.isChecked(id)) return;
		this.selected[id] = key;
	}

	check(id) {
		if (!this.run || this.isChecked(id)) return;
		const key = this.selected[id];
		if (!key) return;
		this.run.answers[id] = key;
		const q = byId.get(id);
		const s = this.stats.perQuestion[id] ?? { seen: 0, wrong: 0 };
		s.seen += 1;
		if (key !== q.answerKey) s.wrong += 1;
		this.stats.perQuestion[id] = s;
		save(KEY_RUN, this.run);
		save(KEY_STATS, this.stats);
	}

	toggleFlag(id) {
		if (!this.run) return;
		const i = this.run.flags.indexOf(id);
		if (i >= 0) this.run.flags.splice(i, 1);
		else this.run.flags.push(id);
		save(KEY_RUN, this.run);
	}

	next() {
		if (!this.run) return;
		if (this.run.index < this.run.order.length - 1) {
			this.run.index += 1;
			save(KEY_RUN, this.run);
		} else {
			this.finish();
		}
	}

	prev() {
		if (this.run && this.run.index > 0) {
			this.run.index -= 1;
			save(KEY_RUN, this.run);
		}
	}

	jump(i) {
		if (this.run && i >= 0 && i < this.run.order.length) {
			this.run.index = i;
			this.gridOpen = false;
			save(KEY_RUN, this.run);
		}
	}

	finish() {
		if (!this.run) return;
		const { order, answers, flags, mode, startedAt } = this.run;
		const score = order.filter((id) => answers[id] === byId.get(id)?.answerKey).length;
		this.result = {
			order,
			answers,
			flags,
			mode,
			startedAt,
			endedAt: Date.now(),
			score,
			total: order.length
		};
		this.stats.lastResult = { score, total: order.length, mode, at: Date.now() };
		this.run = null;
		this.selected = {};
		this.phase = 'finished';
		save(KEY_RESULT, this.result);
		save(KEY_STATS, this.stats);
		save(KEY_RUN, null);
	}

	viewLastResult() {
		if (this.result) this.phase = 'finished';
	}

	restart() {
		this.phase = 'idle';
	}
}

export const quiz = new QuizStore();
