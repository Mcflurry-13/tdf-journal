import { projectById, typeById, weeksOfProject } from '../content';
import { Link } from '../router';
import { WeekCard } from '../components/WeekCard';

/** Every week (any type) tagged with a project. */
export function ProjectPage({ id }: { id: string }) {
  const project = projectById(id);
  const list = weeksOfProject(id);
  return (
    <div className="page">
      <div className="masthead">
        <div className="masthead-id">
          <Link to="/" className="mono">
            ← Design Journal
          </Link>
          <span className="mono muted">Project</span>
        </div>
      </div>
      <div className="section-head">
        <h1 className="label project-title">↳ {project?.name ?? id}</h1>
        <span className="mono muted">{list.length} journal sections</span>
      </div>
      {id === "expressive-mechanics" && <div className="project-intro"><p>A ceramic-shaped vessel responds through gesture, projection and rotation. These dated journals collect the mechanical iterations and the development of its interaction.</p><p className="mono muted">Week 3 · Final presentation</p></div>}
      {list.length === 0 ? (
        <p className="empty">No weeks tagged with this project yet.</p>
      ) : (
        <div className="card-grid">
          {list.map((w) => (
            <div key={w.path} className="project-cell">
              <span className="mono muted project-type">{typeById(w.type)?.name}</span>
              <WeekCard week={w} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
