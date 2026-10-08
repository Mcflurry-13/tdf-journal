import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
/** GitHub Pages needs real entry files for clean URLs (no 404 redirect hack). */
export function staticRoutesPlugin() {
 let root,dist;
 return { name:'journal-static-routes', configResolved(c){root=c.root;dist=path.resolve(root,c.build.outDir);}, async closeBundle(){
  const html=await readFile(path.join(dist,'index.html'),'utf8');
  const types=JSON.parse(await readFile(path.join(root,'content/types.json'),'utf8'));
  const projects=JSON.parse(await readFile(path.join(root,'content/projects.json'),'utf8'));
  const routes=new Set(projects.map(p=>`project/${p.id}`));
  const legacyRoutes=JSON.parse(await readFile(path.join(root,'content/legacy-routes.json'),'utf8'));
  for(const route of Object.keys(legacyRoutes))routes.add(route.slice(1));
  const slugs=new Set();
  for(const t of types.filter(t=>!t.reserved)) {
   routes.add(t.id);routes.add(`${t.id}/print`);
   try {for(const entry of await readdir(path.join(root,'content',t.id),{withFileTypes:true}))if(entry.isDirectory())slugs.add(entry.name);}catch{}
  }
  for(const t of types.filter(t=>!t.reserved))for(const slug of slugs)routes.add(`${t.id}/${slug}`);
  for(const route of routes){await mkdir(path.join(dist,route),{recursive:true});await writeFile(path.join(dist,route,'index.html'),html);}
  await writeFile(path.join(dist,'404.html'),html);
 }};
}
