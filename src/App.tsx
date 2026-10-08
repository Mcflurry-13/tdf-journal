import { useEffect } from 'react';
import { findWeek, firstType, site, weeksOfProject, typeById } from './content';
import { Link, usePath } from './router';
import { ArchivePage } from './pages/ArchivePage';
import { WeekPage } from './pages/WeekPage';
import { PrintBundlePage } from './pages/PrintBundlePage';
import { ProjectPage } from './pages/ProjectPage';

/**
 * Routes
 *   /                       Archive, first type selected
 *   /:type                  Archive, that type selected
 *   /:type/:week            Week page, e.g. /physical-computing/w05
 *   /:type/print            All weeks of a type, for one PDF
 *   /project/:id            Weeks tagged with a project
 */
export function App() {
  const path = usePath();
  const parts = path.split('/').filter(Boolean);

  let page = <NotFound />;
  let title = site.title;

  if (parts.length === 0) {
    page = <ArchivePage typeId={firstType.id} />;
  } else if (parts[0] === 'project' && parts[1]) {
    const records = weeksOfProject(parts[1]);
    page = records.length === 1 ? <WeekPage week={records[0]} /> : <ProjectPage id={parts[1]} />;
    if (records.length === 1) title = `${records[0].title} · ${site.title}`;
  } else if (parts.length === 1 && typeById(parts[0]) && !typeById(parts[0])!.reserved) {
    page = <ArchivePage typeId={parts[0]} />;
    title = `${typeById(parts[0])!.name} · ${site.title}`;
  } else if (parts.length === 2 && parts[1] === 'print' && typeById(parts[0])) {
    page = <PrintBundlePage typeId={parts[0]} />;
    title = `${typeById(parts[0])!.name} — all weeks · ${site.title}`;
  } else if (parts.length === 2) {
    const week = findWeek(parts[0], parts[1]);
    if (week) {
      page = <WeekPage key={week.path} week={week} />;
      title = `${week.code} ${week.title} · ${site.title}`;
    }
  }

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <>
      {page}
    </>
  );
}

function NotFound() {
  return (
    <div className="page">
      <p className="mono muted">Not found</p>
      <p>
        <Link to="/">← Back to Design Journal</Link>
      </p>
    </div>
  );
}
