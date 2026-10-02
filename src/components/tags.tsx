import { projectById, typeById } from '../content';
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
