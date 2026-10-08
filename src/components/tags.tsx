import type { Week } from '../types';
import { projectById, typeById, tracksOfWeek } from '../content';
import { Link } from '../router';

/** Type tag — tint is a fill only, text stays ink. */
export function TypeTag({ typeId }: { typeId: string }) {
  const t = typeById(typeId);
  if (!t) return null;
  return (
    <span className="tag" style={{ background: t.tint }}>
      {t.name}
    </span>
  );
}

export function ProjectTag({ id, link = true }: { id: string; link?: boolean }) {
  const name = projectById(id)?.name ?? id;
  return link ? (
    <Link to={`/project/${id}`} className="tag tag-project">
      ↳ {name}
    </Link>
  ) : (
    <span className="tag tag-project">↳ {name}</span>
  );
}

export function TrackTags({ week }: { week: Week }) {
  return <>{tracksOfWeek(week).map(track => <span key={track.id} className="tag" style={{ background: track.tint }}>{track.name}</span>)}</>;
}
