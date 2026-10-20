# TDF Journal

A React + MDX journal for Physical Computing and Computational Design. Fabrication and Hardware Programming are tracks within Physical Computing.

Before updating the site, read the current production standards at the top of [HANDOFF.md](HANDOFF.md). [AGENTS.md](AGENTS.md) makes this the required entry point for future work.

## Run locally

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 8792
```

Open `http://127.0.0.1:8792/project/expressive-mechanics`.

## Update content

Edit the relevant `content/<type>/wNN/index.mdx`. Expressive Mechanics is `content/physical-computing/w03/index.mdx`; More Arduino is `content/physical-computing/w02/index.mdx`. Course-content weeks determine placement and chronological order; real making dates remain separate metadata. Cards use `Week N: Topic`.

Preserve the sticky left prose column and organize evidence on the right. Keep explanations concise but complete, with troubleshooting as supporting detail. Captions use a small triangle without visible media-kind prefixes. Photos and attachments live with their article. Follow HANDOFF.md for media orientation, trimming, evidence and review requirements.

## Build and print

`npm run build` checks TypeScript and generates `dist/`. Each journal page provides **Export as PDF**; the export uses the same concise, illustrated content as the page. The build creates a static entry file for each route, including direct project and week links.

## Publish

This repository deploys to GitHub Pages through `.github/workflows/pages.yml` after a push to `main`. The workflow runs the layout tests and production build. `JOURNAL_BASE=/tdf-journal/` sets the asset/router base; local development keeps `/`. The build writes static entry files for every known route so direct links return HTTP 200 on GitHub Pages.

See `HANDOFF.md` for Gallery, upload preparation, CAD and print rules. Run `npm test` for the deterministic layout checks.
