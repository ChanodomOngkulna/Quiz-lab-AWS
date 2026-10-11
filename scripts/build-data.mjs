// Build script: parse AWS-Quiz/*.md into structured JSON under src/lib/data/
// Usage: npm run build:data
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

// ---------- inline text transforms (markdown-ish -> HTML) ----------
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function tex(s) {
	return s
		.replace(/\\ge\b/g, '≥')
		.replace(/\\le\b/g, '≤')
		.replace(/\\ne\b/g, '≠')
		.replace(/\\times\b/g, '×')
		.replace(/\\text\{([^}]*)\}/g, '$1')
		.replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>')
		.replace(/\^(\S)/g, '<sup>$1</sup>');
}

function inline(raw) {
	let s = esc(raw);
	s = s.replace(/\$([^$]+?)\$/g, (_, m) => tex(m));
	s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
	s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
	s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
	s = s.replace(
		/(^|[\s>])(https?:\/\/[^\s<]+)/g,
		'$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>'
	);
	return s;
}

// ---------- quiz.md ----------
const CATS = { 1: 'aws', 2: 'rag', 3: 'subnet' };

function parseQuiz(md) {
	const lines = md.split('\n');
	const out = [];
	let cat = null;
	let catLabel = '';
	let cur = null;
	let lastExp = null;

	const flushExp = () => {
		lastExp = null;
	};

	for (const line of lines) {
		let m;
		if ((m = line.match(/^## หมวดที่ (\d+):\s*(.+)$/))) {
			cat = CATS[+m[1]];
			catLabel = m[2].trim();
			continue;
		}
		if ((m = line.match(/^### ข้อ (\d+)$/))) {
			cur = {
				id: +m[1],
				category: cat,
				categoryLabel: catLabel,
				scenario: '',
				choices: [],
				answerKey: null,
				explanations: [],
				notes: []
			};
			out.push(cur);
			continue;
		}
		if (!cur) continue;
		if ((m = line.match(/^\*\*สถานการณ์:\*\*\s*(.*)$/))) {
			cur.scenario = inline(m[1]);
			continue;
		}
		if ((m = line.match(/^\* ([ก-ง])\)\s*(.*)$/))) {
			cur.choices.push({ key: m[1], text: inline(m[2]) });
			continue;
		}
		if ((m = line.match(/^> \*\*เฉลย:\*\*\s*([ก-ง])\s*$/))) {
			cur.answerKey = m[1];
			continue;
		}
		if (/^> \*\*คำอธิบาย/.test(line)) {
			flushExp();
			continue;
		}
		if ((m = line.match(/^>\s{2,}\* (.+)$/))) {
			// sub bullet under the previous explanation/note
			const t = inline(m[1]);
			if (lastExp) lastExp.text += '\n' + t;
			else if (cur.notes.length) cur.notes[cur.notes.length - 1] += '\n' + t;
			continue;
		}
		if ((m = line.match(/^> \* \*\*(.+?)\*\*:?\s*(.*)$/))) {
			const label = m[1].trim().replace(/:$/, '');
			const lm = label.match(/^([ก-ง](?:\s*,\s*[ก-ง])*)\s+(ถูก|ผิด)$/);
			if (lm) {
				lastExp = {
					keys: lm[1].split(/\s*,\s*/),
					verdict: lm[2] === 'ถูก' ? 'correct' : 'wrong',
					text: inline(m[2] || '')
				};
				cur.explanations.push(lastExp);
			} else {
				flushExp();
				cur.notes.push(inline('**' + label + ':** ' + (m[2] || '')));
			}
			continue;
		}
		if ((m = line.match(/^> \* (.+)$/))) {
			flushExp();
			cur.notes.push(inline(m[1]));
			continue;
		}
		if (/^>\s*$/.test(line)) {
			flushExp();
			continue;
		}
		if (/^---\s*$/.test(line)) {
			cur = null;
			continue;
		}
	}

	// expand grouped explanation keys into one entry per choice key
	for (const q of out) {
		q.explanations = q.explanations.flatMap((e) =>
			e.keys.map((k) => ({ key: k, verdict: e.verdict, text: e.text }))
		);
		q.explanations = q.explanations.filter((e) => e.text.trim().length > 0);
	}
	return out;
}

function verifyQuiz(qs) {
	const fail = (msg) => {
		throw new Error('quiz: ' + msg);
	};
	if (qs.length !== 100) fail(`expected 100 questions, got ${qs.length}`);
	const counts = { aws: 0, rag: 0, subnet: 0 };
	for (const q of qs) {
		counts[q.category] = (counts[q.category] ?? 0) + 1;
		const where = `ข้อ ${q.id}`;
		if (!q.scenario) fail(`${where}: missing scenario`);
		if (q.choices.length !== 4) fail(`${where}: expected 4 choices, got ${q.choices.length}`);
		const keys = q.choices.map((c) => c.key);
		if (new Set(keys).size !== 4) fail(`${where}: duplicate choice keys`);
		if (!keys.includes(q.answerKey)) fail(`${where}: answerKey ${q.answerKey} not in choices`);
		if (q.explanations.length === 0 && q.notes.length === 0)
			fail(`${where}: no explanations and no notes`);
		if (q.explanations.length > 0) {
			const correct = q.explanations.filter(
				(e) => e.verdict === 'correct' && e.key === q.answerKey
			);
			if (correct.length === 0) fail(`${where}: no correct explanation for answer ${q.answerKey}`);
		}
	}
	if (counts.aws !== 40 || counts.rag !== 30 || counts.subnet !== 30)
		fail(`category counts wrong: ${JSON.stringify(counts)}`);
	return counts;
}

// ---------- summarize.md ----------
const levelOf = (indent) => (indent < 2 ? 0 : indent < 8 ? 1 : indent < 12 ? 2 : 3);

function listNode(text) {
	return { text, plain: [], children: null };
}

// parse a run of list lines into {ordered, items} (nested tree)
function buildList(run) {
	const root = { ordered: run[0].marker === 'num', items: [] };
	const st = [{ group: root, level: 0, node: null }];
	const attach = (f) => {
		if (f.node && f.group.items.length > 0) f.node.children = f.group;
	};
	for (const entry of run) {
		const level = levelOf(entry.indent);
		while (st.length > 1 && st[st.length - 1].level >= level) attach(st.pop());
		const node = listNode(inline(entry.text));
		if (entry.check) node.check = true;
		if (entry.plain) node.plain.push(inline(entry.plain.trim()));
		st[st.length - 1].group.items.push(node);
		st.push({ group: { ordered: entry.marker === 'num', items: [] }, level, node });
	}
	while (st.length > 1) attach(st.pop());
	return root;
}

function parseBlocks(body) {
	const lines = body.split('\n');
	const blocks = [];
	let para = [];
	let listRun = [];
	let table = null;
	let callout = null;
	let fence = null;

	const isListItem = (l) =>
		l.match(/^(\s*)- \[ \]\s+(.*)$/) ||
		l.match(/^(\s*)[-*]\s+(.*)$/) ||
		l.match(/^(\s*)(\d+)\.\s+(.*)$/);

	const flushPara = () => {
		if (para.length) {
			blocks.push({ type: 'p', text: inline(para.join(' ')) });
			para = [];
		}
	};
	const flushList = () => {
		if (listRun.length) {
			if (listRun.every((e) => e.check))
				blocks.push({ type: 'checklist', items: listRun.map((e) => inline(e.text)) });
			else blocks.push({ type: 'list', list: buildList(listRun) });
			listRun = [];
		}
	};
	const flushTable = () => {
		if (table) {
			blocks.push(table);
			table = null;
		}
	};
	const flushCallout = () => {
		if (callout) {
			blocks.push({ type: 'callout', text: callout });
			callout = null;
		}
	};
	const flushAll = () => {
		flushPara();
		flushList();
		flushTable();
		flushCallout();
	};

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		if (fence !== null) {
			if (/^```/.test(line)) {
				if (fence.lang === 'text' && /Application Load Balancer/.test(fence.text)) {
					blocks.push({ type: 'diagram', id: 'alb-multi-az' });
				} else {
					blocks.push({ type: 'code', lang: fence.lang || 'text', text: fence.text });
				}
				fence = null;
			} else {
				fence.text += (fence.text ? '\n' : '') + line;
			}
			continue;
		}
		let m;
		if ((m = line.match(/^```(\w*)/))) {
			flushAll();
			fence = { lang: m[1], text: '' };
			continue;
		}
		if (/^\s*$/.test(line)) {
			// loose lists: blank between items keeps the list open
			const next = lines[i + 1] ?? '';
			if (listRun.length && isListItem(next)) continue;
			flushAll();
			continue;
		}
		if ((m = line.match(/^(#{1,4})\s+(.*)$/))) {
			flushAll();
			blocks.push({ type: 'h' + m[1].length, text: m[2].replace(/^\d+(\.\d+)*\.?\s+/, '') });
			continue;
		}
		if ((m = line.match(/^>\s?(.*)$/))) {
			flushPara();
			flushList();
			flushTable();
			if (!callout) callout = '';
			callout += (callout ? (m[1].trim() ? '\n' : '\n\n') : '') + (m[1].trim() ? inline(m[1]) : '');
			continue;
		}
		if ((m = line.match(/^\|(.+)\|\s*$/)) && !/^\|[-\s|:]+\|$/.test(line)) {
			flushPara();
			flushList();
			const cells = m[1].split('|').map((c) => inline(c.trim()));
			if (!table) table = { type: 'table', header: cells, rows: [] };
			else table.rows.push(cells);
			continue;
		}
		if (/^\|[-\s|:]+\|\s*$/.test(line)) continue;
		if ((m = line.match(/^(\s*)- \[ \]\s+(.*)$/))) {
			flushPara();
			listRun.push({ indent: m[1].length, marker: 'bullet', text: m[2], check: true });
			continue;
		}
		if ((m = line.match(/^(\s*)[-*]\s+(.*)$/))) {
			flushPara();
			listRun.push({ indent: m[1].length, marker: 'bullet', text: m[2] });
			continue;
		}
		if ((m = line.match(/^(\s*)(\d+)\.\s+(.*)$/))) {
			flushPara();
			listRun.push({ indent: m[1].length, marker: 'num', text: m[3] });
			continue;
		}
		if ((m = line.match(/^(\s{2,})(\S.*)$/)) && listRun.length) {
			// continuation line (no marker) -> plain text under previous item
			listRun[listRun.length - 1].plain = (listRun[listRun.length - 1].plain || '') + ' ' + m[2];
			continue;
		}
		if (/^---\s*$/.test(line)) {
			flushAll();
			continue;
		}
		flushList();
		flushTable();
		flushCallout();
		para.push(line.trim());
	}
	flushAll();
	return blocks.filter((b) => !(b.type === 'h2' && /^สารบัญ/.test(b.text)));
}

function injectDiagrams(slug, blocks) {
	const out = [];
	for (const b of blocks) {
		out.push(b);
		const text = b.type === 'list' ? JSON.stringify(b.list) : b.text || '';
		if (
			slug === 'rag-langchain' &&
			b.type === 'list' &&
			/Ingestion/.test(text) &&
			/Generation/.test(text) &&
			!out.some((x) => x.type === 'diagram' && x.id === 'rag-pipeline')
		) {
			out.push({ type: 'diagram', id: 'rag-pipeline' });
		}
		if (slug === 'subnetting' && b.type === 'table' && !out.some((x) => x.type === 'diagram')) {
			out.push({ type: 'diagram', id: 'subnet-blocks' });
		}
		if (
			slug === 'dynamodb' &&
			b.type === 'list' &&
			/composite/.test(text) &&
			!out.some((x) => x.type === 'diagram')
		) {
			out.push({ type: 'diagram', id: 'dynamodb-keys' });
		}
	}
	return out;
}

const SLUGS = {
	1: 'dynamodb',
	2: 'efs',
	3: 'iam-security',
	4: 'auto-scaling',
	5: 'ha-web',
	6: 'comparison'
};

function parseSummaries(md) {
	// split into documents at h1 lines
	const docs = md.split(/^# /m).filter((d) => d.trim());
	const [doc1, doc2, doc3] = docs.map((d) => '# ' + d);
	const topics = {};

	// --- doc 1: AWS labs (## N. sections) ---
	const labSections = doc1.split(/^## /m).filter((s) => s.trim());
	for (const sec of labSections) {
		const [head, ...rest] = sec.split('\n');
		const rawTitle = head.replace(/^#\s*/, '').trim();
		const numMatch = rawTitle.match(/^(\d+)\./);
		const title = rawTitle.replace(/^\d+\.\s*/, '');
		if (!numMatch) continue; // intro / สารบัญ
		const num = +numMatch[1];
		if (num === 7) continue; // references merged into comparison
		const slug = SLUGS[num];
		const body = rest.join('\n');
		let blocks = parseBlocks(body);
		blocks = injectDiagrams(slug, blocks);
		topics[slug] = { slug, title, blocks };
		if (num === 6) {
			const refs = doc1.split(/^## 7\./m)[1];
			if (refs) topics[slug].blocks.push(...parseBlocks(refs));
		}
	}
	// doc-level intro callouts -> inject into the 5 lab pages
	const introBlocks = parseBlocks(doc1.split(/^## /m)[0]);
	const introCallouts = introBlocks.filter(
		(b) => b.type === 'callout' && b.text.includes('ข้อควรทราบ')
	);
	for (const slug of ['dynamodb', 'efs', 'iam-security', 'auto-scaling', 'ha-web']) {
		if (topics[slug]) topics[slug].blocks.unshift(...introCallouts);
	}

	// --- docs 2 & 3 ---
	const parseStandalone = (doc, slug, title, kicker) => {
		const body = doc.replace(/^#.*\n?/, '');
		let blocks = parseBlocks(body);
		blocks = injectDiagrams(slug, blocks);
		topics[slug] = { slug, title, kicker, blocks };
	};
	parseStandalone(doc2, 'rag-langchain', 'Google Skill (RAG) และ LangChain Lab', 'สรุปสอบ');
	parseStandalone(doc3, 'subnetting', 'คู่มือการคำนวณ Subnetting', 'พื้นฐานเครือข่าย');

	return topics;
}

function verifySummaries(topics) {
	const fail = (msg) => {
		throw new Error('summaries: ' + msg);
	};
	const expected = [
		'dynamodb',
		'efs',
		'iam-security',
		'auto-scaling',
		'ha-web',
		'comparison',
		'rag-langchain',
		'subnetting'
	];
	for (const slug of expected) {
		if (!topics[slug]) fail(`missing topic ${slug}`);
		if (topics[slug].blocks.length < 3)
			fail(`${slug}: too few blocks (${topics[slug].blocks.length})`);
	}
	const hasDiagram = (slug, id) =>
		topics[slug].blocks.some((b) => b.type === 'diagram' && b.id === id);
	if (!hasDiagram('ha-web', 'alb-multi-az')) fail('ha-web missing ALB diagram');
	if (!hasDiagram('rag-langchain', 'rag-pipeline')) fail('rag missing pipeline diagram');
	if (!hasDiagram('subnetting', 'subnet-blocks')) fail('subnetting missing blocks diagram');
	if (!hasDiagram('dynamodb', 'dynamodb-keys')) fail('dynamodb missing keys diagram');
	if (!topics.comparison.blocks.some((b) => b.type === 'table')) fail('comparison missing table');
	if (!topics.comparison.blocks.some((b) => b.type === 'checklist'))
		fail('comparison missing checklist');
}

// ---------- main ----------
function main() {
	const quiz = parseQuiz(read('AWS-Quiz/quiz.md'));
	const counts = verifyQuiz(quiz);
	const summaries = parseSummaries(read('AWS-Quiz/summarize.md'));
	verifySummaries(summaries);

	mkdirSync(join(root, 'src/lib/data/summaries'), { recursive: true });
	writeFileSync(join(root, 'src/lib/data/quiz.json'), JSON.stringify(quiz, null, '\t') + '\n');
	for (const t of Object.values(summaries)) {
		writeFileSync(
			join(root, `src/lib/data/summaries/${t.slug}.json`),
			JSON.stringify(t, null, '\t') + '\n'
		);
	}
	console.log('quiz:', quiz.length, 'questions', JSON.stringify(counts));
	console.log('summaries:', Object.keys(summaries).join(', '));
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) main();

export { parseQuiz, parseBlocks, parseSummaries, buildList, inline };
