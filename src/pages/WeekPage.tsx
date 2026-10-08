import { useRef } from 'react';
import { neighbours, site, categoryByType } from '../content';
import { absoluteUrl, formatDate, pad2 } from '../format';
import { Link } from '../router';
import type { Week } from '../types';
import { WeekContext } from '../week-context';
import { mdxComponents } from '../components/mdx-components';
import { ContentsGrid, ContentsToggle, useTocItems } from '../components/Contents';
import { WeekHeader } from '../components/WeekHeader';

/** Level 2: one class, one week — numbered rows, text left, evidence right. */
export function WeekPage({ week }: { week: Week }) {
  const type = categoryByType(week.type);
  const { newer, older } = neighbours(week);
  const bodyRef = useRef<HTMLDivElement>(null);
  const toc = useTocItems(bodyRef, week.path);
  const { Content } = week;

  return (
    <div className="week-page">
      <div className="topbar no-print">
        <nav aria-label="Breadcrumb" className="mono crumbs">
          <Link to="/">Design Journal</Link>
          <span className="muted">/</span>
          <Link to={`/${type.id}`}>{type.name}</Link>
          <span className="muted">/</span>
          <span aria-current="page">W{pad2(week.week)}</span>
        </nav>
        <nav aria-label="Week navigation" className="mono week-step">
          {older ? <Link to={older.path}>‹ {older.code}</Link> : <span className="muted">‹</span>}
          <span>{week.code}</span>
          {newer ? <Link to={newer.path}>{newer.code} ›</Link> : <span className="muted">›</span>}
        </nav>
        <button type="button" className="btn topbar-export" onClick={() => window.print()}>
          Export as PDF
        </button>
      </div>

      <article className="week-wrap">
        <div className="print-runhead print-only">
          <span>
            {site.title} · {site.author}
          </span>
          <span>
            {type.name} · W{pad2(week.week)}
          </span>
        </div>

        <WeekHeader week={week}>
          <ContentsGrid items={toc} />
        </WeekHeader>
        <ContentsToggle items={toc} />

        <WeekContext.Provider value={{ dir: week.dir, week: week.week }}>
          <div className="week-body" ref={bodyRef}>
            <Content components={mdxComponents} />
          </div>
        </WeekContext.Provider>

        <nav className="week-pager no-print" aria-label={`Previous and next week in ${type.name}`}>
          {older ? (
            <Link to={older.path}>
              <span className="mono muted">‹ Previous · {older.code}</span>
              <span className="pager-title">{older.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {newer ? (
            <Link to={newer.path} className="pager-next">
              <span className="mono muted">Next · {newer.code} ›</span>
              <span className="pager-title">{newer.title}</span>
            </Link>
          ) : (
            <span className="pager-next" />
          )}
        </nav>
        <button type="button" className="btn mobile-export no-print" onClick={() => window.print()}>
          Export as PDF
        </button>

        <footer className="print-foot print-only">
          <span>
            Exported {new Date().toISOString().slice(0, 10).replace(/-/g, '.')} · page updated{' '}
            {formatDate(week.updatedAt) ?? 'TBC'}
          </span>
          <span>{absoluteUrl(week.path)}</span>
        </footer>
      </article>
    </div>
  );
}
