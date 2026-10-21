# Ambient Display journal preview

Based on the owner’s `outputs/sunset-flower/frontend`. This copy uses a local historical sample (Berkeley, October 15, 2026; 39/100) and never connects to the backend or hardware. Only the journal copy is changed; the working hardware app remains separate.

From this directory: `npm ci`, then `npm run build -- --base=./ --outDir ../../public/demos/ambient-display`.
The committed public directory is served inside the journal iframe. After rebuilding, remove obsolete hashed bundles from that directory if any. The parent accepts resize messages only from this iframe and the same origin.

The flower geometry, colors and motion come from the original frontend. The banner is the original AI-edited sunset illustration, not a photograph of the sample date. Controls illustrate commands; they do not measure petal positions.
