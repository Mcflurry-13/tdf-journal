import { FrontendStudy } from './FrontendStudy';
/**
 * Content blocks available inside week MDX files.
 *
 * Every Section / Entry renders as one numbered ROW:
 *   left  = number, date, title and the written text (sticky while scrolling)
 *   right = evidence: images, tables, code, video, files
 * Entry sorts its children automatically — authors just write text and blocks
 * in any order. Only code, files and video get a frame.
 */
import { Children, isValidElement, type ReactNode } from 'react';
import { IS_DEV, resolveAsset } from '../content';
import { absoluteUrl, formatDate, formatRange, formatShortDate, slugify } from '../format';
import type { StatusValue } from '../types';
import { useWeekDir } from '../week-context';
import { CodeBlock, Pre } from './CodeBlock';
import { Figure, Gallery, BeforeAfter } from './Gallery';
import { CadViewer, CadGroup } from './CadViewer';
export { Figure, Gallery, BeforeAfter, FigurePair, ImageGallery } from './Gallery';
import { ProjectTag } from './tags';

/* ---------- Status ---------- */

const STATUS: Record<StatusValue, { mark: string; label: string; cls: string }> = {
  verified: { mark: '■', label: 'Verified', cls: 'status status-ok' },
  'to-test': { mark: '○', label: 'To test', cls: 'status status-dashed' },
  unresolved: { mark: '△', label: 'Unresolved', cls: 'status' },
  'date-tbc': { mark: '', label: 'Date TBC', cls: 'status status-dashed' },
  pending: { mark: '○', label: 'Material pending', cls: 'status status-dashed' },
};

/** Told apart by text, shape and fill — never colour alone. */
export function Status({ value }: { value: StatusValue }) {
  const s = STATUS[value] ?? { mark: '', label: value, cls: 'status' };
  return (
    <span className={s.cls}>
      {s.mark && <span className="status-mark" aria-hidden="true">{s.mark}</span>}
      {s.label}
    </span>
  );
}

/* ---------- Rows: Section & Entry ---------- */

/** Splits children into text (left) and evidence blocks (right). */
function splitChildren(children: ReactNode) {
  const left: ReactNode[] = [];
  const right: ReactNode[] = [];
  Children.toArray(children).forEach((c) => {
    (isValidElement(c) && EVIDENCE.has(c.type) ? right : left).push(c);
  });
  return { left, right };
}

/**
 * Fixed parts of a week: “This week”, “Reflection”, “Next steps”.
 * Left: title (+ optional intro line). Right: the content.
 */
export function Section({
  id,
  title,
  intro,
  lead,
  children,
}: {
  id?: string;
  title: string;
  intro?: string;
  /** Larger reading size on the right, for Reflection. */
  lead?: boolean;
  children?: ReactNode;
}) {
  return (
    <section className={`row row-section${lead ? ' row-lead' : ''}`} id={id ?? slugify(title)} data-toc={title}>
      <div className="row-text">
        <header className="row-head">
          <span className="row-meta mono">
            <span className="row-num" aria-hidden="true" />
          </span>
          <h2 className="h2">{title}</h2>
        </header>
        {intro && <p className="row-intro">{intro}</p>}
      </div>
      <div className="row-media">
        <div className="row-prose">{children}</div>
      </div>
    </section>
  );
}

interface EntryProps {
  /** Real making date, YYYY-MM-DD. Unknown → "TBD" (shown as “Date TBC”). */
  date: string;
  dateEnd?: string;
  title: string;
  /** Free text: Class exercise · Fabrication test · Project · Quick test … */
  kind?: string;
  project?: string;
  /** Hidden from the production build. */
  draft?: boolean;
  children?: ReactNode;
}

/** One dated record. Appears in the numbered contents automatically. */
export function Entry({ date, dateEnd, title, kind, project, draft, children }: EntryProps) {
  if (draft && !IS_DEV) return null;
  const full = dateEnd && dateEnd !== date ? formatRange(date, dateEnd) : formatDate(date);
  const { left, right } = splitChildren(children);
  const hasEvidence = right.length > 0;
  return (
    <section
      className="row row-entry"
      id={slugify(`${date}-${title}`)}
      data-toc={title}
      data-toc-date={dateEnd && dateEnd !== date ? `${formatShortDate(date)}–${formatShortDate(dateEnd)}` : formatShortDate(date) ?? 'Date TBC'}
    >
      <div className="row-text">
        <header className="row-head">
          <span className="row-meta mono">
            <span className="row-num" aria-hidden="true" />
            <span aria-hidden="true">·</span>
            {full ?? <Status value="date-tbc" />}
            {kind && (
              <>
                <span aria-hidden="true">·</span>
                <span>{kind}</span>
              </>
            )}
            {draft && <span className="draft-badge">Draft · dev only</span>}
          </span>
          <h2 className="h2">{title}</h2>
          {project && (
            <div>
              <ProjectTag id={project} />
            </div>
          )}
        </header>
        {hasEvidence && <div className="row-prose">{left}</div>}
      </div>
      <div className="row-media">{hasEvidence ? right : <div className="row-prose">{left}</div>}</div>
    </section>
  );
}

/* ---------- Structured blocks ---------- */

interface PcrProps {
  problem: ReactNode;
  diagnosis?: ReactNode;
  change: ReactNode;
  result?: ReactNode;
  /** Default “to-test”: only set “verified” when it was physically checked. */
  status?: StatusValue;
}

export function ProblemChangeResult({ problem, diagnosis, change, result, status = 'to-test' }: PcrProps) {
  return (
    <dl className="pcr">
      <dt>Problem</dt>
      <dd>{problem}</dd>
      {diagnosis && (
        <>
          <dt>Diagnosis</dt>
          <dd>{diagnosis}</dd>
        </>
      )}
      <dt>Change</dt>
      <dd>{change}</dd>
      <dt>Result</dt>
      <dd>
        <Status value={status} /> {result}
      </dd>
    </dl>
  );
}

/** Key–value rows: materials, settings, input/output… */
export function Specs({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="kv">
      {rows.map(([k, v]) => (
        <div className="kv-row" key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Quote({ children }: { children?: ReactNode }) {
  return <blockquote className="quote">{children}</blockquote>;
}

/* ---------- Files & video ---------- */

const FileIcon = () => (
  <svg width="16" height="18" viewBox="0 0 16 18" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
    <path d="M1 1h9l5 5v11H1z" />
    <path d="M10 1v5h5" />
  </svg>
);

export function Attachments({ children }: { children?: ReactNode }) {
  return <ul className="attachments">{children}</ul>;
}

/** One file from the week’s files/ folder. kind: CAD · Code · Cut file … */
export function Attachment({ src, kind, label }: { src: string; kind?: string; label?: string }) {
  const dir = useWeekDir();
  const url = resolveAsset(dir, src);
  const name = label ?? src.split('/').pop();
  return (
    <li className="attachment">
      <FileIcon />
      <span className="mono attachment-name">{name}</span>
      <span className="mono muted">{kind}</span>
      {url ? (
        <a href={url} download data-print-url={absoluteUrl(url)}>
          Download
        </a>
      ) : (
        <span className="mono muted">File not found</span>
      )}
    </li>
  );
}

const PlayIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
    <circle cx="14" cy="14" r="13" fill="none" stroke="currentColor" />
    <path d="M11 9l8 5-8 5z" fill="currentColor" />
  </svg>
);

/** Local recordings play inline; external demonstrations remain links. */
export function Video({ href, src, title, duration, poster }: { href?: string; src?: string; title: string; duration?: string; poster?: string }) {
  const dir = useWeekDir();
  const img = resolveAsset(dir, poster);
  const local = src ? resolveAsset(dir, src) : undefined;
  const url = local ?? href;
  return (
    <figure className={local ? 'recording' : 'video'}>
      {local ? <>
        <video className="no-print" controls playsInline preload="none" poster={img} aria-label={title}>
          <source src={local} type="video/mp4" />
          <a href={local}>Open recording</a>
        </video>
        {img && <img className="print-only" src={img} alt={title} />}
      </> : <div className="video-poster">
        {img ? <img src={img} alt="" /> : <div className="placeholder"><PlayIcon /></div>}
      </div>}
      <figcaption className="video-meta">
        <span className="mono muted">VIDEO{duration ? ` · ${duration}` : ''}</span>
        <span className="video-title">{title}</span>
        <a href={url} target="_blank" rel="noreferrer" className="no-print">Open full-size recording ↗</a>
        <span className="print-only mono print-url">{url ? absoluteUrl(url) : ''}</span>
      </figcaption>
    </figure>
  );
}

/** Blocks that go to the right-hand column of an Entry. Everything else is text (left). */
const EVIDENCE = new Set<unknown>([
  Figure,
  CadViewer,
  CadGroup,
  FrontendStudy,
  Gallery,
  BeforeAfter,
  Specs,
  ProblemChangeResult,
  Attachments,
  Video,
  CodeBlock,
  Pre,
]);

