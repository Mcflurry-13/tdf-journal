# TDF Journal

A React + MDX journal for Physical Computing and Digital Fabrication.

## Run locally

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 8792
```

Open `http://127.0.0.1:8792/project/expressive-mechanics`.

## Update content

Edit `content/physical-computing/w05/index.mdx` for the combined Expressive Mechanics journal. Both course categories and the project link open this one article. Related problems are grouped into short dated entries, with photographs and CAD comparisons. Photos and attachments live in the same entry folder. Each numbered row pairs short text with its images; captions retain their media kind labels. Week 5 is the course project grouping; the pages display actual record dates. Image links open the full-size file.

## Build and print

`npm run build` checks TypeScript and generates `dist/`. Each journal page provides **Export as PDF**; the export uses the same concise, illustrated content as the page. The build creates a static entry file for each route, including direct project and week links.

## Publish

This repository deploys to GitHub Pages through `.github/workflows/pages.yml` after a push to `main`. The workflow runs the layout tests and production build. `JOURNAL_BASE=/tdf-journal/` sets the asset/router base; local development keeps `/`. The build writes static entry files for every known route so direct links return HTTP 200 on GitHub Pages.

See `HANDOFF.md` for Gallery, upload preparation, CAD and print rules. Run `npm test` for the deterministic layout checks.
