/**
 * Reading guides for the two Folio journals (Computational Design, weeks 3–4).
 * Everything here is styled by the `.fj-*` block at the end of base.css and is
 * used only in those two chapters. Diagram wording lives in folio-diagrams.json
 * so the prose, the diagrams and the offline proof stay in step.
 */
import { Fragment, type CSSProperties, type ReactNode } from 'react';
import { resolveAsset } from '../content';
import { useWeekDir } from '../week-context';
import { imageDimensions } from './Gallery';
import diagrams from './folio-diagrams.json';

/** One short phrase per claim. The nearby figure repeats the same words. */
export function Hl({ children }: { children?: ReactNode }) {
  return <mark className="fj-hl">{children}</mark>;
}

const Caption = ({ children }: { children?: ReactNode }) => (
  <figcaption><span className="caption-pointer" aria-hidden="true">▲</span>{children}</figcaption>
);

interface FocusProps {
  /** The readable crop shown in the page. */
  src: string;
  /** The untouched original, opened from the image and from the caption link. */
  full: string;
  caption: string;
  alt: string;
  /** Largest display width in CSS pixels. */
  width?: number;
  /** Phones: enlarge the crop by this factor and start `x` percent from the left. */
  zoom?: number;
  x?: number;
}

/** A key part of a screenshot at a readable size, with the full original one click away. */
export function FocusFigure({ src, full, caption, alt, width, zoom, x = 0 }: FocusProps) {
  const dir = useWeekDir();
  const url = resolveAsset(dir, src);
  const original = resolveAsset(dir, full) ?? url;
  const size = imageDimensions(dir, src);
  const style = { maxWidth: width, '--fj-zoom': zoom, '--fj-x': zoom ? x : undefined } as CSSProperties;
  if (!url) return <div className="placeholder">Image not found: {src}</div>;
  return (
    <figure className="figure fj-focus" style={style} data-zoom={zoom ? true : undefined}>
      <a href={original} target="_blank" rel="noreferrer" aria-label="Open the full original screenshot" className="figure-image-link fj-frame">
        <img src={url} width={size?.width} height={size?.height} alt={alt} loading="lazy"
          style={size ? { aspectRatio: `${size.width} / ${size.height}` } : undefined} />
      </a>
      <figcaption>
        <span className="caption-pointer" aria-hidden="true">▲</span>{caption}{' '}
        <a className="fj-full no-print" href={original} target="_blank" rel="noreferrer">View full screenshot ↗</a>
      </figcaption>
    </figure>
  );
}

const Down = () => (
  <svg className="fj-down" viewBox="0 0 12 22" aria-hidden="true">
    <path d="M6 1v19M1.5 15.5 6 20l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);
const Fork = () => (
  <svg className="fj-fork" viewBox="0 0 400 34" preserveAspectRatio="none" aria-hidden="true">
    <path d="M200 0v14H100v18M200 14h100v18" fill="none" stroke="currentColor" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
  </svg>
);

interface LaneData { title: string; want: string; steps: string[][]; out: string }

/** Journal 05: one collection, two moments. Lane titles match the prose word for word. */
export function FolioTwoMoments() {
  const d = diagrams.moments as { caption: string; lanes: LaneData[] };
  return (
    <figure className="fj-diagram fj-moments">
      <div className="fj-box"><span className="fj-cap">One collection</span><strong>My saved posts</strong><p>Mixed posts saved from RedNote.</p></div>
      <Fork />
      <div className="fj-lanes">
        {d.lanes.map((lane, n) => (
          <section className="fj-lane" key={lane.title}>
            <div className="fj-lane-head"><span className="fj-cap">Moment {n + 1}</span><strong>{lane.title}</strong><p>{lane.want}</p></div>
            {lane.steps.map(([who, text], i) => (
              <Fragment key={text}>
                {i > 0 && <Down />}
                <div className={`fj-box fj-step${who === 'Folio' ? ' fj-model' : ''}`}><span className="fj-cap">{who}</span><span>{text}</span></div>
              </Fragment>
            ))}
            <Down />
            <p className="fj-result">{lane.out}</p>
          </section>
        ))}
      </div>
      <Caption>{d.caption}</Caption>
    </figure>
  );
}

/** Journal 05: who decides what, with one example each. */
export function FolioRoles() {
  const d = diagrams.roles as { caption: string; cols: string[][] };
  return (
    <figure className="fj-diagram">
      <div className="fj-roles">
        {d.cols.map(([kind, name, decides, example]) => (
          <section className={`fj-box fj-role ${kind}`} key={name}>
            <div><span className="fj-cap">{name}</span><strong>{decides}</strong></div>
            <div><span className="fj-cap">Example</span><p>{example}</p></div>
          </section>
        ))}
      </div>
      <Caption>{d.caption}</Caption>
    </figure>
  );
}

interface SequenceData { caption: string; start: string[]; cols: string[][]; stages: string[][]; end: string[]; leave: string[] }
const CELL = ['', ' fj-model', ' fj-program'];
const Box = ({ text, extra = '' }: { text: string[]; extra?: string }) => (
  <div className={`fj-box${extra}`}><span className="fj-cap">{text[0]}</span><strong>{text[1]}</strong><p>{text[2]}</p></div>
);

/** Journal 05: one task, stage by stage: what the browser sends, what the model judges, what the server checks. */
export function FolioSequence() {
  const d = diagrams.sequence as SequenceData;
  return (
    <figure className="fj-diagram">
      <div className="fj-flow">
        <Box text={d.start} />
        <Down />
        <div className="fj-stages">
          <div className="fj-col-h" />
          {d.cols.map(([name, sub]) => <div className="fj-col-h" key={name}><strong>{name}</strong><span>{sub}</span></div>)}
          {d.stages.map(([tag, ...cells]) => (
            <Fragment key={tag}>
              <code className="fj-stage">{tag}</code>
              {cells.map((text, i) => (
                <div className={`fj-box fj-cell${text ? CELL[i] : ' fj-none'}`} key={i}>
                  <span className="fj-cap">{d.cols[i][0]}</span>{text || 'No check at this stage.'}
                </div>
              ))}
            </Fragment>
          ))}
        </div>
        <Down />
        <Box text={d.end} />
        <Down />
        <Box text={d.leave} extra=" fj-leave" />
      </div>
      <Caption>{d.caption}</Caption>
    </figure>
  );
}

/** Journal 06: one post followed through both organizing steps after the first revision. */
interface RunData { caption: string; flowCap: string; flow: string[][]; pickCap: string; post: string[]; steps: [string, string, string, string[], string][]; result: string }
export function FolioRunOutputs() {
  const d = diagrams.run as unknown as RunData;
  return (
    <figure className="fj-diagram fj-run">
      <div className="fj-box">
        <span className="fj-cap">{d.flowCap}</span>
        <ol className="fj-chips">
          {d.flow.map(([text, tag]) => <li className={`fj-chip${tag ? ' fj-on' : ''}`} key={text}>{tag && <b>{tag}</b>}{text}</li>)}
        </ol>
        <span className="fj-cap">{d.pickCap}</span><strong>{d.post[0]}</strong><p>{d.post[1]}</p>
      </div>
      <Fork />
      <div className="fj-two">
        {d.steps.map(([kind, cap, title, lines, verdict]) => (
          <div className={`fj-box ${kind}`} key={cap}>
            <span className="fj-cap">{cap}</span><strong>{title}</strong>
            <p>{lines.map((line, i) => <Fragment key={line}>{i > 0 && <br />}{line}</Fragment>)}</p>
            <p className="fj-verdict">{verdict}</p>
          </div>
        ))}
      </div>
      <Down />
      <p className="fj-result">{d.result}</p>
      <Caption>{d.caption}</Caption>
    </figure>
  );
}
