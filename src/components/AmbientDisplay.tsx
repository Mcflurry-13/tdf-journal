import { resolveAsset } from '../content';
import { useWeekDir } from '../week-context';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { FlowerFigure, TIER_COLOR } from './ambient/FlowerFigure';
import { lightLevel, peakFromQuality, smoothstep, tierFromQuality, visualOpen } from './ambient/mapping';
import './ambient/ambient.css';

function Node({tone,title,children}:{tone:string;title:string;children:ReactNode}) {
  return <div className={`ambient-node ambient-${tone}`}><span className="ambient-category">{tone === 'code' ? 'Software' : tone === 'board' ? 'Electronics' : 'Mechanics'}</span><h3>{title}</h3><ul>{children}</ul></div>;
}
export function AmbientSystem() {
  return <figure className="figure ambient-system">
    <div className="ambient-system-grid">
      <Node tone="code" title="Forecast service"><li>Sunsethue: Berkeley sunset</li><li>Quality score from 0 to 100</li><li>HTTPS request from the Mac</li></Node>
      <Node tone="code" title="Browser interface"><li>Hold, Breathe and Stop</li><li>Illustrates the commanded motion</li><li>HTTP commands to the Mac</li></Node>
      <div className="ambient-flow ambient-span">↓ Forecast data and user commands</div>
      <div className="ambient-span"><Node tone="code" title="Python on the Mac"><li>Checks the forecast date and quality</li><li>Owns the USB connection</li><li>Sends commands and reads acknowledgments</li></Node></div>
      <div className="ambient-flow ambient-span">↓ USB serial · command → device · acknowledgment → Mac</div>
      <div className="ambient-span"><Node tone="board" title="Feather ESP32 V2"><li>Arduino firmware maps quality to motion and light</li><li>GPIO14 sends servo control pulses</li><li>GPIO27 sends NeoPixel data through a 330 Ω resistor</li></Node></div>
      <div className="ambient-flow">↓ Servo pulses</div><div className="ambient-flow">↓ Pixel data</div>
      <Node tone="motion" title="MG90S and petals"><li>Positional servo turns its horn</li><li>Wire pulls the printed lower layer</li><li>Linked petals open and close</li></Node>
      <Node tone="board" title="Two NeoPixel sticks"><li>Eight RGB pixels on each stick</li><li>First stick’s output feeds the second</li><li>Color follows forecast quality</li></Node>
    </div>
    <div className="ambient-power"><strong>Power and ground</strong><ul><li>USB powers the ESP32 board.</li><li>External 5 V powers the servo and both LED sticks.</li><li>Supply, board, servo and LEDs share ground.</li></ul></div>
    <figcaption><span className="caption-pointer" aria-hidden="true">▲</span>Software → electronics → physical movement and light.</figcaption>
  </figure>;
}

export function AmbientMapping() {
  const [score,setScore]=useState(39), [mode,setMode]=useState<'hold'|'breathe'>('hold');
  const [running,setRunning]=useState(true), [elapsed,setElapsed]=useState(0), [reduced,setReduced]=useState(false);
  const host=useRef<HTMLDivElement>(null), [visible,setVisible]=useState(false);
  useEffect(()=>{const q=matchMedia('(prefers-reduced-motion: reduce)'); const change=()=>setReduced(q.matches);change();q.addEventListener('change',change);return()=>q.removeEventListener('change',change);},[]);
  useEffect(()=>{const o=new IntersectionObserver(([e])=>setVisible(e.isIntersecting));if(host.current)o.observe(host.current);return()=>o.disconnect();},[]);
  useEffect(()=>{
    if(mode!=='breathe'||!running||reduced||!visible)return;
    let frame=0,last=performance.now();
    const tick=(now:number)=>{const dt=Math.min(now-last,100);last=now;setElapsed(t=>t+dt);frame=requestAnimationFrame(tick);};
    frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
  },[mode,running,reduced,visible]);
  const peak=peakFromQuality(score/100), tier=tierFromQuality(score/100), t=elapsed%9000;
  const phase=t<3000?'Opening':t<4500?'Holding open':t<7500?'Closing':'Holding closed';
  const fraction=t<3000?smoothstep(t/3000):t<4500?1:t<7500?1-smoothstep((t-4500)/3000):0;
  const angle=mode==='hold'?peak:reduced?150:5+145*fraction;
  const color=TIER_COLOR[tier];
  const x=46+score*3.1, y=190-(peak-5);
  return <figure className="figure ambient-mapping">
    <div ref={host} className="ambient-analysis" style={{'--ambient-light':color} as React.CSSProperties}>
      <header><span className="mono">FORECAST → OPENING</span><h3>A wider response to everyday scores</h3></header>
      <label className="ambient-slider">Explore a score <output>{score}<small> / 100</small></output><input aria-label="Forecast score" type="range" min="0" max="100" value={score} onChange={e=>setScore(Number(e.target.value))}/></label>
      <div className="ambient-plot-row">
        <svg className="ambient-curve" viewBox="0 0 380 238" role="img" aria-label={`Hold mapping: score ${score} commands ${Math.round(peak)} degrees; full opening from score 60.`}>
          {[5,85,165].map(a=><g key={a}><line x1="46" y1={195-a} x2="356" y2={195-a} stroke="#ddd9d1"/><text x="2" y={199-a}>{a}°</text></g>)}
          {[0,20,40,60,80,100].map(s=><g key={s}><line x1={46+s*3.1} y1="30" x2={46+s*3.1} y2="190" stroke="#e7e4de"/><text x={46+s*3.1} y="211" textAnchor="middle">{s}</text></g>)}
          <path d="M46 190 L232 30 H356" fill="none" stroke="#4d6b5a" strokeWidth="3"/>
          <text x="240" y="18">60 → full opening</text>
          <line x1={x} y1={y} x2={x} y2="190" stroke="#6b6b64" strokeDasharray="3 4"/>
          <circle cx={x} cy={y} r="6" fill={color} stroke="#4b4b43"/>
          <text x="202" y="234" textAnchor="middle">Sunset quality score</text>
        </svg>
        <div className="ambient-flower-panel"><FlowerFigure className="ambient-flower" open={visualOpen(angle)} light={lightLevel(angle,mode==='hold'?peak:150,score/100)} tier={tier}/><p className="ambient-angle"><strong>{Math.round(angle)}°</strong><span>{mode==='hold'?'Hold target':reduced?'Breathe endpoint':phase}</span></p></div>
      </div>
      <div className="ambient-mode-buttons" aria-label="Illustration mode">
        <button aria-pressed={mode==='hold'} onClick={()=>setMode('hold')}>Hold · forecast</button>
        <button aria-pressed={mode==='breathe'} onClick={()=>{setMode('breathe');setElapsed(0);setRunning(true);}}>Breathe · motion</button>
        {mode==='breathe'&&!reduced&&<button onClick={()=>setRunning(!running)}>{running?'Pause animation':'Resume animation'}</button>}
      </div>
      <p className="ambient-explanation">{mode==='hold'?'Hold stays at the angle mapped from the score. Scores of 60 and above share the same maximum opening.':reduced?'Reduced motion: showing the 150° endpoint. Breathe normally cycles independently of the score.':'Breathe cycles from 5° to 150°, independently of the score. The curve above still shows the Hold mapping.'}</p>
      <ol className="ambient-phases">{['Open · 3 s','Hold · 1.5 s','Close · 3 s','Hold · 1.5 s'].map((label,i)=><li key={i} data-active={mode==='breathe'&&i===(t<3000?0:t<4500?1:t<7500?2:3)}>{label}</li>)}</ol>
      <div className="ambient-color-key">{(['yellow','orange','red'] as const).map((name,i)=><span key={name}><i style={{background:TIER_COLOR[name]}}/>{['0–32 · Yellow','33–66 · Orange','67–100 · Red'][i]}</span>)}</div>
    </div>
    <figcaption><span className="caption-pointer" aria-hidden="true">▲</span>Explore the command mapping. The initial 39 is the October 15 sample. Animation and screen colors illustrate the firmware; they are not sensor measurements.</figcaption>
  </figure>;
}

export function AmbientFrontend() {
  const poster=resolveAsset(useWeekDir(),'./images/frontend-preview.png');
  const frame=useRef<HTMLIFrameElement>(null),[height,setHeight]=useState(850);
  const url=`${import.meta.env.BASE_URL}demos/ambient-display/index.html`;
  useEffect(()=>{const resize=(e:MessageEvent)=>{if(e.origin===location.origin&&e.source===frame.current?.contentWindow&&e.data?.type==='ambient-preview-height'&&Number.isFinite(e.data.height))setHeight(Math.max(600,Math.min(2400,e.data.height)));};window.addEventListener('message',resize);return()=>window.removeEventListener('message',resize);},[]);
  return <figure className="figure ambient-frontend"><img className="ambient-print-preview" src={poster} alt="Ambient Display interface with the recorded 39/100 forecast and Hold selected"/><iframe ref={frame} src={url} title="Ambient Display frontend — historical sample preview" loading="lazy" style={{height}}/><figcaption><span className="caption-pointer" aria-hidden="true">▲</span>Full interface with the October 15 sample. Try Hold, Breathe and Stop.</figcaption><a className="ambient-open" href={url} target="_blank" rel="noreferrer">Open the interface ↗</a></figure>;
}

export function AmbientStudies({children}:{children:ReactNode}) {
  return <details className="ambient-studies"><summary>Earlier enclosure studies</summary>{children}</details>;
}
