import type { ReactNode } from 'react';
import { sameWeekElsewhere, typeById } from '../content';
import { formatCourseWeeks, pad2 } from '../format';
import { Link } from '../router';
import type { Week } from '../types';
import { ProjectTag, TypeTag } from './tags';

/** Same two columns as the rows below: identity left, title + contents right. */
export function WeekHeader({ week, children }: { week: Week; children?: ReactNode }) {
  const type = typeById(week.type)!;
  const others = sameWeekElsewhere(week);
  return (
    <header className="week-head">
      <div className="week-head-id">
        <div className="card-tags"><TypeTag typeId={week.type} />{week.relatedTypes?.map(id => <TypeTag key={id} typeId={id} />)}</div>
        <p className="display week-code">
          {week.relatedTypes?.length ? 'Project' : type.short} — W{pad2(week.week)}
        </p>
        <span className="mono">{formatCourseWeeks(week.dateStart, week.dateEnd)}</span>
      </div>
      <div className="week-head-main">
        <h1 className="week-title">{week.title}</h1>
        {!!week.projects?.length && (
          <div className="card-tags">
            {week.projects.map((p) => (
              <ProjectTag key={p} id={p} />
            ))}
          </div>
        )}
        {others.map((o) => {
          const ot = typeById(o.type)!;
          return (
            <Link key={o.path} to={o.path} className="same-week no-print" style={{ background: ot.tint }}>
              <span>
                <span className="mono muted">Same week, other class · </span>
                {ot.name} — W{pad2(o.week)}: {o.title}
              </span>
              <span className="mono">{o.code} →</span>
            </Link>
          );
        })}
        {week.sample && (
          <p className="dev-note mono">Sample content — not a real record. Hidden from the production build.</p>
        )}
        {!week.sample && week.status === 'draft' && (
          <p className="dev-note mono">Draft — hidden from the production build.</p>
        )}
        {children}
      </div>
    </header>
  );
}
