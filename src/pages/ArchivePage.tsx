import { projects, site, typeById, types, weeksOfType } from '../content';
import { formatCourseWeeks } from '../format';
import { Link } from '../router';
import { ProjectTag } from '../components/tags';
import { WeekCard } from '../components/WeekCard';

/** Level 1: choose a type, then that type’s weeks in chronological order. */
export function ArchivePage({ typeId }: { typeId: string }) {
  const type = typeById(typeId)!;
  const list = weeksOfType(typeId);

  return (
    <div className="page">
      <header className="masthead">
        <div className="masthead-id">
          <span className="mono muted">
            {site.course} · {site.term}
          </span>
          <Link to="/" className="masthead-title">
            {site.title}
          </Link>
          <span className="mono muted">{site.author}</span>
        </div>
        <h1 className="display masthead-word">Design Journal</h1>
      </header>

      <section className="type-picker" aria-label="Journal categories">
        <nav className="type-tiles" aria-label="Types">
          {types.map((t) =>
            t.reserved ? (
              <div key={t.id} className="type-tile is-reserved" aria-disabled="true">
                <span className="type-tile-name">{t.name}</span>
                <span className="mono muted type-tile-blurb">{t.blurb}</span>
              </div>
            ) : (
              <Link
                key={t.id}
                to={`/${t.id}`}
                className="type-tile"
                aria-current={t.id === typeId ? 'page' : undefined}
                style={t.id === typeId ? { background: t.tint } : undefined}
              >
                <span className="type-tile-name">{t.name}</span>
                <span className="mono muted type-tile-blurb">{t.blurb}</span>
              </Link>
            ),
          )}
        </nav>
      </section>

      <div className="archive-body">
        <aside className="archive-side">
          <nav aria-label={`${type.name} weeks`} className="side-weeks">
            <h2 className="side-head">{type.name}</h2>
            {list.map((w) => (
              <Link key={w.path} to={w.path} className="week-row">
                <span className="mono muted">
                  {formatCourseWeeks(w.dateStart, w.dateEnd)}
                  {w.status === 'pending' ? ' · pending' : ''}
                </span>
              </Link>
            ))}
          </nav>
          {projects.length > 0 && (
            <section className="side-projects">
              <h2 className="side-head">Project</h2>
              <div className="card-tags">
                {projects.map((p) => (
                  <ProjectTag key={p.id} id={p.id} />
                ))}
              </div>
            </section>
          )}
        </aside>

        <main>
          <div className="section-head">
            <span className="mono muted">Chronological order</span>
          </div>
          <nav className="week-chips" aria-label="Jump to week">
            {list.map((w) => (
              <Link key={w.path} to={w.path} className="week-chip">
                {formatCourseWeeks(w.dateStart, w.dateEnd)}
              </Link>
            ))}
          </nav>
          {list.length === 0 ? (
            <p className="empty">No {type.name} weeks published yet.</p>
          ) : (
            <div className="card-grid">
              {list.map((w) => (
                <WeekCard key={w.path} week={w} />
              ))}
            </div>
          )}
          {list.length > 0 && (
            <div className="archive-foot mono muted">
              <span>{list.length} journal records</span>
              <Link to={`/${type.id}/print`}>Print all {type.short} records →</Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
