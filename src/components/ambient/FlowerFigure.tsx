import { useId, useMemo } from 'react';
import type { LightTier } from './mapping';
import { buildFlower, DEFAULT_VIEW, type PetalShape } from './geometry';

// Light colours per firmware tier. The firmware mixes only red and green
// (green weight 255 / 80 / 0); these are softened for the screen.
export const TIER_COLOR: Record<LightTier, string> = {
  yellow: '#F2C14E',
  orange: '#EF8A45',
  red: '#E05A42',
};

const PLINTH_R = 99.5; // Ø199 cylinder
const WINDOW_R = 68; // Ø136 paper window over the light strips
const LID_Z = -3; // lid surface, just under the hub
const VIEW_BOX = '-100 -112 200 200';
const BOTTOM = 90;

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mix(a: string, b: string, t: number): string {
  const ca = hexToRgb(a.startsWith('#') ? a : '#000000');
  const cb = hexToRgb(b);
  const k = Math.min(1, Math.max(0, t));
  const c = ca.map((v, i) => Math.round(v + (cb[i] - v) * k));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

export interface FlowerFigureProps {
  /** Visual openness, 0 closed bud … 1 fully open = (angle − 5) / 160. */
  open: number;
  /** Glow, 0 off … 1 brightest. */
  light: number;
  tier: LightTier;
  /** "ghost" = no valid forecast: drawn as an outline, never as a closed score of 0. */
  variant?: 'normal' | 'ghost';
  className?: string;
}

export function FlowerFigure({ open, light, tier, variant = 'normal', className }: FlowerFigureProps) {
  const uid = useId().replace(/:/g, '');
  const shape = useMemo(() => buildFlower(open, DEFAULT_VIEW), [open]);
  const color = TIER_COLOR[tier];
  const ghost = variant === 'ghost';
  const L = ghost ? 0 : Math.min(1, Math.max(0, light));

  const lid = shape.ellipseAt(PLINTH_R, LID_Z);
  const win = shape.ellipseAt(WINDOW_R, LID_Z);
  const bloom = shape.project(0, 0, 34);
  const pedestal = `M${-PLINTH_R} ${lid.cy} A${lid.rx} ${lid.ry} 0 0 0 ${PLINTH_R} ${lid.cy} L${PLINTH_R} ${BOTTOM} L${-PLINTH_R} ${BOTTOM} Z`;

  const back = shape.petals.filter((p) => p.depth < shape.hub.depth);
  const front = shape.petals.filter((p) => p.depth >= shape.hub.depth);

  const petal = (p: PetalShape) => {
    if (ghost) {
      return (
        <g key={p.id}>
          <path d={p.fill} fillRule="evenodd" fill="rgba(255,255,255,0.28)" />
          <path d={p.edge} fill="none" stroke="rgba(70,84,80,0.5)" strokeWidth="0.6" strokeDasharray="2 1.6" />
          {p.windowEdge && (
            <path d={p.windowEdge} fill="none" stroke="rgba(70,84,80,0.42)" strokeWidth="0.55" strokeDasharray="2 1.6" />
          )}
        </g>
      );
    }
    return (
      <g key={p.id}>
        <path d={p.fill} fillRule="evenodd" fill={`url(#${uid}-${p.id})`} />
        {p.sheen && <path d={p.sheen} fill={`url(#${uid}-sheen)`} opacity={0.3 + 0.3 * p.shade[1]} />}
        <path d={p.edge} fill="none" stroke="rgba(52,68,63,0.4)" strokeWidth="0.75" strokeLinejoin="round" />
        <path d={p.edge} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="0.32" strokeLinejoin="round" />
        {p.windowEdge && (
          <>
            <path d={p.windowEdge} fill="none" stroke="rgba(52,68,63,0.34)" strokeWidth="0.7" />
            <path d={p.windowEdge} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="0.3" />
          </>
        )}
      </g>
    );
  };

  return (
    <div className={className} data-variant={variant} aria-hidden="true">
      {/* Pedestal: the Ø199 cylinder, its lid and the Ø136 paper window lit from below. */}
      <svg className="flower-layer" viewBox={VIEW_BOX} focusable="false">
        <defs>
          <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#DCE4E0" stopOpacity="0.75" />
            <stop offset="0.3" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="0.75" stopColor="#F6F8F5" stopOpacity="0.6" />
            <stop offset="1" stopColor="#D6DFDB" stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id={`${uid}-bodyFade`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="0.35" stopColor="#FFFFFF" stopOpacity="0.55" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <mask id={`${uid}-fade`} maskUnits="userSpaceOnUse" x="-110" y="-120" width="220" height="220">
            <rect x="-110" y={lid.cy - 2} width="220" height={BOTTOM - lid.cy + 2} fill={`url(#${uid}-bodyFade)`} />
          </mask>
          <radialGradient id={`${uid}-lid`} cx="42%" cy="35%" r="70%">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="1" stopColor="#E7EDE9" stopOpacity="0.85" />
          </radialGradient>
          <radialGradient id={`${uid}-paper`} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="1" stopColor="#EBEFEB" stopOpacity="1" />
          </radialGradient>
          <radialGradient id={`${uid}-glow`} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor={mix('#FFF6E6', color, 0.3)} stopOpacity="1" />
            <stop offset="0.45" stopColor={color} stopOpacity="0.75" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${uid}-contact`} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#30433D" stopOpacity="0.22" />
            <stop offset="1" stopColor="#30433D" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${uid}-bloom`} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor={mix('#FFF3E0', color, 0.45)} stopOpacity="0.9" />
            <stop offset="0.5" stopColor={color} stopOpacity="0.3" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>

        <g mask={`url(#${uid}-fade)`}>
          <path d={pedestal} fill={`url(#${uid}-body)`} />
          <path d={`M${-PLINTH_R} ${lid.cy} L${-PLINTH_R} ${BOTTOM}`} stroke="rgba(52,68,63,0.16)" strokeWidth="0.6" />
          <path d={`M${PLINTH_R} ${lid.cy} L${PLINTH_R} ${BOTTOM}`} stroke="rgba(52,68,63,0.16)" strokeWidth="0.6" />
        </g>
        <ellipse {...lid} fill={`url(#${uid}-lid)`} stroke="rgba(255,255,255,0.95)" strokeWidth="0.6" />
        <ellipse cx={lid.cx} cy={lid.cy + 0.9} rx={lid.rx} ry={lid.ry} fill="none" stroke="rgba(52,68,63,0.16)" strokeWidth="0.5" />
        <ellipse {...win} fill={`url(#${uid}-paper)`} stroke="rgba(52,68,63,0.16)" strokeWidth="0.5" />
        <ellipse cx={win.cx} cy={win.cy + 1} rx={44} ry={10} fill={`url(#${uid}-contact)`} opacity={1 - L} />
        <ellipse {...win} rx={win.rx * 1.1} ry={win.ry * 1.25} fill={`url(#${uid}-glow)`} opacity={L} />
        <ellipse cx={bloom[0]} cy={bloom[1]} rx={86} ry={78} fill={`url(#${uid}-bloom)`} opacity={L * 0.85} />
      </svg>

      {/* Petals. No SVG/CSS shadow filters here: they rasterise the hairline edges coarsely. */}
      <svg className="flower-layer flower-petals" viewBox={VIEW_BOX} focusable="false">
        <defs>
          <linearGradient id={`${uid}-sheen`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.85" />
          </linearGradient>
          <radialGradient id={`${uid}-hub`} cx="40%" cy="35%" r="70%">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="1" stopColor={mix('#DCE2DE', color, 0.4 * L)} stopOpacity="1" />
          </radialGradient>
          {shape.petals.map((p) => {
            const warm = (k: number) => L * k * (p.inner ? 1 : 0.55);
            const tone = (s: number) => mix('#AFBEB9', '#FFFFFF', s);
            return (
              <linearGradient
                key={p.id}
                id={`${uid}-${p.id}`}
                gradientUnits="userSpaceOnUse"
                x1={p.base[0]}
                y1={p.base[1]}
                x2={p.tip[0]}
                y2={p.tip[1]}
              >
                <stop offset="0" stopColor={mix(tone(p.shade[0]), color, warm(0.62))} stopOpacity={0.9} />
                <stop offset="0.55" stopColor={mix(tone(p.shade[1]), color, warm(0.3))} stopOpacity={0.82} />
                <stop offset="1" stopColor={mix(tone(p.shade[2]), color, warm(0.12))} stopOpacity={0.88} />
              </linearGradient>
            );
          })}
        </defs>
        {back.map(petal)}
        <ellipse
          {...shape.hub}
          fill={ghost ? 'rgba(255,255,255,0.3)' : `url(#${uid}-hub)`}
          stroke={ghost ? 'rgba(70,84,80,0.5)' : 'rgba(52,68,63,0.35)'}
          strokeWidth="0.55"
          strokeDasharray={ghost ? '2 1.6' : undefined}
        />
        {front.map(petal)}
      </svg>
    </div>
  );
}
