import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { imageSize } from 'image-size';
export async function imageManifest(root) {
  const manifest = {};
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(file);
      else if (/\.(png|jpe?g|gif|webp|avif|svg)$/i.test(file)) {
        const size = imageSize(await readFile(file));
        const swap = [5, 6, 7, 8].includes(size.orientation);
        manifest['/' + path.relative(root, file).split(path.sep).join('/')] = {
          width: swap ? size.height : size.width, height: swap ? size.width : size.height,
        };
      }
    }
  }
  await walk(path.join(root, 'content'));
  return manifest;
}
export function imageMetadataPlugin() {
  const id = '\0virtual:image-metadata'; let root;
  return {
    name: 'journal-image-metadata',
    configResolved(config) { root = config.root; },
    resolveId(source) { if (source === 'virtual:image-metadata') return id; },
    async load(source) { if (source === id) return `export default ${JSON.stringify(await imageManifest(root))}`; },
    configureServer(server) {
      // Added and replaced media get new dimensions without restarting Vite.
      server.watcher.on('all', (event, file) => {
        if (['add','change','unlink'].includes(event) && /\/content\/.*\.(png|jpe?g|gif|webp|avif|svg)$/i.test(file)) {
          const mod = server.moduleGraph.getModuleById(id);
          if (mod) server.moduleGraph.invalidateModule(mod);
          server.ws.send({ type: 'full-reload' });
        }
      });
    },
  };
}
