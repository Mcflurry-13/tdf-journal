import { Children, cloneElement, isValidElement, useLayoutEffect, useRef, useState, type CSSProperties, type ReactElement, type ReactNode } from 'react';
import sizes from 'virtual:image-metadata';
import { justifiedRows } from '../gallery-layout.mjs';
import { resolveAsset } from '../content';
import { useWeekDir } from '../week-context';
import type { FigureKind } from '../types';

type Size = { width: number; height: number };
export interface FigureProps {
  src?: string; kind?: FigureKind; caption?: string; alt?: string; label?: string;
  wide?: boolean; focus?: string; ratio?: string;
  /** Internal gallery layout, never written in MDX. */
  cell?: 'justified' | 'grid'; onSize?: (size: Size) => void;
}
export function imageDimensions(dir: string, src?: string): Size | undefined {
  return src ? sizes[`${dir}/${src.replace(/^\.\//, '')}`] : undefined;
}
export function Figure({ src, kind='photo', caption, alt, label, wide, focus='50% 50%', cell, onSize }: FigureProps) {
  const dir = useWeekDir(), url = resolveAsset(dir, src);
  const [natural, setNatural] = useState<Size>();
  const size = imageDimensions(dir, src) ?? natural;
  const style: CSSProperties = !cell && size ? { maxWidth: Math.min(size.width/size.height*480, size.width) } : {};
  return <figure className={`figure${cell === 'grid' ? ' figure-crop' : ''}`} style={style} data-wide={wide || undefined}>
    {url ? <a href={url} target="_blank" rel="noreferrer" aria-label="Open full-size image" className="figure-image-link">
      <img src={url} width={size?.width} height={size?.height} alt={alt ?? caption ?? ''} loading="lazy"
        style={cell === 'grid' ? {objectPosition:focus} : size ? {aspectRatio:`${size.width} / ${size.height}`} : undefined}
        onLoad={e => { if (!size) { const next = {width:e.currentTarget.naturalWidth,height:e.currentTarget.naturalHeight}; setNatural(next); onSize?.(next); } }} />
    </a> : <div className="placeholder">{src ? `Image not found: ${src}` : '[Image]'}</div>}
    <figcaption>{label && <span className="figure-label mono">{label} · </span>}<span className="kind">{kind.toUpperCase()}</span>{caption}</figcaption>
  </figure>;
}
interface GalleryProps { children?:ReactNode; layout?:'justified'|'grid'; cols?:2|3; pair?:boolean; }
interface Row { start:number; count:number; height:number; ratios:number; }
export function Gallery({ children, layout='justified', cols=2, pair=false }:GalleryProps) {
  const dir = useWeekDir();
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<FigureProps>[];
  const host = useRef<HTMLDivElement>(null);
  const [width,setWidth] = useState(0), [mobile,setMobile] = useState(false);
  const [fallback,setFallback] = useState<Record<string,Size>>({});
  useLayoutEffect(() => {
    const node = host.current; if (!node) return;
    const query = matchMedia('(max-width: 639px)');
    const measure = () => {setWidth(node.getBoundingClientRect().width);setMobile(query.matches);};
    measure(); const observer = new ResizeObserver(measure); observer.observe(node);query.addEventListener('change',measure);
    return () => {observer.disconnect();query.removeEventListener('change',measure);};
  },[]);
  const info = items.map(el => {const s = imageDimensions(dir,el.props.src) ?? fallback[el.props.src ?? '']; return {ratio:s ? s.width/s.height : 1,wide:el.props.wide};});
  let rows:Row[];
  if (layout === 'grid') {
    rows=[]; const max = mobile ? Math.min(cols,2) : cols;
    for(let i=0;i<items.length;) {let n=1; if(!info[i].wide) while(n<max && i+n<items.length && !info[i+n].wide) n++; rows.push({start:i,count:n,height:0,ratios:n});i+=n;}
  } else rows = justifiedRows(info,width || 888,mobile,pair);
  return <div ref={host} className={`gallery gallery-${layout}${pair?' before-after':''}`}>
    {rows.map(row => {
      const members = items.slice(row.start,row.start+row.count);
      const ratios = info.slice(row.start,row.start+row.count);
      const rowStyle:CSSProperties = {gridTemplateColumns:ratios.map(item=>`minmax(0, ${layout==='grid'?1:item.ratio/row.ratios*100}fr)`).join(' ')};
      if(row.count === 1 && layout === 'justified') rowStyle.maxWidth = `${ratios[0].ratio*480}px`;
      return <div className="gallery-row" key={members[0].key ?? row.start} style={rowStyle}>
        {members.map(el => cloneElement(el,{cell:layout, onSize:size=>setFallback(old=>({...old,[el.props.src ?? '']:size}))}))}
      </div>;
    })}
  </div>;
}
export const FigurePair = Gallery;
export const ImageGallery = Gallery;
export function BeforeAfter({children}:{children?:ReactNode}) {
  return <Gallery pair>{Children.toArray(children).filter(isValidElement).map((child,i)=>{
    const el=child as ReactElement<FigureProps>; return cloneElement(el,{label:el.props.label ?? ['BEFORE','AFTER'][i]});
  })}</Gallery>;
}
