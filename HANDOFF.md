# TDF Journal — developer handoff

A personal course journal for TDF. The **web page is the main reading form**; the **PDF is the same content printed** (no second copy of the text).

This folder is a working starter: React + TypeScript + plain CSS variables + MDX content, built with Vite. No backend, no CMS, no router library.

---

## 长期制作标准（用户确认于 2026-10-20；更新前必读）

本节是当前制作标准的唯一维护入口。每次更新先读本节，再读相关页面的记录与源码。用户的新指示优先；局部修改只作用于指定对象，保留此前已确认的整体要求。后文带日期的修改记录用于追溯素材与版本，其中已被后续修订取代的方案不能作为当前规范。不要要求用户重复确认已经明确的偏好。

### 1. 保留结构，灵活组织素材

- 桌面端保留左侧固定／sticky 的文字说明、右侧素材的基本结构。增加素材不能把说明变成横跨整页的文字条。
- 在右侧按内容关系安排阅读顺序。例如 Arduino 实验：左列代码，下面接真实反馈输出；右列实物视频和模拟录屏。相关证据放在一起，避免视频、录屏、代码交叉穿插。
- 这是一种适合该实验的布局，不是所有页面必须套用的模板。根据素材数量、比例、比较关系安排；手机端合理堆叠，桌面最大宽度也要检查。
- 草图与爆炸图保持已确认的并排关系；相关 3D 模型在桌面并列、直接展示可交互模型，避免再铺一组重复静态图。

### 2. 简短但完整地解释作品

- 每节先说清楚：在做什么、用了什么元件／材料／方法、如何工作，以及有证据支持的学习收获；再用短段落补充必要的排查和迭代。
- 排查应交代“观察到的现象 → 如何判断 → 做了什么调整”，但不能取代实验介绍。没有真实问题的部分无需硬编故障。
- 通常以一至两小段为起点，按内容调整，不强求固定字数。避免流水账、重复图注、冗长背景和把每段写成测试报告。
- 页面正文沿用英文，标题简短且具体，例如 `Input · Knob Control`、`Motion · Sweep and Position`、`Interaction · Distance to Motion`。阶段与主题应帮助理解，不能只剩笼统编号。
- 不编造学习经历、元件型号、尺寸、测试动作或成功结果。区分设计意图、模拟、CAD、真实实物与已验证结果；无法确认的内容不下结论。
- 灵感参考简短说明它启发了什么，附有依据的来源；不要让参考资料挤占用户作品的主要篇幅。

### 3. 每份素材承担明确作用

- 有素材支持时，Arduino 记录应包含实际代码、实物演示、模拟电路演示、电路截图、实时反馈输出。缺少某一种证据时不伪造补齐。
- 同一内容不要通过截图、录屏、视频反复大幅展示。动态变化用精简录屏／GIF；静态接线图可收进可展开项。去重不等于随意删除用户要求保留的证据。
- 代码使用现有 CodeBlock，支持阅读、展开、复制和下载；窄列中标题、按钮和长代码行都要可读。输出应紧邻对应代码，保持真实数值。
- 图注简短，描述图中内容和必要差异。图片说明用小三角 ▲，不加 PHOTO、SCREEN、CAD、DIAGRAM 等可见前缀；素材类型保留为元数据。

### 4. 视频方向和剪辑服从观看内容

- 默认保留原始、自然可读的方向与完整画面。只旋转用户指定或已确认的片段，不能把“第二条横屏”扩展为“全部横屏”。
- 剪掉无关准备、长时间等待、重复动作；保留能解释输入、响应与结果的完整过程。用户指定的起始秒数、方向、排除画面必须逐条核对。
- 原始素材保持不变，导出独立版本并记录源文件、起止时间、方向与必要的合成处理。海报应与新视频一致。
- 不为统一尺寸裁掉手、传感器、舵机或界面；不拉伸画面。检查色彩与曝光，HDR 转 SDR 后与原片对照，不能让画面过曝。
- 当前 More Arduino 的明确例外：第二节 Sweep 为横屏；最后一节距离感应视频为原始竖屏，取 IMG_7151.MOV 的第 5–12 秒，共 7 秒；第一节旋钮视频从原片第 5 秒开始。不得因通用布局规则覆盖这些选择。

### 5. 统一且有含义的视觉语言

- 延续现有暖白底、细线、克制配色与文字层级。局部修改优先复用现有组件和样式，不擅自改整站风格。
- 图注三角、展开指示、外链箭头含义不同。折叠控件只保留一个清晰指示：当前 Circuit snapshot 用 ＋／−，关闭原生三角，不再附加 ↗。图标与文字保留间距。
- 代码、下载项和图注也属于设计的一部分：避免多重按钮框、拥挤操作、文件名单字断行和图标重叠。
- 机制图按软件／代码、电子硬件、机械结构区分颜色，并配文字标签；框内细节用 bullet points，避免用 +、/ 堆词。图表优先用可读的 HTML／矢量内容，必要时加入有意义的互动，不能编造数据。
- 建模图注突出设计决定和作用，不堆尺寸或重复免责声明。旧方案可收进次要展示，实物、关键安装细节应有足够阅读空间。
- Concept 先说明做这个作品的愿景和动机（例如对伯克利夕阳的期待），系统关系由图辅助，实践细节放到对应测试章节。架构图用对齐模块和明确连线表达关系，不把流程框拼成装饰性的电脑／花朵外形；颜色区分软件、电子和机械。详细引脚与供电另放电路图。
- Ambient Display：Material Testing 在 Motion Testing 前，素材顺序为木板切割／弯曲测试 → 手绘花瓣、柔软度测试、打印过程三份素材等高并排 → 花瓣模型比较。Motion 保持运动照片和循环 GIF 连续展示。Interface 只展示一张完整横向网页图，不嵌入重复交互；Testing 可嵌入用户提供的交互接线 HTML，并提供独立网页链接。Control 的解释性映射图可保留互动。

### 6. 按课程内容组织网站

- 顶层只有 Physical Computing 和 Computational Design。Physical Computing 内统一展示 Fabrication 与 Hardware Programming 的内容，用小色块区分；跨两类的项目只展示一次。
- 卡片统一为 `Week N: Topic`；按课程周数正序，禁止恢复 Newest first。同周硬件内容在 fabrication 前。
- Week 1：Arduino 灯光与 Laser-Cut Ring；Week 2：Arduino 感应／舵机与 3D-Printed Ring；Week 3：Expressive Mechanics；Week 4：ESP32。未提供内容的周不凭空补作业。
- 周数按课程内容，不按上传日期推算；真实制作日期另存，未知用 TBD。保留已确认的 Design Journal 名称，不恢复 About、编号分类标题、卡片 PC／DF／CD 前缀或可见 Updated 标签。

### 交付前检查（按本次改动执行）

- [ ] 修改对象与范围正确，既有结构、文案信息和用户此前要求没有被最新一句话覆盖。
- [ ] 每节能让读者理解“做什么、怎么做、学到什么”；排查是补充，文字简短且有依据。
- [ ] 素材和文字对应，没有重复铺陈、虚构结果、错误图注或遗漏已有证据。
- [ ] 实际查看桌面（含宽屏）和手机布局；左侧说明、素材顺序、并排关系、代码、下载项、图标与展开状态正常。
- [ ] 涉及视频时实际播放：核对方向、起止时间、时长、曝光、完整画面、音频及海报。不要只检查文件名或尺寸。
- [ ] 涉及实现改动时完成构建及相关检查；已获授权发布后核对线上版本与链接，保存能说明结果的截图。纯文档更新无需重跑媒体或布局测试。
- [ ] 新确认的长期偏好更新本节；具体素材处理写入后文版本记录。只报告已经完成和验证的事项。

---

## 0 · Ground rules (read first)

1. **Never invent content.** No made-up dates, test results, learning outcomes or photos. Everything under `content/` marked `sample: true` is placeholder structure only.
2. **Dates:** each entry has its own real making date. Unknown → `TBD`. Visible labels use the explicit course-content week, not the date. Never use the upload / file date. The page update date (`updatedAt`) is a separate field.
3. **Status** (`verified`, `to-test`, `unresolved`) comes only from the owner’s own words. Never infer “verified” from a photo. A CAD check is not physical verification.
4. **Image kinds** must be correct: `photo` (real object), `cad` (CAD preview), `concept` (render), `screen`, `diagram`. Never present a concept render or CAD view as a finished physical prototype.
5. **Drafts and samples never ship.** `status: draft`, `<Entry draft>` and `sample: true` are visible in `npm run dev` only.
6. Do **not** deploy, publish or overwrite any existing site unless the owner asks.
7. The Expressive Mechanics vase is a **3D-printed ceramic-form prototype**, not fired ceramic. Links to family and memory are **design intent**, not research findings. No LED strip in the current design.

---

## Arduino source import (October 8, 2026)

`content/physical-computing/w01/index.mdx` is the Physical Computing Week 1 record, titled **Arduino Basics**. Source: [26FALL-TDF, Week 2 · Arduino Journal](https://www.figma.com/design/TZMQOkNx0EGp1sZYJ48oKf/26FALL-TDF?node-id=64-131). September 3, 2026 is the date printed in that source; the owner’s course-content numbering now assigns this exercise to Week 1. The source’s original Week 2 label is retained only here for provenance. The six entries preserve the Figma narratives and code: Serial Communication, Onboard LED, Hello World, External LED, LDR, and Three-LED Sequence. The serial setup is explicitly labeled as a setup snippet, not a complete sketch. Code files are selectable, expandable where needed, copyable and downloadable through the existing CodeBlock component.

Reuse existing Entry, Gallery, Figure and CodeBlock styles; do not import Figma's rounded cards or shadows. Original classroom photographs were matched to the source and read from `UCB/TDF-Design-Journal/Week-02-Arduino/photos/`, then exported upright at a 2400px long edge, JPEG quality 82, without cropping. Circuit diagrams, Serial Monitor captures and demonstration stills were exported from the Figma source assets. Six playable recordings now replace the simulation and breadboard stills. Source: the owner's `Downloads/week2 视频/` folder. `1.mp4` is byte-identical to `a595fb727f60c0773b85f33405ed8be9_raw.mp4`, so it is included only once. Simulation sources map to external LED (`a595…`, 12.37s), LDR (`7949…`, 9.17s), and three LEDs (`232e…`, 5.33s); physical sources map to external LED (`0d35…`, 4.13s), LDR (`6100…`, 8.83s), and three LEDs (`bb9a…`, 4.83s). The simulations are losslessly remuxed; physical recordings retain 2160×2160 resolution with H.264 CRF 23 and their original audio. All retain full duration and uncropped frames, with fast-start metadata and posters at 0.2s. Use the existing Video block with native controls, no autoplay, full-size links and print posters. The Serial Monitor captures remain still images. The original source files and Figma document are unchanged.

The Serial Monitor crops follow the source's output-panel presentation; the matching full code remains in CodeBlock. Desktop (1440px) and mobile (390px) were checked for overflow and code expansion; the build and 160 gallery layout scenarios pass.

## 1 · Run it

```bash
npm install
npm run dev        # http://localhost:5173 — shows drafts + samples
npm run build      # type-check + production build into dist/ (drafts & samples excluded)
npm run preview    # serve dist/
```

Node 18+ (tested on Node 24). Hosting: any static host. Because routes are real paths (`/physical-computing/w03`), the host must fall back to `index.html` for unknown paths (Netlify `_redirects`, Vercel rewrites, GitHub Pages `404.html` copy). For a sub-path, set `base` in `vite.config.ts`.

---

## 2 · Information architecture

The archive has exactly two top-level categories: Physical Computing and Computational Design. Fabrication is an internal track (`parentId: physical-computing`) alongside hardware programming. Physical Computing lists all those records once in ascending week order. Expressive Mechanics is one combined article with both track badges; `relatedTypes: [digital-fabrication]` preserves both Week 3 routes and the project route.

```
/                          Archive (first type selected)
/physical-computing        Archive → choose type → that type’s weeks, earliest first
/physical-computing/w03    Week page “PC — W03” (one class, one week)
  #<date>-<entry-title>    Entry anchor (contents links)
/physical-computing/print  All weeks of one type in one printable page (multi-week PDF)
/project/expressive-mechanics   Weeks tagged with a project, across types
```

Week page: breadcrumb · prev/next **within the top-level category** · links to other records from the same course week · numbered contents grid (desktop) / collapsed “Contents” (mobile) · header · body · prev/next.

Types are data (`content/types.json`). `topTypes` excludes child tracks. Computational Design is clickable with an honest empty state until content is supplied. The old Digital Fabrication archive and print URLs display the combined Physical Computing views; existing article URLs remain valid.

---

## 3 · Folders

```
content/
  site.json                 journal title, course, term, author, about line
  types.json                order, id, short code, name, tint, blurb, reserved
  projects.json             project ids + names
  <type>/<wNN>/
    index.mdx               one week (frontmatter + entries)
    images/                 photos, CAD screenshots, renders
    files/                  .ino .js .dxf .stl .f3d … (download links + code blocks)
src/
  content.ts                loads all weeks via import.meta.glob; helpers
  types.ts                  data types (WeekMeta, TypeDef …)
  format.ts                 date formatting, slugify
  router.tsx                tiny path router + <Link>
  week-context.ts           lets blocks resolve ./images/… per week
  App.tsx                   routes
  pages/                    ArchivePage, WeekPage, PrintBundlePage, ProjectPage
  components/
    blocks.tsx              Section, Entry, Figure, FigurePair, BeforeAfter,
                            ProblemChangeResult, Specs, Quote, Attachments,
                            Attachment, Video, Status
    CodeBlock.tsx           CodeBlock + fenced ``` mapping (copy, collapse, print)
    Contents.tsx            numbered contents / mobile toggle (auto-built)
    WeekCard.tsx            Archive card
    WeekHeader.tsx          week page header (also used in print bundle)
    tags.tsx                TypeTag, ProjectTag
    mdx-components.ts       what MDX files may use without importing
  styles/
    tokens.css              ALL colours, fonts, sizes — change design here
    base.css                layout + components
    print.css               PDF rules
docs/screenshots/           desktop, mobile, print captures of the samples
```

Layout never contains copy; content never contains layout. Adding a week never needs a new component.

---

## 4 · Content model

### Week frontmatter (`content/<type>/<wNN>/index.mdx`)

```yaml
---
type: physical-computing      # must match the folder
week: 3                       # explicit course-content unit number, shared across types
dateStart: "2026-10-12"       # quote dates; or TBD
dateEnd: "2026-10-18"
title: "Camera trigger and servo response"
summary: "One line of real progress."
cover: ./images/cover.jpg     # optional; card shows “No cover image yet” without it
coverKind: photo
projects: [expressive-mechanics]
status: draft                 # draft | pending | published
updatedAt: "2026-10-20"       # page update date — not the making date
---
```

`pending` = week exists but material is not sorted; the card says “Material pending” and shows no image.

### Body

The body is a sequence of `<Section>` (fixed parts) and `<Entry>` (dated records), in date order:

```mdx
<Section title="This week">
Goals and progress…
</Section>

<Entry date="2026-10-14" title="Arduino class exercise" kind="Class exercise">
…blocks…
</Entry>

<Entry date="TBD" title="Quick test: cable routing" kind="Quick test" project="expressive-mechanics" draft>
…
</Entry>

<Section title="Reflection" lead>…</Section>
<Section title="Next steps">1. …</Section>
```

Leave blank lines inside JSX tags so Markdown inside them is parsed.

---

## 5 · Blocks (use only what an entry needs)

| Block | Use | Example |
|---|---|---|
| Markdown | text, `###` sub-heads, lists, `---` | — |
| `Figure` | one image + caption | `<Figure src="./images/a.jpg" kind="photo" caption="…" />` (`ratio="16 / 10"` optional) |
| `Gallery` / `FigurePair` | intrinsic justified rows | ordered `Figure`s; see Gallery rules below |
| `BeforeAfter` | comparison, labels added | two `Figure`s; set each `kind` honestly |
| `ProblemChangeResult` | iteration record | `problem` `diagnosis?` `change` `result` `status` (default `to-test`) |
| `Specs` | material / settings / I-O | `rows={[["Material","3 mm ply"],["Kerf","0.15 mm"]]}` |
| `CodeBlock` | code from a file | `<CodeBlock src="./files/turntable.ino" lang="arduino" />` |
| fenced code | inline code | ```` ```js … ``` ```` |
| `Attachments` / `Attachment` | downloads | `<Attachment src="./files/part.stl" kind="CAD" />` |
| `Video` | external demo | `<Video href="https://…" title="…" duration="0:42" poster="./images/poster.jpg" />` |
| `Quote` | short quote / reflection | `<Quote>…</Quote>` |
| `Status` | inline mark | `<Status value="verified" />` · `to-test` · `unresolved` |

Code blocks collapse above 15 lines (web), have a Copy button and, for `src`, a Download link. Missing images/files render a visible “not found” placeholder instead of breaking.

---

## 6 · Everyday tasks

**Add a week**
1. Create `content/<type>/wNN/index.mdx` (copy a sample, delete `sample: true`).
2. Fill frontmatter; keep `status: draft` until the owner confirms.
3. Put images in `images/`, files in `files/`. The Archive card, week index, prev/next and cross-type link appear automatically.

**Add an entry to an existing week** — insert one `<Entry>` at its date position. Don’t touch other entries. Update `updatedAt`.

**Replace an image** — overwrite the file with the same name, or change `src`. Check `kind` and caption still match what the photo actually shows.

**Owner sends loose material** (photos, code, a paragraph, a date): put it in the right `<type>/wNN/` by its confirmed course-content week; keep real making dates as separate metadata (use `TBD` when unknown); write captions that describe, not judge; mark status only from their words.

**Add a type** — add an object to `content/types.json` (and a `--tint-*` in `tokens.css` if needed), create `content/<id>/`.

**Add a project** — add to `content/projects.json`; tag weeks with `projects:` and entries with `project=`.

**Publish** — change `status: draft` → `published` only when the owner says so; `npm run build`.

---

## 7 · Design tokens (from `src/styles/tokens.css`)

| Token | Value | Use |
|---|---|---|
| `--paper` | #F6F5F1 | background |
| `--paper-2` | #EDEBE5 | code background |
| `--rule-soft` | #D6D3CB | grid lines, table rows |
| `--ink` | #151515 | text, 1px rules, status |
| `--ink-2` | #4A4946 | dates, captions, labels |
| `--tint-pc` | #ECEBFB | Physical Computing (fill only) |
| `--tint-df` | #DDF2EC | Digital Fabrication (fill only) |
| `--tint-cd` | #DCE5FB | Computational Design (reserved) |
| `--tint-project` | #FDE8EB | project tags |

No red, no blue text, no gradients, no shadows, radius 0. Tints are fills only; all text is ink.

Type (provisional — **to be checked against the owner’s existing Journal**): Archivo (display, 72% width for week codes), Instrument Sans (body 17/1.7, column ≤ 720px), IBM Plex Mono (dates, labels, code). Spacing on a 4px grid; entries 72px apart; page gutter 64px desktop / 16px mobile.

Accessibility: real links/buttons, 2px focus ring, ≥44px touch targets on mobile, status told apart by text + shape + fill.

---

## 8 · PDF

- **One week:** “Export as PDF” = `window.print()` with `print.css`. A4, 18/16 mm margins.
- **All weeks of a type:** `/<type>/print` → cover, week list, each week on a new page.
- Hidden in print: top bar, contents, prev/next, buttons, cross-type link, dev banners.
- Kept: dates, titles, images + captions, tags as text, file and video URLs, export date, page URL.
- No split figures / image pairs / problem-change-result tables; headings stay with the next block.
- Code always printed expanded; files > 80 lines print the first 40 lines + file URL.
- Status prints as `[Verified]`.
- Known limitation: the running head prints on the first page only; page numbers come from the browser’s “Headers and footers” option. For true running heads/page numbers use Paged.js later.

---

## 9 · Current decisions and remaining configuration

1. **Project work** — keep the current course-category structure and project links; do not add a top-level track without a request.
2. **Week numbering** — shared course-content weeks (PC-W03 and DF-W03 = same week).
3. **Archive order** — earliest course week first (confirmed October 8).
4. **Fonts** — provisional; replace with the owner’s existing Journal fonts once provided.
5. **Site details** — title, name, course, term in `content/site.json`.
6. **Hosting** — GitHub Pages at https://mcflurry-13.github.io/tdf-journal/; pushes to main run `.github/workflows/pages.yml`.

## 10 · Known gaps / next steps

- Sample folders (`sample: true`) must be deleted or replaced before publishing.
- Placeholder sample text is still in the JS bundle (hidden at runtime). Removing the sample folders removes it.
- No search, no filters beyond type and project — by design.
- Optional: image optimisation (vite-imagetools), Paged.js for print, a `npm run new-week` script.


## Gallery — intrinsic justified rows (October 2026)

`<Gallery>` defaults to an order-preserving justified layout. Real image dimensions are read by `scripts/image-metadata.mjs` at Vite startup/build and supplied through a virtual manifest, including EXIF orientation. New/replaced image files invalidate that manifest in development. Width/height attributes reserve space before image loading; ResizeObserver handles the evidence-column width. Natural image dimensions on load are a fallback only for missing metadata.

- A global dynamic-programming partition selects row breaks, targeting 260px and preferring 200–340px desktop heights, with at most three images per row. Below 640px, at most two images fit per row, with a 210px target. The final row participates in the same optimization; there is no separately stretched orphan row.
- Each multi-image row fills the column exactly: `(column width − gutters) / sum(aspect ratios)` gives its height. Every image keeps its aspect ratio. Source order never changes.
- A singleton fills the column until its natural proportional height reaches 480px, then remains at that height, left-aligned. Extreme aspect ratios, forced wide items and very narrow columns can make the preferred height band impossible; uncropped content, exact multi-image row edges and source order take priority.
- Gutters are 12px desktop / 8px mobile, in both directions. Captions start at the same height within each row; a row grows to fit its longest caption, followed by one gutter. No clamping, hidden text, grey fill, rounded corners, letterboxing or `object-fit: contain`.
- Captions display a small ▲ marker, without PHOTO / CAD / SCREEN prefixes; `kind` remains asset metadata. Preserve author-supplied `kind` and `caption` verbatim when importing assets.
- `<Gallery layout="grid" cols={2}>` (or 3) explicitly opts into equal 4:3 crop cells using `object-fit: cover`; `<Figure focus="50% 30%">` supplies the crop position. Mobile uses at most two columns. Default galleries never crop.
- `<Figure wide>` forces its own full row and obeys the singleton height cap.
- `<BeforeAfter>` stays two-up with equal image heights, including on mobile. It preserves aspect ratios rather than cropping. Print can break between gallery rows, never between an image and its caption.

### Preparing future uploads

Install `Pillow` and `pillow-heif`, then run:

```sh
python scripts/prepare_media.py source.HEIC content/physical-computing/w03/images/descriptive-name.jpg --kind photo
```

The script applies EXIF orientation, exports a maximum 2400px long edge at JPEG quality 82, strips metadata and preserves the source. Real photos are never trimmed. For `cad`, `screen` or `diagram`, it removes enclosing white/near-white margins (threshold 240), then adds an even padding of 4% of the trimmed long edge. Use `photo` for documentary photographs even when their background is white. Animated GIFs must not go through this still-image converter. Never bake labels into photographs automatically; use the caption.

### STL previews and motion

`<CadViewer src="./files/part.stl" poster="./images/part.jpg" caption="…" />` loads the actual STL directly; the poster is reserved for print (see Direct CAD previews below). Drag rotates, scroll zooms, arrow keys rotate, and Reset view restores the initial camera. The STL download remains available if WebGL fails. `flip` shows a part from below; `color` sets the mesh colour. Print always uses the poster and its caption; the original part file is unchanged.

### Verification

Run `node scripts/gallery-layout.test.mjs` and `npm run build`. At 1440px and 390px, inspect both Week 3 routes: shared caption tops, equal image heights, filled multi-image row edges, singleton height caps, no overflow, no cropped photos and no missing metadata. Confirm that the two URLs display the same source article. Capture the screenshots outside the published content folder.

## Inline recordings and readable code

Use `<Video src="./files/clip.mp4" poster="./images/poster.jpg" title="…" duration="0:30" />` for a local recording. It shows native controls, never autoplays, preserves the full frame, and prints its poster. Keep excerpts focused; retain the original recording outside the site.

Use `<CodeBlock src="./files/sketch.ino" lang="Arduino" />` to preview, expand, copy and download the actual source. Source comments and interface labels are English. Serial illustrations use “Serial response example” and identify firmware-derived content; never describe them as recorded hardware results. Fabrication iterations in Week 3 end on September 24; later capture dates are not fabrication dates.

### Direct CAD previews
`<CadViewer>` loads the actual STL immediately, with rotation, zoom, keyboard arrows and reset. Static posters are print-only. Wrap related models in `<CadGroup>` for two equal columns on desktop, one column below 640px; keep each model and caption together in print.

October 2 media revision: pinch recording uses original 87–102.6s and 110.15–120.2s (25.65s total); generation waiting is shortened to about one second. FrontendStudy arranges the real hand-tracking panel from 95s with drawing/result panels from 120s. Caption says “interface states”; this is not a single simultaneous screenshot. Full original frames remain unmodified.

### October 2 follow-up: cloud pattern and seated demo
The supplied blue/cream cloud pattern is embedded unchanged in `cloud-pattern-vessel.svg` and clipped to the actual frontend vase profile. This is a pattern presentation, not an old captured screenshot.
The edited demo now uses original 87–99s for drawing, 101.4–102.05s for the Generate click, and an 8-second panel composition: seated camera/drawing from 99–107s with rotating result from112–120s. No standing, talking or projector-carrying appears. This intentionally demonstrates the shortened interaction, not real generation latency; title says edited demo.

### October 2 final prototype video
The final Prototype in use section now plays the user-supplied `01_Prototype Demo Video.mp4` in full (60.1 seconds), replacing the GIF. The web copy retains its 3840×2160 resolution and 30 fps with H.264 CRF 23 and fast-start metadata; no scenes are trimmed or reordered. The source has no audio track. Poster is taken at 3 seconds. The exploded illustration remains the corrected transparent version with matching left and right bearing supports, beside the original hand sketch.

### October 8 editorial revision
Removed “edited demo” from the pinch-recording display title at the user’s request; the media edit provenance above remains unchanged. Removed the entire “One frontend for the prototype” entry, including its text and FrontendStudy image. Prototype in use now follows section 06 directly; its final video is unchanged.

### October 8 journal navigation and headings
The archive masthead and return links use Design Journal. Removed numbered Type/journal headings, category abbreviations from category tiles and journal cards, the About sidebar, and Dated records by class. Week headers omit the visible Updated label and summary; dates remain in source metadata. Week 3 uses short process/topic titles: Inspiration; Iteration · Servo Mount; Iteration · Bearing Support; Iteration · Gear Coupling; Control · Arduino; Interaction · Pinch to Draw; Prototype. Contents derive from those titles. Section supports an optional explicit id to retain the existing prototype-in-use link.

### October 8 course weeks and fixed sketch pair
Visible week labels use the explicit `week` field in frontmatter, shared with Entry through WeekContext. Do not calculate course units from dates. The owner’s current mapping supersedes the earlier calendar-based mapping: Week 1 = Arduino lights + laser-cut ring; Week 2 = Arduino sensors/servo + 3D-printed ring; Week 3 = Expressive Mechanics; Week 4 = upcoming ESP32. Real making dates stay unchanged in source metadata; September 24 remains the Expressive Mechanics final presentation. Publish only supplied, documented work, not empty or invented exercises. The original hand sketch and exploded illustration use their own `<Gallery pair>` to remain side by side at all widths, without cropping; the generated concept sketch remains above them. Section accepts weekLabel for the final presentation marker.

### October 8 unified card titles and chronological ordering
All journal cards use `Week N: Topic`, generated centrally by WeekCard from `week` and `title`. Store only the topic in frontmatter: `Arduino Basics` and `Expressive Mechanics` render as `Week 1: Arduino Basics` and `Week 3: Expressive Mechanics`. Cards, page headers, entries, contents and print labels all use the same explicit course week. New records inherit this convention. All category and project lists and print bundles use ascending course weeks, then making date and route for stable ties. Sidebar links and mobile chips have one anchor per course week, pointing to the first card in that week. Previous/next links keep their earlier/later meaning. Do not reverse print ordering or reintroduce Newest first.


Legacy URLs are listed in `content/legacy-routes.json` and emitted as static pages. A real current content route always takes precedence over a legacy alias (important when a future Arduino sensors article uses physical-computing/w02). The old physical-computing/w02 link currently opens Arduino Basics; both old w05 links open Expressive Mechanics at Week 3.


### Week 2 · 3D-Printed Ring (October 8, 2026)
`content/digital-fabrication/w02/index.mdx` documents the owner's supplied `Downloads/ring/` assets and October 8 answers. Three short sections: Word Play, Lettering, Clip Clearance. The intention is independent rotation of four alphabet rings to form words. The owner measured their finger, kept the basic ring form, changed unclear non-through lettering to cutouts, and widened a clip that fit numerically but broke when the tightly assembled rings were turned. Printing itself was reported as problem-free. Do not claim measured clearances, a particular printer/material, or verified final rotation/legibility: those were not supplied. Actual making dates remain TBD; the explicitly requested course unit is Week 2.

The concept image is labeled as a render. Printed photos map to IMG_5936 (build plate), IMG_5948 (assembly and cover), and IMG_5954 (inside view). Photos are EXIF-oriented, uncropped JPEG quality 82, max 2400px long edge. Original STL files are supplied unchanged in interactive viewers; transparent print posters are rendered from their actual geometry. The two lettering versions are paired on desktop and stacked on mobile. The supplied clip model is described without claiming it is the widened final revision, since that file-version relationship has not been confirmed. Preserve English prose, triangle captions and existing editorial gallery/print rules. Classmate references informed the short process structure only; all personal process claims come from the owner.


### October 8 · Combined archive and laser-cut ring
Top-level navigation contains only Physical Computing and Computational Design. Preserve the existing two-column editorial article structure, warm paper, thin rules, rectangular cards and mobile stacking. Each card displays mint `Fabrication` and/or lavender `Hardware Programming` tags instead of a project tag. Expressive Mechanics carries both, but is never duplicated. Week headers use the parent category plus track tags; previous/next navigation and print bundles include both fabrication and hardware records. Category membership is centralized in `categoryByType`/`weeksOfType`, and track labels in `tracksOfWeek`. Keep internal digital-fabrication folders and URLs to avoid collisions with Arduino records in the same week.

`content/digital-fabrication/w01/index.mdx` is **Week 1: Laser-Cut Ring**. Primary evidence: owner-supplied `Downloads/laser cutting ring/` and the owner's current description. Prior thread `01a08c49-7d1b-7cc0-a191-2dda7aaa8146` supports the earlier butterfly / interlocking-heart design intent, not fabricated physical success. Two short sections explain that repeated flexible cutting patterns could not bend the wooden band through a full circle, so the owner switched to slotted assembly. Do not claim a material species, thickness, laser setting, exact fit, or final durability. Actual making dates are unknown (TBD), not the export dates.

IMG_5710 is the separated wooden pieces; IMG_5711 is the assembled ring and card cover. Photos retain the whole frame, EXIF orientation and JPEG quality 82 at max 2400px. IMG_5709 (4s cutting) and IMG_5722 (2s trials) retain their complete uncropped 2160×3840 H.264 picture and original audio through lossless MP4 remuxing. `VideoGroup` presents the short portrait clips side by side at up to 270px each, stacked on mobile. Print uses their posters. The owner's ai_ring.svg is the downloadable file unchanged; a separate display SVG only enlarges strokes and adds 4% padding. No rejected historical AI diagrams are reused.


### October 8 · Compact laser-ring references
The owner supplied three Pinterest reference images: `bending-ring-reference.png` belongs to the bending concept; `slotted-disc-reference.png` and `interlocking-sphere-reference.png` belong to the interlocking concept. Original pin URLs and creators were not provided, so do not invent attribution. Keep inspiration copy brief and the existing two-entry structure.

Recovered `UCB/outputs/rings-v2/butterfly-ring-v2.svg` is copied unchanged to `files/butterfly-ring-draft.svg`; it is an early, unvalidated draft and opens in Illustrator, not a recovered native AI file. Its display-only preview uses the historical review SVG with darker/thicker strokes and reduced empty margins; geometry is unchanged. The current user explicitly requested this draft.

The Trotec kerf-pattern photograph comes from the official guide https://www.troteclaser.com/en/helpcenter/materials/application-techniques/bending-technique (public static_processed asset for backend image `cutting-technique/kerf-cut.jpg`, retrieved October 8). Credit is visible beside the image, and the guide is linked in the text. It is a technical reference, not an owner-made test result.


### October 9 · Week 2 More Arduino
Published the owner's supplied More Arduino experiments at `/physical-computing/w02`, before Week 2 3D-Printed Ring. Within a course week, hardware now precedes fabrication explicitly; recording dates never determine course units. Removed the obsolete PC/w02-to-w01 alias because w02 now has real content.

Sources: `Downloads/more arduino/` and thread `01a0a6e0-abba-7283-9126-4b4cbcad2fc7`. Three short sections cover Knob, Sweep/position troubleshooting, and ultrasonic-to-servo mapping. Code was recovered from that thread and comments translated into English; `distance_servo.ino` incorporates the final 10–30 cm patch, also visible in the supplied serial recording. Do not claim a new creative object has been made, or that the cause of continuous rotation was conclusively diagnosed. The user confirmed isolated 60/90/120-degree positioning; final combined reliability is not yet explicitly confirmed. The original 0–180-degree Sweep code is labeled simulation.

Media mapping: 20261008142431 = Knob simulation; 20261009160153 = Sweep simulation; 20261009153234 = ultrasonic simulation; IMG_7145 = Knob hardware; IMG_7146 = automatic servo motion; IMG_7151 = hand-distance test. The first knob hardware clip IMG_7144 is redundant and omitted. Serial recordings are retained in the source folder, not fabricated or re-rendered. Simulation MP4s are losslessly remuxed; hardware clips preserve complete frames, duration and audio, converted from 4K HLG HEVC to 4K SDR H.264 (CRF22, BT709, Mobius tone mapping) for browser compatibility. Posters are genuine frames, no content edits. Actual making dates stay TBD because filenames do not establish the original assignment dates. Creative extension advice remains in chat until physically completed.

Portrait recordings can use `VideoGroup layout="mixed"` to sit beside a circuit image or code block; this collapses on mobile without changing existing video pairs. Verified production build, existing gallery tests, desktop/mobile layout, code expansion and physical video playback.

### October 9 · More Arduino media revision
The owner reported bright/washed-out footage and requested all five evidence types with videos on the right. Re-encoded all four iPhone originals directly from source using Hable HDR-to-SDR highlight compression instead of the previous Mobius mapping, keeping full 4K frames, duration and audio; regenerated the posters. Added previously omitted IMG_7144 as the first knob-control test. Original source files remain untouched.

All three simulation clips now play inline. Added real Serial Monitor recordings from 20261009132324.mp4 (knob) and 20261009153114-convert.mp4 (distance), spatially cropped to the actual monitor panel to preserve readable, changing output without the old Chinese editor comments. No readings were synthesized; the full duration is preserved. Still frames from these clips appear alongside the English code. No Sweep serial output exists in the supplied folder or source code, so none is invented.

Only the w02 entries opt into `Entry layout="experiment"` and `VideoGroup layout="experiment"`: short prose above, circuit/code/output stills on the left and demo/simulation/live-output videos on the right; stacks at mobile widths. Verified production build, existing 160 gallery tests, no missing assets, desktop column positions, mobile width, and actual simulation/serial playback.

### October 9 · Restore journal structure and remove repetition
The owner clarified that the journal's sticky left prose column must remain intact. Removed the full-width `Entry layout="experiment"` override entirely. The small circuit/code vs demonstration split now lives only inside the normal right evidence column; all three entries use the original row structure.

Each entry now has one real-hardware video: Knob uses IMG_7145 from 5s to the end (~6s), Sweep keeps the first 8s, and distance keeps the first 12s to omit the later repeated approach/withdrawal. Trimmed clips were encoded from the original HDR sources with the corrected Hable conversion. Removed the duplicate first-test presentation from the page. All five screen recordings are now looping GIFs (simulations 1280px/12fps, actual serial output 1600px/8fps). Serial screenshots are no longer shown as duplicates; each serial GIF spans the right evidence area for legibility. The three circuit stills and downloadable/expandable code remain. Source files and earlier media exports are preserved.

Verified 1 hardware video per entry and GIF counts 2/1/2, genuine multiple frames in each GIF, sticky left text at desktop width, no missing assets, successful production build and 160 gallery checks.

### October 9 · Consistent media columns and troubleshooting prose
The latest owner request keeps the sticky prose column and reorganizes each evidence area: code with actual serial output directly below on the left, physical video and simulation GIF on the right. This supersedes the previous full-width serial GIF placement. Circuit stills remain in expandable “Circuit snapshot” details to avoid repeating the simulation image prominently. Code headers/actions are compact, long lines wrap, and media captions share triangle markers.

Rotated the already trimmed, corrected SDR Sweep and distance clips 90° counterclockwise into full-frame 3840×2160 landscape, preserving audio and duration. Knob still starts at source second 5. Recropped actual serial recordings to the changing readout, with no synthesized data. Source footage is unchanged.

All three short paragraphs now explain the observed problem, diagnostic check and adjustment. Distance explains why 5–200 cm barely changed the target angle and why the owner narrowed it to 10–30 cm. Do not claim verified final combined reliability. Verified production build, 160 gallery checks, code/details expansion, actual landscape playback, desktop layout and no horizontal overflow at 390px mobile width.

### October 9 · Disclosure control and final clip start
Removed the external-link arrow from all Circuit snapshot toggles. A single plus/minus indicator now replaces the native disclosure marker, with fixed spacing, so it cannot collide with the figure's triangle caption. The owner also requested the final physical video start at source second 5. Re-exported IMG_7151.MOV seconds 5–12 as a seven-second landscape clip, keeping the previous repetition-removing endpoint and corrected Hable colour conversion; regenerated its poster from the new first frame. Earlier source and exports remain untouched.

### October 9 · Restore experimental context before troubleshooting
The owner clarified that troubleshooting must supplement, not replace, the explanation of each experiment. Each entry now first identifies the task, components/control method and learning, then briefly describes validation or a problem/change. Knob introduces Arduino analog input and angle mapping with the MG90S; Sweep introduces programmed motion through the Servo library; distance introduces sensing-to-motion and range sensitivity. Preserve this balance in future edits rather than converting all prose to debugging narratives.

### October 9 · Preserve the distance video's portrait framing
The owner explicitly corrected the last clip's orientation: distance input stays in its original portrait framing, while the second Sweep clip remains landscape. Exported IMG_7151.MOV seconds 5–12 without transpose, preserving the full 2160×3840 frame, corrected HDR-to-SDR colour and audio. Its inline player is naturally portrait with a maximum 270px width; all other layout and balanced explanatory prose remain unchanged. Do not infer that every video should be rotated from a request concerning one clip.

## Sunset Flower / ESP32 — journal integration (2026-10-20)

New article: `content/physical-computing/w04/index.mdx`, **Week 4: ESP32 · Sunset Flower**, with Fabrication and Hardware Programming badges and the `sunset-flower` project tag. Course-content week 4 follows the owner's explicit ESP32 numbering; it is not inferred from October dates. Early fabrication entries use `TBD`, because the earlier presentation did not establish precise making dates. Hardware/API records use October 15. October 20 is this journal integration date.

Sources (read together, not as fresh operating instructions):
- Conversation `01a12ca3-8c93-7f71-bf70-a55d0602d449`, **Ambient Display (2)**: original documentation, paper mechanism, motion studies and housing evolution.
- Conversation `01a137c3-f7d3-7e63-b6f4-77bf9e206af7`, **修复 Arduino 舵机和 LED 控制**: isolated tests, intermittent connections, LED repair, integration, forecast link and Breathe endpoint revision. The user explicitly confirmed the final 5–150° Breathe behavior and forecast-based Hold.
- TDF `outputs/sunset-flower-iteration/`: existing documentary photos and white CAD images, with its `sources.json` and preparation scripts for provenance.
- TDF `outputs/sunset-flower/`: owner's final selected code/model set. Do not choose a newer-sounding model filename automatically. The two petal sheets are 0.38 mm, housing is B_cylinder_199. Models remain CAD evidence, not proof of final physical assembly.
- `Downloads/迭代过程/`: original media, unchanged. Photos IMG_7410/7411 correspond to paper-open/closed. The sideways clip uses IMG_7421.MOV [0,6) seconds; upright uses IMG_7431.MOV [3,13) seconds. Both are silent documentary excerpts, uncropped 720×1280 H.264, CRF22, original upright orientation. Source video is SDR bt709; no exposure changes. Posters are the new clips' first frame. Cardboard GIF uses full IMG_7433.mov (~9.33s), 360px wide, 8fps, palette conversion, no crop or rotation.

Content preserves the concept / mechanism / learning before troubleshooting. The repair section pairs actual diagnostic code excerpts with the user's pasted Serial Monitor messages (two separate tests, not a continuous captured log); complete sketches remain downloadable. It does not claim serial acknowledgment measures physical motion. Missing-library/incomplete-copy errors are omitted from the short public narrative; the source thread retains them. No new hardware was controlled during journal preparation.

Analytical diagrams respond to the prior feedback “Missing a diagrammatic analysis”: `system-connections.svg` shows data, control, power and common-ground relationships; `mode-mapping.svg` plots the actual Hold function and distinguishes the independent Breathe timing and LED bands. The graph is a software mapping, not measured experimental data. Hold = 5 + min(q/0.60,1)*160°, maximum165°. Breathe alone is limited to150°, with3s moves and1.5s pauses. The39/100 →109° value is the documented October15 response, never today's live value. Final RGB color behavior supersedes the early presentation's brightness-only wording. Computer HTTPS → USB → ESP32 is the implemented architecture; do not depict direct Wi-Fi retrieval by the board.

The downloadable project ZIP contains final firmware/backend/frontend (including built frontend), six selected STLs, model notes and credits. Excludes node_modules, cache files, machine state and credentials. The selected housing and lid are also directly interactive side by side. Original source files remain unchanged.

Validation: build passes; all160 existing gallery cases pass. Browser checks at1920px/1440px confirm sticky prose left/evidence right;390px stacks without horizontal overflow. All images load; both videos play at their stated6s/10s duration in720×1280. Two CAD previews load. No browser runtime errors. Archive remains Week1→2→3→4, hardware before fabrication. Screenshots and inspection scripts are in TDF `work/journal-sunset/`. Remaining evidence gap: supplied videos show paper/cardboard motion, not a new complete final API-driven assembled-prototype demonstration. Do not relabel them as that final demo.


## Ambient Display · Sunset in Bloom — owner corrections (2026-10-20)

This revision supersedes the material descriptions and evidence gap in the preceding Sunset Flower entry. **The white petal layers were 3D printed from the start, not paper.** Earlier filenames and documentation called them paper incorrectly. Only the separate light diffuser is paper; the cardboard housing was an actual test enclosure. Use the owner’s explicit correction, not visual inference, in future edits.

Week 4 route and `sunset-flower` internal project ID remain stable. Public title is **Ambient Display · Sunset in Bloom** and tag is **Ambient Display**. Preserve sticky left narrative/right evidence. Eight short sections cover concept, printed motion, wood bending, housing, diagnosis, mapping, frontend and final motion video.

New evidence and provenance:
- `Downloads/过程记录/levy/IMG_8854.HEIC` → wood-cutouts.jpg; IMG_8856.HEIC → wood-bending.jpg. Full-frame upright JPEGs, max1800px, no exposure edits. Owner reports the laser-cut wood could not bend enough, so this direction was abandoned.
- `outputs/four-petal-print-v4/lower_cutouts_0.38mm.stl` and `outputs/four-petal-print-v5/lower_round_hub_0.38mm.stl` → earlier and round-hub lower models. Interactive top views show the changed hub. Do not invent a measured mechanical improvement. Posters are captured from the actual loaded models.
- `outputs/sunset-flower-iteration/assets/box-side.jpg` → servo-support.jpg: side slot holds the servo with its horn outside. Shown beside the cardboard motion GIF. The three earlier CAD shell studies are a secondary disclosure, not crowded beside the GIF. Body/lid viewers remain side by side.
- `Downloads/过程记录/levy/IMG_8979.MOV` → ambient-display-demo.mp4: full18.9s, upright720×1280,30fps,H.264CRF21,AAC128k,faststart. Original is SDR bt709; no tone mapping, cropping, rotation or exposure adjustment. Poster at1s. Shows the assembled flower moving and lighting beside the frontend; does not establish the forecast acquisition time. This is the journal’s last content block.

Owner’s mapping rationale: after about a week of testing, newly fetched samples mostly did not exceed60. The upper opening threshold is60 to make everyday score differences more visible in a demonstration. This is an observation from that week, not a claimed long-term distribution. There is no fabricated sample series/histogram. Actual Hold mapping and Breathe limit/timing remain unchanged.

`AmbientSystem` uses labeled lavender software, green electronics and peach mechanics, with bullet lists and separate command/power relationships. `AmbientMapping` replaces the static diagram with the actual Hold curve, score slider, reused frontend flower geometry, Breathe illustration and pause. Original frontend screen colors are #F2C14E/#EF8A45/#E05A42; these illustrate firmware yellow/orange/red tiers, not calibrated photographic colors. They differ from earlier pink/green wiring-test photos; never relabel those tests as final mapping.

`demos/ambient-display/` contains the reproducible frontend preview source. `public/demos/ambient-display/` is its static build. It reuses the original full interface with a journal-only historical sample adapter (October15,39/100), zero API/hardware requests. Hold/Breathe/Stop remain usable; current-data wording is corrected to recorded-data wording in this copy. The original operational frontend, firmware and downloadable source ZIP are unchanged. Its sunset banner is an AI-edited illustration, as the image alt text states. The page explains why the UI makes the relationship between score, opening and light more legible.

Implementation / inspection intermediates: TDF `work/ambient-revision/`. Original user media and operational project files remain unchanged.

Validation: production build and160 existing gallery checks pass. Browser checks at1920,1440,1135 and390px confirm sticky desktop prose, stacked mobile layout, no overflow, all images and four models loaded. Checked Hold mapping at0/39/60/100, Breathe pause and reduced-motion endpoint, full frontend Hold/Breathe/Stop and zero API requests. Iframe height follows content across widths. The19s final portrait video plays at720×1280 and is capped to405px display width for complete viewing. The embedded frontend has a print-only screenshot. No new physical hardware test was performed for this editorial update.


## Ambient Display refinement — material evidence and system diagrams (2026-10-20)

Reordered Week 4 to Concept → Material Testing → Motion Testing → Fabrication → Testing → Control → Interface → Prototype. Preserved desktop sticky prose and the existing journal structure. Concept is a concise input/controller/output topology with software, electronics and mechanics colors, bullet details and direct connections. The first diagram that combined flow boxes into a decorative computer/flower silhouette was rejected by the owner and replaced before this revision was committed. Detailed electrical wiring belongs in Testing, not the concept introduction.

The round lower hub explanation comes from the owner's account: it flexed better, had more support contact and made the push/pull steadier. These are qualitative prototype observations, not quantified material properties. Motion photos and the two motion videos precede the paired models. Petal sketch is visible in Material Testing; linkage sketch is a secondary expandable item after the motion comparison.

New media from `/Users/mcflurry/Downloads/过程记录/`:
- `IMG_7387.MOV` → `material-bend.mp4`, source 2–12 seconds, 720×1280, original orientation and audio. Hand-bending and recovery of a thin sample; do not assign an unconfirmed polymer/material type.
- `IMG_7482.jpeg` → `petal-sketch.jpg`; `IMG_7481.jpeg` → `linkage-sketch.jpg`, EXIF upright, long edge ≤1600, JPEG 89, no crop/color adjustment.
- `levy/IMG_8880.HEIC` → `test-wiring.jpg`; `levy/IMG_8898.HEIC` → `test-solder.jpg`, same photo settings. These show wiring and repair, not a fabricated servo-only success photograph.
- `IMG_7582.MOV` → `led-test.mp4`, source 0–9 seconds, LED-only color response; not final sunset color mapping.
- `IMG_7584.MOV` → `combined-test.mp4`, source 0–10 seconds, hand checking the linkage in the assembled shell; caption does not claim this is proof of a completed electronic repair.
- `IMG_7594.MOV` → `ambient-display-close.mp4`, complete 10.41-second closer-angle final demonstration, 900×1600, original orientation/audio. `demo-close.jpg` is from 3 seconds and is also the card cover. Previous final recording remains in the repository.
- All new clips use H.264 CRF23, AAC96k, faststart; source BT.709 SDR is preserved with no exposure, rotation or crop changes. Other new posters are at 1 second into the exports.
- `IMG_7388.MOV` is a printing-process recording, not the bending test; it was inspected but not duplicated alongside existing motion evidence. Original Photos JPEG thumbnails were superseded by the user's full-size exports.

`concept-system.svg` and `tested-circuit.svg` are editable vectors. `Figure fullWidth` is an opt-in that bypasses the single-image 480px height cap for these diagrams and the desktop frontend image; other weeks retain their sizing. Wiring source: `TDF/outputs/sunset-flower/docs/wiring.txt` and final firmware. GPIO14 → MG90S PWM; GPIO27 → 330Ω → A DIN; A DOUT → B DIN. External regulated5V feeds servo and both sticks in parallel; common GND includes the Feather; computer USB powers the Feather. No external5V into Feather3V/BAT. Crossings without dots are not joins. Teacher reference: https://github.com/loopstick/ArduinoTutorial . Robust-rebuild buffer/capacitor guidance is explicitly separated from the tested build, based on https://learn.adafruit.com/adafruit-neopixel-uberguide/best-practices . No breadboard hole positions are invented.

The original repair conversation `01a137c3-f7d3-7e63-b6f4-77bf9e206af7` was read for the actual sequence: intermittent response when wires moved, reconnecting power/ground, LED repairs and standalone test, then servo and linkage. Its historical clipboard photo no longer exists; available workbench photos were used instead. Test code, recorded Serial output and downloads remain accessible in one expandable block.

Interface is now one 1440×900 desktop screenshot of the journal demo in Hold at recorded score39/100, with no iframe or duplicate print image. The underlying standalone demo source is retained. Removed unused AmbientSystem/AmbientFrontend components and CSS. Control's interactive mapping remains unchanged.

Validation: build and 160 existing gallery scenarios passed; browser inspection at1920,1440,1135 and390px confirmed sticky desktop prose, no horizontal overflow, reordered contents, all image loads and a single static interface image. New and retained videos were played with correct portrait dimensions and durations; source/processed contact sheets were inspected for direction and exposure. Work files and verification captures: `TDF/work/ambient-refine/`.


## Ambient Display follow-up — materials, diffusion and HTML wiring (2026-10-20)

Concept now introduces the wish to anticipate Berkeley sunsets, with the existing colored system diagram explaining architecture. Material evidence follows the owner's latest order: wood samples and bend test, petal sketch and printed-sample flexibility clip, earlier/round-hub CAD comparison, then a secondary printing-process disclosure. Motion keeps its physical photos and recordings together. This supersedes the earlier instruction placing models after motion evidence.

The owner clarified the diffuser change: a parchment-like layer was **added to** the existing milky translucent, plastic-like sheet, not substituted for it. The added layer softened the transmitted light and concealed internal wiring. Do not assert an exact polymer or paper product. Two photos follow the enclosure models: `Downloads/过程记录/IMG_7473.jpeg` → `diffuser-study.jpg`, and `IMG_7476.jpeg` → `diffuser-installed.jpg`. Upright full frames, max1600px, JPEG89, no exposure/color adjustment. Similar IMG_7474/7475 photos were inspected but omitted to avoid repetition.

`IMG_7388.MOV` → `petal-printing.mp4`, source seconds2–8 (6s), upright720×1280,H.264CRF23,AAC96k,faststart; original framing/exposure/audio retained, poster at1s. The existing IMG_7387 bend recording is now explicitly identified as the printed-sample flexibility test following the owner's description.

The user's `TDF/outputs/flower-wiring/wiring.html` is preserved unchanged. A journal copy lives at `public/demos/flower-wiring/wiring.html`; its embedded raster was extracted to adjacent `diagram.png` for loading efficiency. `?embed` provides a compact layout inside the journal; the full-page link opens the standalone guide. Seventeen selectable wire paths, endpoint descriptions, zoom and fit remain functional. AmbientWiring belongs to the right evidence column, with a print-only image fallback. No local file URL, API key or hardware endpoint is published. This wiring-guide interaction does not reverse the separate request for a static frontend image in Interface.

Removed the Assembly check / linkage-in-shell clip from Testing as requested; retained its file for provenance. LED-only footage remains. Awaiting the owner's replacement testing video and sunset photograph; neither has been fabricated or replaced with unrelated media. The final close-angle flower demonstration remains the last block.

Validation: production build and160 gallery scenarios passed. Browser checks at1920,1440,1218 and390px confirmed sticky desktop prose, mobile fit, no horizontal overflow, material order, two models in Material and none in Motion, and removal of the rejected assembly video. Verified embedded and standalone wire selection, keyboard activation, zoom/fit/show-all,6s printing playback, screen/print fallback visibility and absence of runtime errors. Work files: `TDF/work/ambient-followup/`.


## Ambient Display — matched media, diffuser comparison and schematic (2026-10-20)

The owner requested the printing recording be visible beside the sketch and bending clip, with equal media height. This supersedes its previous collapsed location after CAD. `VideoGroup layout="process"` uses proportional4:3:3 columns for the3:4 sketch and two9:16 recordings; complete frames remain uncropped, with a900px group cap and a single column on mobile. Only this opted-in group changes.

Motion videos are now looping GIFs: `horizontal.mp4` → `sideways-motion.gif` (6s,60frames), `vertical.mp4` → `upright-motion.gif` (10s,100frames), both360×640,10fps,128-color palettes. No rotation/crop/exposure processing; GIF palette quantization only. Original MP4s remain available in source.

Corrected diffuser evidence: IMG_7476 was the **before** view, not the finished layered result. It now appears first, followed by the owner's newly supplied after exterior and after interior photos. Exact attachment files: `0CCA0567-05DD-4DEA-949E-7C65869344FD_1_105_c.jpeg` → `diffuser-after-outside.jpg`; `1688EDD6-3F6F-4F6E-8E5D-52636817B19F_1_105_c.jpeg` → `diffuser-after-inside.jpg`. Both copied unchanged from the supplied Photos derivative paths,768×1024. The earlier handheld study is omitted from this comparison. The two new pictures are both after installation, not a before/after pair with each other.

The owner rejected “parchment-like” wording as implying animal parchment. Current prose calls it a thin translucent paper layer, similar to tracing or baking paper. Amazon listing https://www.amazon.com/dp/B06Y24GZPG identifies a comparable product as white translucent vellum/tracing paper; verified its product title and description on2026-10-20. The link is a material-type reference only, not proof of the actual brand/product used. No exact paper composition or optical measurement is inferred. The added layer remains additive over the milky sheet.

Removed the public Drawing reference / Class ArduinoTutorial row as requested. Added `electrical-schematic.svg` before the retained interactive breadboard guide. This is a module-level electrical schematic: DC source and ground symbols, IEC resistor, pin-labeled ESP32/three-terminal MG90S/NeoPixel modules, parallel5V loads, common ground and A-DOUT→B-DIN. No switch, AC supply or bare-lamp substitution from the user's stylistic example. Source is the existing final wiring.txt and firmware GPIO14/27. Curved crossing is unconnected; dots indicate joins. Direct3.3V pixel-data drive reflects the documented prototype; the existing separate robust-rebuild note stays distinct from the built circuit.

Validation:160 gallery scenarios pass. Browser checks at1920,1440,1218 and390px verify no overflow; desktop media heights match within0.02px without cropping. Both inline videos play with original portrait framing/durations, Motion contains the two GIFs instead of videos, three diffuser views load, and the removed reference row is absent. GIFs verified as60/100frames with6/10-second loops. No page runtime errors. Work files and screenshots: `TDF/work/ambient-media-polish/`.

Schematic polish: resistor and +5V pin labels sit clear of component edges/wires. Both NeoPixel symbols include yellow/orange/red swatches, with a separate score legend below the circuit: below33,33 to below67,67–100. These follow the existing firmware/UI thresholds and use its illustrative palette, not measured photographic colors; brightness follows opening.
