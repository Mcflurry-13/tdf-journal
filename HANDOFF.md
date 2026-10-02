# TDF Journal — developer handoff

A personal course journal for TDF. The **web page is the main reading form**; the **PDF is the same content printed** (no second copy of the text).

This folder is a working starter: React + TypeScript + plain CSS variables + MDX content, built with Vite. No backend, no CMS, no router library.

---

## 0 · Ground rules (read first)

1. **Never invent content.** No made-up dates, test results, learning outcomes or photos. Everything under `content/` marked `sample: true` is placeholder structure only.
2. **Dates:** each entry has its own real making date. Unknown → `TBD` (renders “Date TBC”). Never use the upload / file date. The page update date (`updatedAt`) is a separate field.
3. **Status** (`verified`, `to-test`, `unresolved`) comes only from the owner’s own words. Never infer “verified” from a photo. A CAD check is not physical verification.
4. **Image kinds** must be correct: `photo` (real object), `cad` (CAD preview), `concept` (render), `screen`, `diagram`. Never present a concept render or CAD view as a finished physical prototype.
5. **Drafts and samples never ship.** `status: draft`, `<Entry draft>` and `sample: true` are visible in `npm run dev` only.
6. Do **not** deploy, publish or overwrite any existing site unless the owner asks.
7. The Expressive Mechanics vase is a **3D-printed ceramic-form prototype**, not fired ceramic. Links to family and memory are **design intent**, not research findings. No LED strip in the current design.

---

## 1 · Run it

```bash
npm install
npm run dev        # http://localhost:5173 — shows drafts + samples
npm run build      # type-check + production build into dist/ (drafts & samples excluded)
npm run preview    # serve dist/
```

Node 18+ (tested on Node 24). Hosting: any static host. Because routes are real paths (`/physical-computing/w05`), the host must fall back to `index.html` for unknown paths (Netlify `_redirects`, Vercel rewrites, GitHub Pages `404.html` copy). For a sub-path, set `base` in `vite.config.ts`.

---

## 2 · Information architecture

Archives group records by class. Expressive Mechanics is one combined article; `relatedTypes: [digital-fabrication]` makes both Week 5 routes and the project route resolve to it.

```
/                          Archive (first type selected)
/physical-computing        Archive → choose type → that type’s weeks, newest first
/physical-computing/w05    Week page “PC — W05” (one class, one week)
  #<date>-<entry-title>    Entry anchor (contents links)
/physical-computing/print  All weeks of one type in one printable page (multi-week PDF)
/project/expressive-mechanics   Weeks tagged with a project, across types
```

Week page: breadcrumb · prev/next **within the same type** · link to the **same week in the other type** (PC-W05 ↔ DF-W05) · numbered contents grid (desktop) / collapsed “Contents” (mobile) · header · body · prev/next.

Types are data (`content/types.json`). Computational Design is already listed as `reserved: true` (dashed, not clickable). Remove `reserved` when the module starts.

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
week: 5                       # calendar week number, shared across types
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

**Owner sends loose material** (photos, code, a paragraph, a date): put it in the right `<type>/wNN/` by its real date; ask when the date or type is unclear (use `TBD`, don’t guess); write captions that describe, not judge; mark status only from their words.

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

## 9 · Open decisions (ask the owner)

1. **Project work outside class** — inside the nearest type’s week (current), or a separate “Project” track?
2. **Week numbering** — assumed shared calendar weeks (PC-W05 and DF-W05 = same week).
3. **Archive order** — newest first (current) or W01 first?
4. **Fonts** — provisional; replace with the owner’s existing Journal fonts once provided.
5. **Site details** — title, name, course, term in `content/site.json`.
6. **Hosting** — not chosen; nothing is deployed.

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
- Kind labels (PHOTO / CAD / SCREEN / DIAGRAM / CONCEPT) are retained. Preserve author-supplied `kind` and `caption` verbatim when importing assets.
- `<Gallery layout="grid" cols={2}>` (or 3) explicitly opts into equal 4:3 crop cells using `object-fit: cover`; `<Figure focus="50% 30%">` supplies the crop position. Mobile uses at most two columns. Default galleries never crop.
- `<Figure wide>` forces its own full row and obeys the singleton height cap.
- `<BeforeAfter>` stays two-up with equal image heights, including on mobile. It preserves aspect ratios rather than cropping. Print can break between gallery rows, never between an image and its caption.

### Preparing future uploads

Install `Pillow` and `pillow-heif`, then run:

```sh
python scripts/prepare_media.py source.HEIC content/physical-computing/w05/images/descriptive-name.jpg --kind photo
```

The script applies EXIF orientation, exports a maximum 2400px long edge at JPEG quality 82, strips metadata and preserves the source. Real photos are never trimmed. For `cad`, `screen` or `diagram`, it removes enclosing white/near-white margins (threshold 240), then adds an even padding of 4% of the trimmed long edge. Use `photo` for documentary photographs even when their background is white. Animated GIFs must not go through this still-image converter. Never bake labels into photographs automatically; use the caption.

### STL previews and motion

`<CadViewer src="./files/part.stl" poster="./images/part.jpg" caption="…" />` keeps an accessible static image until the reader chooses Explore 3D. Drag rotates, scroll zooms, arrow keys rotate, and Reset view restores the initial camera. The STL download remains available if WebGL fails. `flip` shows a part from below; `color` sets the mesh colour. Print always uses the poster and its caption; the original part file is unchanged.

### Verification

Run `node scripts/gallery-layout.test.mjs` and `npm run build`. At 1440px and 390px, inspect both Week 5 routes: shared caption tops, equal image heights, filled multi-image row edges, singleton height caps, no overflow, no cropped photos and no missing metadata. Confirm that the two URLs display the same source article. Capture the screenshots outside the published content folder.

## Inline recordings and readable code

Use `<Video src="./files/clip.mp4" poster="./images/poster.jpg" title="…" duration="0:30" />` for a local recording. It shows native controls, never autoplays, preserves the full frame, and prints its poster. Keep excerpts focused; retain the original recording outside the site.

Use `<CodeBlock src="./files/sketch.ino" lang="Arduino" />` to preview, expand, copy and download the actual source. Source comments and interface labels are English. Expected serial output illustrations must be labelled as expected, not recorded test results. Fabrication iterations in Week 5 end on September 24; later capture dates are not fabrication dates.
