import process from 'node:process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { imageMetadataPlugin } from './scripts/image-metadata.mjs';
import { staticRoutesPlugin } from './scripts/static-routes.mjs';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

export default defineConfig({
  base: process.env.JOURNAL_BASE || '/',
  server: { watch: { usePolling: true, interval: 750 } },
  plugins: [
    imageMetadataPlugin(),
    staticRoutesPlugin(),
    // MDX week files export their YAML frontmatter as `frontmatter`.
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm] }) },
    react({ include: /\.(mdx|tsx|ts)$/ }),
  ],
});
