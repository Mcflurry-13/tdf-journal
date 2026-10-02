import { resolveAsset } from '../content';
import { useWeekDir } from '../week-context';

/** Two original recording states, arranged as the three frontend panels. */
export function FrontendStudy({drawing,result}:{drawing:string;result:string}) {
  const dir=useWeekDir();
  return <figure className="figure frontend-study">
    <div className="frontend-states" aria-label="Interface states: hand tracking, drawing and generated pattern">
      <img className="frontend-result" src={resolveAsset(dir,result)} width="2400" height="1324" alt="Drawing preview and generated ink pattern" loading="lazy" />
      <div className="frontend-hand-panel"><img src={resolveAsset(dir,drawing)} width="2400" height="1324" alt="Tracked hand pinching to draw" loading="lazy" /></div>
    </div>
    <figcaption><span className="caption-pointer" aria-hidden="true">▲</span>Hand tracking, drawing and generation — interface states.</figcaption>
  </figure>;
}
