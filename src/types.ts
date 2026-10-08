import type { MDXContent } from 'mdx/types';

/** What an image is. Shown as a label before every caption. */
export type FigureKind = 'photo' | 'cad' | 'concept' | 'screen' | 'diagram';

export type StatusValue = 'verified' | 'to-test' | 'unresolved' | 'date-tbc' | 'pending';

/** draft = never built · pending = shown as “material pending” · published = normal */
export type WeekStatus = 'draft' | 'pending' | 'published';

export interface TypeDef {
  id: string;
  short: string;
  name: string;
  /** CSS colour or var(), used as a fill only — never for text. */
  tint: string;
  blurb: string;
  /** Shown as a dashed, non-clickable tile until the module starts. */
  reserved?: boolean;
  /** Internal content track grouped under a top-level archive. */
  parentId?: string;
}

export interface ProjectDef {
  id: string;
  name: string;
}

export interface SiteInfo {
  title: string;
  course: string;
  term: string;
  author: string;
  about: string;
}

/** Frontmatter at the top of content/<type>/<wNN>/index.mdx */
export interface WeekMeta {
  type: string;
  relatedTypes?: string[];
  week: number;
  /** YYYY-MM-DD, or "TBD" when not known. Never the upload date. */
  dateStart: string;
  dateEnd: string;
  title: string;
  summary: string;
  cover?: string;
  coverKind?: FigureKind;
  projects?: string[];
  status: WeekStatus;
  /** Page update date — separate from the real making dates. */
  updatedAt: string;
  /** Placeholder content shipped with the handoff. Visible in dev only. */
  sample?: boolean;
}

export interface Week extends WeekMeta {
  slug: string;
  /** Folder of this week, e.g. /content/physical-computing/w05 */
  dir: string;
  /** e.g. PC-W05 */
  code: string;
  /** Route, e.g. /physical-computing/w05 */
  path: string;
  Content: MDXContent;
}
