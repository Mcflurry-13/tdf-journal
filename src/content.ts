/**
 * Loads every week from content/<type>/<wNN>/index.mdx at build time.
 * Pages never hard-code weeks: adding a folder is enough.
 */
import type { MDXContent } from 'mdx/types';
import legacyRoutes from '../content/legacy-routes.json';
import siteJson from '../content/site.json';
import typesJson from '../content/types.json';
import projectsJson from '../content/projects.json';
import type { ProjectDef, SiteInfo, TypeDef, Week, WeekMeta } from './types';
import { pad2 } from './format';

interface MdxModule {
  default: MDXContent;
  frontmatter?: Partial<WeekMeta> & Record<string, unknown>;
}

const modules = import.meta.glob<MdxModule>('/content/*/*/index.mdx', { eager: true });

/** Every image / file inside a week folder, as a built URL. */
const assetUrls = import.meta.glob<string>('/content/*/*/{images,files}/**/*', {
  eager: true,
  query: '?url',
  import: 'default',
});

/** Code files inside files/, as text, for <CodeBlock src="./files/…" />. */
const codeFiles = import.meta.glob<string>(
  '/content/*/*/files/**/*.{ino,pde,js,ts,py,c,cpp,h,txt,json}',
  { eager: true, query: '?raw', import: 'default' },
);

/** Drafts and sample weeks/entries are only visible in `npm run dev`. */
export const IS_DEV = import.meta.env.DEV;

export const site: SiteInfo = siteJson;
export const types: TypeDef[] = typesJson;
export const projects: ProjectDef[] = projectsJson;

function asDateString(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return v == null || v === '' ? 'TBD' : String(v);
}

function toWeek(path: string, mod: MdxModule): Week | null {
  // /content/<type>/<slug>/index.mdx
  const [, , typeId, slug] = path.split('/');
  const fm = mod.frontmatter ?? {};
  const type = types.find((t) => t.id === typeId);
  if (!type) {
    console.warn(`[content] ${path}: folder "${typeId}" is not listed in content/types.json`);
    return null;
  }
  if (fm.type && fm.type !== typeId) {
    console.warn(`[content] ${path}: frontmatter type "${fm.type}" ≠ folder "${typeId}"; folder wins`);
  }
  const week = Number(fm.week ?? slug.replace(/\D/g, ''));
  return {
    type: typeId,
    relatedTypes: fm.relatedTypes ?? [],
    week,
    dateStart: asDateString(fm.dateStart),
    dateEnd: asDateString(fm.dateEnd),
    title: fm.title ?? '[Untitled week]',
    summary: fm.summary ?? '',
    cover: fm.cover,
    coverKind: fm.coverKind ?? 'photo',
    projects: fm.projects ?? [],
    status: fm.status ?? 'draft',
    updatedAt: asDateString(fm.updatedAt),
    sample: fm.sample === true,
    slug,
    dir: `/content/${typeId}/${slug}`,
    code: `${type.short}-W${pad2(week)}`,
    path: `/${typeId}/${slug}`,
    Content: mod.default,
  };
}

const isVisible = (w: Week) => IS_DEV || (w.status !== 'draft' && !w.sample);

/** All visible weeks in course order, earliest first. */
export const weeks: Week[] = Object.entries(modules)
  .map(([path, mod]) => toWeek(path, mod))
  .filter((w): w is Week => w !== null && isVisible(w))
  .sort((a, b) => a.week - b.week || a.dateStart.localeCompare(b.dateStart) || a.path.localeCompare(b.path));

export const firstType = types.find((t) => !t.reserved) ?? types[0];

export const typeById = (id: string) => types.find((t) => t.id === id);
export const projectById = (id: string) => projects.find((p) => p.id === id);
export const weeksOfType = (typeId: string) => weeks.filter((w) => w.type === typeId || w.relatedTypes?.includes(typeId));
export const weeksOfProject = (id: string) => weeks.filter((w) => w.projects?.includes(id));
export const findWeek = (typeId: string, slug: string) =>
  weeks.find((w) => (w.type === typeId || w.relatedTypes?.includes(typeId)) && w.slug === slug) ??
  weeks.find((w) => w.path === (legacyRoutes as Record<string, string>)[`/${typeId}/${slug}`]);

/** Newer / older week within the same type. */
export function neighbours(week: Week) {
  const list = weeksOfType(week.type);
  const i = list.indexOf(week);
  return { older: i > 0 ? list[i - 1] : undefined, newer: list[i + 1] };
}

/** The same course-content week in the other type(s). */
export const sameWeekElsewhere = (week: Week) =>
  weeks.filter((w) => w.week === week.week && w.type !== week.type);

function key(dir: string, src: string) {
  return `${dir}/${src.replace(/^\.\//, '')}`;
}

/** "./images/a.jpg" inside a week → built URL. External URLs pass through. */
export function resolveAsset(dir: string, src: string | undefined): string | undefined {
  if (!src) return undefined;
  if (/^(https?:)?\/\//.test(src)) return src;
  return assetUrls[key(dir, src)];
}

export function readCodeFile(dir: string, src: string): string | undefined {
  return codeFiles[key(dir, src)];
}
