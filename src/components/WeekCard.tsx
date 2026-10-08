import { resolveAsset } from '../content';
import { formatRange } from '../format';
import { Link } from '../router';
import type { Week } from '../types';
import { Status } from './blocks';
import { ProjectTag } from './tags';

export function WeekCard({ week }: { week: Week }) {
  const cover = resolveAsset(week.dir, week.cover);
  const pending = week.status === 'pending';
  return (
    <article className="card">
      <div className="card-top">
        <span className="mono muted">{formatRange(week.dateStart, week.dateEnd)}</span>
      </div>
      {pending ? (
        <div className="card-pending">
          <Status value="pending" />
          <span className="mono muted">No cover image until there is one</span>
        </div>
      ) : cover ? (
        <img className="card-cover" src={cover} alt="" loading="lazy" />
      ) : (
        <div className="placeholder card-cover">No cover image yet</div>
      )}
      <h3 className="card-title">
        <Link to={week.path}>{week.title}</Link>
      </h3>
      {week.summary && <p className="card-summary">{week.summary}</p>}
      {!!week.projects?.length && (
        <div className="card-tags">
          {week.projects.map((p) => (
            <ProjectTag key={p} id={p} link={false} />
          ))}
        </div>
      )}
      {(week.sample || week.status === 'draft') && (
        <span className="mono muted">{week.sample ? 'Sample' : 'Draft'} · dev only</span>
      )}
      <Link to={week.path} className="card-open">
        Read journal →
      </Link>
    </article>
  );
}
