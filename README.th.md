# กระดาษคำตอบ — ทบทวนสอบ AWS · RAG · Subnetting

[English](./README.md) | **ภาษาไทย**

เว็บไซต์ static สำหรับทบทวนก่อนสอบระดับปริญญาตรี สร้างด้วย **SvelteKit 2 (Svelte 5) + Tailwind CSS 4** และ deploy ผ่าน `adapter-vercel` ทุกหน้าถูก prerender เป็น static HTML

ฟีเจอร์หลัก 2 ส่วน:

1. **หน้าสรุปเนื้อหา** — 8 หัวข้อ แปลงจาก `AWS-Quiz/summarize.md` (แลป AWS Cloud Quest 5 แลป, RAG/LangChain, IP Subnetting และหน้าตารางเปรียบเทียบ) พร้อมไดอะแกรม SVG วาดเอง 4 ภาพ
2. **แบบทดสอบ** — ข้อสอบ 100 ข้อทำต่อเนื่องทั้งชุด ตอบเสร็จแต่ละข้อเห็นเฉลยทันที **พร้อมเหตุผลของทุกตัวเลือกว่าทำไมถูกและทำไมผิด** รองรับการสลับลำดับข้อ+ตัวเลือก, ปักธงข้อสงสัย, กริดภาพรวม, คีย์ลัด, ทำต่อหลัง refresh และโหมด "ทบทวนเฉพาะข้อที่เคยผิด" — ทั้งหมดเก็บใน `localStorage` ไม่มี backend

## คำสั่งที่ใช้

```sh
npm install        # ติดตั้ง dependencies
npm run dev        # รัน dev server
npm run build      # build production (prerender ทุกหน้า)
npm run preview    # ดูผลลัพธ์จาก build
npm run lint       # prettier + eslint
npm run build:data # แปลง AWS-Quiz/*.md -> src/lib/data/*.json ใหม่
```

## โครงสร้างโปรเจค

```text
Quiz-AWS/
├─ AWS-Quiz/                        # เนื้อหาต้นฉบับ (อ่านอย่างเดียว, อยู่ใน .gitignore)
│  ├─ quiz.md                       #   ข้อสอบ 100 ข้อ — ต้นทางเดียวของแบบทดสอบ
│  └─ summarize.md                  #   สรุปทั้ง 8 หัวข้อ — ต้นทางเดียวของหน้าสรุป
│
├─ scripts/
│  └─ build-data.mjs                # parser แปลง Markdown → JSON พร้อม assertions
│                                   #   รัน: npm run build:data (หลังแก้ไฟล์ .md ด้านบน)
│
├─ src/
│  ├─ app.html                      # โครง HTML หลัก: lang="th", <title>, meta, theme-color
│  │
│  ├─ lib/
│  │  ├─ index.js                   # ไฟล์เปล่าค้างจาก template (ลบได้)
│  │  ├─ assets/
│  │  │  └─ favicon.svg             # ไอคอนเว็บ
│  │  │
│  │  ├─ data/                      # = ชั้นข้อมูล (generated + metadata ที่ดูแลเอง)
│  │  │  ├─ quiz.json               #   GENERATED — 100 ข้อ, ตัวเลือก, เฉลย, คำอธิบายรายตัวเลือก
│  │  │  │                          #   + notes ห้ามแก้ด้วยมือ
│  │  │  ├─ summaries/*.json        #   GENERATED — เนื้อหา 8 หัวข้อแบ่งเป็น blocks
│  │  │  │                          #   (h2/h3/p/list ซ้อนชั้น/table/callout/code/checklist/diagram)
│  │  │  │                          #   ห้ามแก้ด้วยมือ
│  │  │  └─ topics.js               #   แก้ที่นี่เพื่อเพิ่ม/สลับลำดับหัวข้อ: import summary ทั้งหมด,
│  │  │                             #   ใส่ metadata ภาษาไทย (kicker, desc), จัดกลุ่มหัวข้อ,
│  │  │                             #   ข้อมูลหมวดข้อสอบ และลิงก์ หมวดข้อสอบ → หน้าสรุป
│  │  │
│  │  ├─ components/                # = UI ที่ใช้ร่วมกัน
│  │  │  ├─ ChoiceBubble.svelte     #   บับเบิลตัวเลือก ก/ข/ค/ง (default/selected/correct/wrong/dim)
│  │  │  ├─ ExplanationPanel.svelte #   แผงหลังตอบ: แบนเนอร์ถูก/ผิด + คำอธิบายรายตัวเลือก
│  │  │  │                          #   + "คำอธิบายเพิ่มเติม" — ใช้ซ้ำในหน้า quiz, สรุปผล และหน้าแรก
│  │  │  ├─ BlockRenderer.svelte    #   render ทุกชนิดของ block ในหน้าสรุป เป็นเจ้าของ typography,
│  │  │  │                          #   สไตล์ตาราง/callout/checklist และ anchor ของหัวข้อ (ใช้ทำสารบัญ)
│  │  │  ├─ AlertModal.svelte       #   modal popup แบบ accessible (pop-in, ปิดด้วย Escape/คลิกนอกการ์ด,
│  │  │  │                          #   ล็อก scroll) — ใช้เป็นแจ้งเตือนต้อนรับครั้งแรกในหน้าแรก
│  │  │  ├─ stickers/               #   สติกเกอร์ SVG เคลื่อนไหว (CSS keyframes, ปลอดภัยกับ reduced-motion)
│  │  │  │                          #   — ถ้าอยากใช้ GIF จริง วางไฟล์ใน static/ แล้วเปลี่ยนที่จุดเรียกใช้
│  │  │  │  ├─ StickerPencil.svelte    #  ดินสอระบายบับเบิลคำตอบ (มาสคอตหน้าแรก/ต้อนรับ)
│  │  │  │  └─ StickerConfetti.svelte  #  confetti ครั้งเดียวเมื่อทำได้ ≥ 80%
│  │  │  └─ diagrams/               #   ไดอะแกรม SVG นิ่ง (เส้นสไตล์เดียวกันทั้งเว็บ)
│  │  │     ├─ DiagramRAG.svelte            # pipeline RAG: Ingestion → Storage → Retrieval → Generation
│  │  │     ├─ DiagramALB.svelte            # สถาปัตยกรรม ALB Multi-AZ (แทน ASCII เดิม)
│  │  │     ├─ DiagramSubnetBlocks.svelte   # แผนภาพบล็อก /26 พร้อม Network ID / usable / broadcast
│  │  │     └─ DiagramDynamoDBKey.svelte    # primary key แบบ simple เทียบ composite
│  │  │
│  │  └─ quiz/
│  │     └─ store.svelte.js         # = สมองของแบบทดสอบ — class แบบ Svelte 5 runes เก็บ
│  │                                   state machine ทั้งหมด (idle → running → finished),
│  │                                   ข้อมูล run (ลำดับข้อ, ลำดับตัวเลือกรายข้อ, คำตอบ, ธง),
│  │                                   สถิติ, ค่า preference และการอ่านเขียน localStorage ทั้งหมด
│  │                                   (key ขึ้นต้นด้วย "awsquiz:v1:")
│  │
│  └─ routes/                       # = หน้าเว็บ (prerender ทุกหน้าผ่าน +layout.js)
│     ├─ layout.css                 #   DESIGN TOKENS — @theme ของ Tailwind v4 (สี รวมถึง correct/wrong,
│     │                             #   ฟอนต์), import fontsource (IBM Plex Sans Thai / Mono),
│     │                             #   สไตล์พื้นฐาน, motion utilities (rise-in/pop-in/float/btn-lift)
│     │                             #   และกฎ reduced-motion — เปลี่ยนลุคและความรู้สึกตอนกดที่นี่
│     ├─ +layout.js                 #   export const prerender = true (มีผลทุกหน้า)
│     ├─ +layout.svelte             #   nav แบบ sticky (จุดบับเบิลบอกหน้าปัจจุบัน), footer, skip link
│     ├─ +page.svelte               #   หน้าแรก — hero, ข้อตัวอย่างที่ตอบได้จริง 1 ข้อ (ข้อ 82),
│     │                             #   แถบขอบเขตการสอบ, ลำดับการทบทวนแนะนำ
│     ├─ summary/
│     │  ├─ +page.svelte            #   หน้ารวมสรุป — หัวข้อจัดกลุ่มตามสาขา เป็นลิสต์เส้นบาง
│     │  └─ [topic]/                #   dynamic route → 8 หน้า static ผ่าน entries() ใน +page.js
│     │     ├─ +page.js             #     entries() สำหรับ prerender + load() หา topic
│     │     └─ +page.svelte         #     หน้าหัวข้อ: kicker/ชื่อ, สารบัญในหน้า, BlockRenderer,
│     │                             #     ลิงก์หัวข้อก่อนหน้า/ถัดไป
│     └─ quiz/
│        └─ +page.svelte            #   หน้าแบบทดสอบ — ทั้ง 3 เฟสอยู่ในหน้าเดียว: หน้าเริ่ม
│                                   #   (toggle สลับลำดับ, ทำต่อ, ทบทวนข้อผิด, ผลล่าสุด),
│                                   #   หน้าทำข้อ (แถบความคืบหน้า, ปักธง, กริดนำทาง, ตัวเลือก,
│                                   #   คีย์ลัด 1-4/Enter/F), หน้าสรุปผล (คะแนนแยกหมวด,
│                                   #   ทบทวนข้อผิด/ข้อที่ปักธง พร้อมคำอธิบายเต็ม)
│
├─ static/
│  └─ robots.txt                    # ไฟล์ที่ copy ไปที่ root ของเว็บตามเดิม
│
├─ vite.config.js                   # โปรเจคนี้ไม่มี svelte.config.js: SvelteKit, plugin Tailwind v4,
│                                   # การบังคับ runes mode และ adapter-vercel กำหนดที่นี่ทั้งหมด
├─ eslint.config.js                 # ESLint (รวมกฎ Svelte; ปิด 2 กฎพร้อมเหตุผลในไฟล์)
├─ prettier.config.js               # tab, single quote, ไม่มี trailing comma, กว้าง 100
├─ .prettierignore                  # ยกเว้น /AWS-Quiz/ กัน formatter พลิกไฟล์ .md ต้นฉบับ
├─ .gitignore                       # หมายเหตุ: AWS-Quiz/ และ .agents/ ถูก gitignore (ต้นทาง local)
├─ .npmrc                           # engine-strict=true
├─ jsconfig.json                    # ค่า config ของ JS language server
├─ skills-lock.json                 # lock ของ .agents skill (แนวทางดีไซน์ที่ใช้ทำ UI)
└─ README.md / README.th.md         # ฉบับอังกฤษ / ไฟล์นี้ (ฉบับไทย)
```

## การไหลของข้อมูล

```text
AWS-Quiz/*.md  ──(npm run build:data)──▶  src/lib/data/*.json  ──(import แบบ static)──▶  HTML ที่ prerender แล้ว
  แก้เนื้อหาที่นี่                                ห้ามแก้                            npm run build
```

1. เนื้อหาอยู่ที่ `AWS-Quiz/*.md` (ภาษาไทย) เท่านั้น — parser (`scripts/build-data.mjs`) แปลงเป็น JSON พร้อมตรวจ assertions: ต้องมี 100 ข้อพอดี, หมวด 40/30/30, ตัวเลือก 4 อันไม่ซ้ำ, เฉลยถูกต้อง และมีคำอธิบายอย่างน้อยหนึ่งอันต่อข้อ
2. แอป import JSON ที่ generate ไว้ใน `src/lib/data/` — ไฟล์เหล่านี้ถูก commit เพื่อให้ build ไม่ต้องพึ่ง markdown
3. `npm run build` จะ prerender ทั้ง 11 หน้า (หน้าแรก, quiz, หน้ารวมสรุป, 8 หัวข้อ) เป็น static HTML

## จะแก้อะไรตรงไหน (คู่มือ refactor)

| ต้องการ…                                                  | ไปที่                                                                                                    |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| แก้คำผิดในข้อสอบ/สรุป เพิ่มข้อสอบหรือหัวข้อ               | `AWS-Quiz/*.md` แล้วรัน `npm run build:data`                                                             |
| เปลี่ยนสี ฟอนต์ ระยะห่าง อนิเมชั่น                        | `src/routes/layout.css` (token ใน `@theme`)                                                              |
| เปลี่ยนพฤติกรรมแบบทดสอบ (คะแนน, การบันทึก, shuffle, โหมด) | `src/lib/quiz/store.svelte.js`                                                                           |
| เปลี่ยน UI ของแบบทดสอบ (เลย์เอาต์หน้าทำ/หน้าผล)           | `src/routes/quiz/+page.svelte`                                                                           |
| ปรับหน้าตาเนื้อหาสรุป (ลิสต์ ตาราง callout)               | `src/lib/components/BlockRenderer.svelte`                                                                |
| วาดไดอะแกรมใหม่/เพิ่ม                                     | `src/lib/components/diagrams/` (ลงทะเบียน id ใหม่ใน `BlockRenderer.svelte` แล้วอ้างเป็น block `diagram`) |
| เพิ่ม/สลับลำดับหัวข้อสรุป เปลี่ยนชื่อหรือคำอธิบาย         | `src/lib/data/topics.js` (และ map `SLUGS` ใน parser ถ้าเพิ่ม section ใหม่ใน md)                          |
| เปลี่ยนโครงเว็บ (nav, footer, โครงหน้า)                   | `src/routes/+layout.svelte`                                                                              |
| เปลี่ยนปลายทาง deploy                                     | `vite.config.js` (adapter)                                                                               |

ข้อควรรู้ก่อน refactor:

- ข้อความ markdown ถูกแปลงเป็น HTML ที่เชื่อถือได้ตอน build แล้ว render ผ่าน `{@html}` — ห้ามใช้วิธีนี้กับ input จากผู้ใช้เด็ดขาด
- math แบบ `$…$` ถูกแปลงเป็น `<sup>` ใน parser — ถ้าใช้ syntax คณิตศาสตร์รูปแบบใหม่ใน markdown ต้องเพิ่มกฎใน parser
- parser รองรับ "เอกลักษณ์เฉพาะ" ของไฟล์ทั้งสอง (คำอธิบายแบบกลุ่ม `**ก, ข, ง ผิด:**`, sub-bullet ในคำอธิบาย, คำอธิบายแบบ notes ที่ไม่ผูกตัวเลือกในหมวด subnetting) — ตรวจ `scripts/build-data.mjs` ก่อนเปลี่ยนรูปแบบ markdown
