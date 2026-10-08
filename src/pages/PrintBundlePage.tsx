import { site, typeById, weeksOfType } from '../content';
import { formatWeek } from '../format';
import { Link } from '../router';
import { WeekContext } from '../week-context';
import { mdxComponents } from '../components/mdx-components';
import { WeekHeader } from '../components/WeekHeader';

/** Multi-week PDF: cover + contents + every published week of one type, oldest first. */
export function PrintBundlePage({ typeId }: { typeId: string }) {
  const type = typeById(typeId)!;
  const list = weeksOfType(typeId).filter((w) => w.status !== 'pending');

  return (
    <div className="page bundle">
      <div className="topbar bundle-bar no-print">
        <Link to={`/${type.id}`} className="mono">
          ← {type.name}
        </Link>
        <span className="mono muted">Print preview · {list.length} journal records</span>
        <button type="button" className="btn" onClick={() => window.print()}>
          Print / save as PDF
        </button>
      </div>

      <section className="bundle-cover">
        <p className="mono muted">
          {site.course} · {site.term}
        </p>
        <h1 className="display bundle-title">{type.name}</h1>
        <p className="mono">
          {site.title} · {site.author}
        </p>
        <p className="mono muted">Exported {new Date().toISOString().slice(0, 10).replace(/-/g, '.')}</p>
        <ol className="bundle-toc">
          {list.map((w) => (
            <li key={w.path}>
              <span className="mono">{w.code}</span>
              <span>{w.title}</span>
              <span className="mono muted">{formatWeek(w.week)}</span>
            </li>
          ))}
        </ol>
      </section>

      {list.map((w) => (
        <section key={w.path} className="bundle-week">
          <WeekHeader week={w} />
          <WeekContext.Provider value={{ dir: w.dir, week: w.week }}>
            <div className="week-body">
              <w.Content components={mdxComponents} />
            </div>
          </WeekContext.Provider>
        </section>
      ))}
    </div>
  );
}
