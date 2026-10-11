# Answer Sheet (กระดาษคำตอบ) — AWS · RAG · Subnetting Exam Review

**English** | [ภาษาไทย](./README.th.md)

A static study website for undergraduate exam review, built with **SvelteKit 2 (Svelte 5) + Tailwind CSS 4** and deployed via `adapter-vercel`. Every page is prerendered to static HTML.

Two main features:

1. **Summary pages** — 8 topics parsed from `AWS-Quiz/summarize.md` (5 AWS Cloud Quest labs, RAG/LangChain, IP Subnetting, plus a comparison table page), including 4 hand-drawn SVG diagrams.
2. **Quiz** — all 100 questions in one continuous run. After answering each question you immediately see the correct answer **with the reason every choice is right or wrong**. Includes question/choice shuffling, flagging, a progress grid, keyboard shortcuts, resume-after-refresh, and a "review only previously-missed questions" mode — all persisted in `localStorage`, no backend.

## Commands

```sh
npm install        # install dependencies
npm run dev        # start dev server
npm run build      # production build (prerenders every page)
npm run preview    # preview the production build
npm run lint       # prettier + eslint
npm run build:data # re-generate src/lib/data/*.json from AWS-Quiz/*.md
```

## Project Structure

```text
Quiz-AWS/
├─ AWS-Quiz/                        # SOURCE CONTENT (read-only, gitignored)
│  ├─ quiz.md                       #   100 exam questions (Thai) — the single source of truth for the quiz
│  └─ summarize.md                  #   All 8 summary topics — the single source of truth for summaries
│
├─ scripts/
│  └─ build-data.mjs                # Markdown → JSON parser with assertions
│                                   #   run: npm run build:data (after editing any .md above)
│
├─ src/
│  ├─ app.html                      # HTML shell: lang="th", <title>, meta description, theme-color
│  │
│  ├─ lib/
│  │  ├─ index.js                   # empty template placeholder (safe to delete)
│  │  ├─ assets/
│  │  │  └─ favicon.svg             # site favicon
│  │  │
│  │  ├─ data/                      # = DATA LAYER (generated + curated metadata)
│  │  │  ├─ quiz.json               #   GENERATED — 100 questions, choices, answers, per-choice
│  │  │  │                          #   explanations + notes. Never edit by hand.
│  │  │  ├─ summaries/*.json        #   GENERATED — 8 topic files as content blocks
│  │  │  │                          #   (h2/h3/p/list-tree/table/callout/code/checklist/diagram).
│  │  │  │                          #   Never edit by hand.
│  │  │  └─ topics.js               #   EDIT HERE to add/reorder topics: imports all summary JSON,
│  │  │                             #   adds Thai display metadata (kicker, desc), topic groups,
│  │  │                             #   quiz category info and category → summary-page links
│  │  │
│  │  ├─ components/                # = SHARED UI
│  │  │  ├─ ChoiceBubble.svelte     #   the ก/ข/ค/ง answer-sheet bubble (default/selected/correct/wrong/dim)
│  │  │  │                          #   with a pop animation when selected
│  │  │  ├─ ExplanationPanel.svelte #   post-answer panel: verdict banner + per-choice explanations
│  │  │  │                          #   + "คำอธิบายเพิ่มเติม" notes. Reused by quiz, results and home sample
│  │  │  ├─ AlertModal.svelte       #   accessible modal popup (pop-in, Escape/overlay close, scroll lock)
│  │  │  │                          #   — used for the first-visit welcome alert on the home page
│  │  │  ├─ BlockRenderer.svelte    #   renders every summary block type; owns summary typography,
│  │  │  │                          #   table/callout/checklist styles and heading anchors (used by TOC)
│  │  │  ├─ stickers/               #   animated SVG stickers (CSS keyframes, reduced-motion safe) —
│  │  │  │                          #   drop real GIF files into static/ and swap here if preferred
│  │  │  │  ├─ StickerPencil.svelte    #  pencil shading an answer bubble (hero/welcome mascot)
│  │  │  │  └─ StickerConfetti.svelte  #  one-shot confetti burst for quiz scores ≥ 80%
│  │  │  └─ diagrams/               #   static SVG diagrams (quiet, consistent stroke style)
│  │  │     ├─ DiagramRAG.svelte            # RAG pipeline: Ingestion → Storage → Retrieval → Generation
│  │  │     ├─ DiagramALB.svelte            # Multi-AZ ALB architecture (replaces the ASCII diagram)
│  │  │     ├─ DiagramSubnetBlocks.svelte   # /26 block chart with Network ID / usable / broadcast
│  │  │     └─ DiagramDynamoDBKey.svelte    # simple vs composite primary key
│  │  │
│  │  └─ quiz/
│  │     └─ store.svelte.js         # = QUIZ BRAIN — Svelte 5 runes class holding the whole
│                                   #   state machine (idle → running → finished), run data
│                                   #   (order, per-question choice order, answers, flags),
│                                   #   stats and preferences, plus all localStorage I/O
│                                   #   (keys prefixed "awsquiz:v1:")
│  │
│  └─ routes/                       # = PAGES (all prerendered via +layout.js)
│     ├─ layout.css                 #   DESIGN TOKENS — Tailwind v4 @theme (colors incl. correct/wrong,
│     │                             #   fonts), fontsource imports (IBM Plex Sans Thai / Mono),
│     │                             #   base styles, motion utilities (rise-in/pop-in/float/btn-lift)
│     │                             #   and reduced-motion rules. Change the look and feel here.
│     ├─ +layout.js                 #   export const prerender = true (applies to every page)
│     ├─ +layout.svelte             #   sticky nav (with active-bubble indicator), footer, skip link
│     ├─ +page.svelte               #   HOME — hero, one interactive sample question (id 82),
│     │                             #   subject areas, recommended study order
│     ├─ summary/
│     │  ├─ +page.svelte            #   summary index — topics grouped by area, hairline list
│     │  └─ [topic]/                #   dynamic route → 8 static pages via entries() in +page.js
│     │     ├─ +page.js             #     entries() for prerender + load() resolving the topic
│     │     └─ +page.svelte         #     topic page: kicker/title, in-page TOC, BlockRenderer,
│     │                             #     prev/next navigation
│     └─ quiz/
│        └─ +page.svelte            #   THE QUIZ — all three phases in one page: start screen
│                                   #   (shuffle toggle, resume, review-wrong, last result),
│                                   #   runner (progress bar, flag, grid navigator, choices,
│                                   #   keyboard 1-4/Enter/F), results (score per category,
│                                   #   wrong/flagged review with full explanations)
│
├─ static/
│  └─ robots.txt                    # served at the site root as-is
│
├─ vite.config.js                   # NO svelte.config.js in this project: SvelteKit, Tailwind v4
│                                   # plugin, runes-mode forcing and adapter-vercel are all
│                                   # configured here
├─ eslint.config.js                 # ESLint (incl. Svelte rules; two rules disabled with reasons)
├─ prettier.config.js               # tabs, single quotes, no trailing commas, width 100
├─ .prettierignore                  # excludes /AWS-Quiz/ so formatters never touch source .md
├─ .gitignore                       # NOTE: AWS-Quiz/ and .agents/ are gitignored (local sources)
├─ .npmrc                           # engine-strict=true
├─ jsconfig.json                    # JS language server config
├─ skills-lock.json                 # locks the .agents skill (design guidance used for the UI)
└─ README.md / README.th.md         # this file (EN) / Thai version
```

## Data Flow

```text
AWS-Quiz/*.md  ──(npm run build:data)──▶  src/lib/data/*.json  ──(static imports)──▶  prerendered HTML
   edit here                                    never edit                          npm run build
```

1. Content lives **only** in `AWS-Quiz/*.md` (Thai). The parser (`scripts/build-data.mjs`) converts them to JSON and runs assertions: exactly 100 questions, category counts 40/30/30, 4 unique choices each, a valid answer key, and at least one explanation or note per question.
2. The generated JSON under `src/lib/data/` is what the app imports — it is committed so builds don't require the markdown.
3. `npm run build` prerenders all 11 pages (home, quiz, summary index, 8 topics) to static HTML.

## Where to Change What (refactoring guide)

| I want to…                                                      | Go to                                                                                                               |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Fix a typo in a question/summary, add questions or topics       | `AWS-Quiz/*.md`, then `npm run build:data`                                                                          |
| Change colors, fonts, spacing, motion                           | `src/routes/layout.css` (`@theme` tokens)                                                                           |
| Change quiz behavior (scoring, persistence, shuffle, modes)     | `src/lib/quiz/store.svelte.js`                                                                                      |
| Change quiz UI (layout of runner/results screens)               | `src/routes/quiz/+page.svelte`                                                                                      |
| Improve how summary content looks (lists, tables, callouts)     | `src/lib/components/BlockRenderer.svelte`                                                                           |
| Redraw or add a diagram                                         | `src/lib/components/diagrams/` (register new ids in `BlockRenderer.svelte` and reference them as a `diagram` block) |
| Add/reorder summary topics, change their titles or descriptions | `src/lib/data/topics.js` (and the parser's `SLUGS` map if a new md section appears)                                 |
| Change site chrome (nav, footer, page shell)                    | `src/routes/+layout.svelte`                                                                                         |
| Change deployment target                                        | `vite.config.js` (adapter)                                                                                          |

Caveats worth knowing before refactoring:

- Markdown text is converted to trusted HTML at build time and rendered with `{@html}` — never render user input this way.
- Inline `$…$` math is converted to `<sup>` markup by the parser; any new math syntax in the markdown needs a parser rule.
- The parser tolerates the specific quirks of these two files (grouped verdict labels like `**ก, ข, ง ผิด:**`, sub-bullets in explanations, un-keyed "notes" explanations used by the subnetting section) — check `scripts/build-data.mjs` before changing the markdown format.
