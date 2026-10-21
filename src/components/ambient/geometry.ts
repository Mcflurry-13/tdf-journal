// Geometry of the illustrated flower, in millimetres.
//
// Petal outlines are measured from the printed parts:
//   upper sheet  four-petal-print-v4/upper_solid_0.38mm.stl    4 solid almond petals, tip 70 mm from centre
//   lower sheet  four-petal-print-v5/lower_round_hub_0.38mm.stl 4 framed petals at 45°, tip 112 mm: a thin stem,
//                then a pointed blade with a teardrop window that narrows toward the hub
// The pose follows the assembled flower (photo IMG_7590): the sheets rise from the round hub on the
// lid's centre support into an upright bud; the thin stems arch outward first, the blades stand up.
// Opening tilts every petal outward from that bud. This is a motion illustration, not a simulation
// of the servo linkage, and it is drawn from command angles, not measurements.

export type Vec2 = [number, number];
type Vec3 = [number, number, number];
type Table = Array<[number, number]>;

export const HUB_R = 10.5;

/** Linear interpolation in a [u, value] table. */
function lookup(table: Table, u: number): number {
  if (u <= table[0][0]) return table[0][1];
  for (let i = 1; i < table.length; i++) {
    const [u1, v1] = table[i];
    if (u <= u1) {
      const [u0, v0] = table[i - 1];
      return v0 + ((v1 - v0) * (u - u0)) / (u1 - u0);
    }
  }
  return table[table.length - 1][1];
}

// Half-widths along the petal axis (u = distance from the flower centre), from the STL top faces.
const UPPER_W: Table = [
  [10.5, 7.5], [12, 5.6], [15, 6.5], [18, 8.5], [21, 10.6], [24, 12.5], [27, 13.8], [30, 14.7], [33, 15.1],
  [36, 15.35], [39, 15.35], [42, 15.1], [45, 14.7], [48, 14.1], [51, 13.0], [54, 11.8], [57, 10.5], [60, 8.8],
  [63, 6.6], [66, 4.3], [69, 1.8], [70, 0],
];
const LOWER_W: Table = [
  [10.5, 6], [12, 3.6], [13.5, 3.0], [18, 3.05], [21, 3.15], [24, 3.3], [27, 3.5], [30, 3.75], [33, 4.15],
  [36, 4.6], [39, 5.2], [42, 6.05], [45, 7.25], [48, 9.15], [51, 11.7], [54, 14.2], [57, 16.15], [60, 17.35],
  [63, 17.85], [66, 18], [69, 17.9], [72, 17.65], [75, 17.2], [78, 16.45], [81, 15.65], [84, 14.7], [87, 13.65],
  [90, 12.75], [93, 11.5], [96, 10.1], [99, 8.9], [102, 7.35], [105, 5.35], [108, 3.6], [111, 1.8], [112, 0],
];
const LOWER_WINDOW: Table = [
  [45.5, 0], [46.5, 1.2], [48, 2.6], [51, 4.7], [54, 6.4], [57, 7.7], [60, 8.5], [63, 9.05], [66, 9.1],
  [69, 8.7], [71, 7.6], [72.5, 6.0], [73.6, 4.0], [74.3, 2.0], [74.6, 0],
];

interface Pose {
  /** Bend at the hub, degrees above horizontal. */
  root: number;
  /** Where the bend reaches the blade angle (u, mm). */
  knee: number;
  /** Blade angle, degrees above horizontal (90 = upright). */
  blade: number;
  /** Extra bend at the tip: + leans in, − flares out. */
  tip: number;
}

interface PetalSpec {
  id: string;
  layer: 'upper' | 'lower';
  azimuthDeg: number;
  length: number;
  width: Table;
  window?: Table;
  closed: Pose;
  open: Pose;
}

const LOWER_CLOSED: Pose = { root: 14, knee: 46, blade: 84, tip: 9 };
const LOWER_OPEN: Pose = { root: 4, knee: 46, blade: 30, tip: -6 };
const UPPER_CLOSED: Pose = { root: 46, knee: 20, blade: 82, tip: 8 };
const UPPER_OPEN: Pose = { root: 8, knee: 20, blade: 32, tip: -5 };

export const PETALS: PetalSpec[] = [
  ...[45, 135, 225, 315].map((a, i) => ({
    id: `lower-${i}`,
    layer: 'lower' as const,
    azimuthDeg: a,
    length: 112,
    width: LOWER_W,
    window: LOWER_WINDOW,
    closed: LOWER_CLOSED,
    open: LOWER_OPEN,
  })),
  ...[0, 90, 180, 270].map((a, i) => ({
    id: `upper-${i}`,
    layer: 'upper' as const,
    azimuthDeg: a,
    length: 70,
    width: UPPER_W,
    closed: UPPER_CLOSED,
    open: UPPER_OPEN,
  })),
];

export interface ViewOptions {
  /** Camera elevation above the lid plane, degrees (0 = level, 90 = straight down). */
  elevationDeg: number;
  /** Turns the flower on its hub, degrees. 30 puts a windowed petal nearly facing the viewer. */
  turnDeg: number;
}

export const DEFAULT_VIEW: ViewOptions = { elevationDeg: 17, turnDeg: 30 };

export interface PetalShape {
  id: string;
  layer: 'upper' | 'lower';
  /** Closed outline plus window (fill-rule evenodd), screen units. */
  fill: string;
  /** Flanks and tip, without the base edge hidden at the hub. */
  edge: string;
  windowEdge?: string;
  /** Highlight band along one flank. */
  sheen: string;
  base: Vec2;
  mid: Vec2;
  tip: Vec2;
  /** Lambert-like shade 0..1 at base, middle and tip of the visible face. */
  shade: [number, number, number];
  /** 1 when the inside of the bud faces the viewer (lit from within), 0 for the outside. */
  inner: number;
  /** Larger = nearer the viewer. */
  depth: number;
}

export interface FlowerShape {
  petals: PetalShape[];
  hub: { cx: number; cy: number; rx: number; ry: number; depth: number };
  /** Projected ellipse of a horizontal circle of radius r at height z. */
  ellipseAt: (r: number, z: number) => { cx: number; cy: number; rx: number; ry: number };
  /** Project a world point (x right, y away from the viewer, z up). */
  project: (x: number, y: number, z: number) => Vec2;
}

const DEG = Math.PI / 180;
const f = (n: number) => (Math.round(n * 100) / 100).toString();
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};
const norm = (v: Vec3): Vec3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

// Soft key light from the viewer's upper left.
const LIGHT = norm([-0.45, -0.55, 0.7]);

export function buildFlower(open: number, view: ViewOptions = DEFAULT_VIEW): FlowerShape {
  const e = Math.min(1, Math.max(0, open));
  const beta = view.elevationDeg * DEG;
  const sinB = Math.sin(beta);
  const cosB = Math.cos(beta);
  const project = (x: number, y: number, z: number): Vec2 => [x, -(y * sinB + z * cosB)];
  const toCamera: Vec3 = [0, -cosB, sinB];
  const depthOf = (y: number, z: number) => -y * cosB + z * sinB;

  const petals: PetalShape[] = PETALS.map((p) => {
    const pose: Pose = {
      root: lerp(p.closed.root, p.open.root, e),
      knee: lerp(p.closed.knee, p.open.knee, e),
      blade: lerp(p.closed.blade, p.open.blade, e),
      tip: lerp(p.closed.tip, p.open.tip, e),
    };
    const az = (p.azimuthDeg + view.turnDeg) * DEG;
    const d: Vec3 = [Math.cos(az), Math.sin(az), 0];
    const l: Vec3 = [-d[1], d[0], 0];

    // Centreline in the petal's vertical plane, marched in 0.5 mm steps.
    const step = 0.5;
    const n = Math.ceil((p.length - HUB_R) / step);
    const R: number[] = [HUB_R];
    const Z: number[] = [0];
    const TH: number[] = [pose.root * DEG];
    for (let i = 1; i <= n; i++) {
      const u = HUB_R + i * step;
      const k = smooth((u - HUB_R) / (pose.knee - HUB_R));
      const s = Math.max(0, (u - pose.knee) / (p.length - pose.knee));
      const th = (lerp(pose.root, pose.blade, k) + pose.tip * s * s) * DEG;
      R.push(R[i - 1] + Math.cos(th) * step);
      Z.push(Z[i - 1] + Math.sin(th) * step);
      TH.push(th);
    }
    const at = (u: number) => {
      const x = Math.min(n, Math.max(0, (u - HUB_R) / step));
      const i = Math.floor(x);
      const j = Math.min(n, i + 1);
      const t = x - i;
      return { r: lerp(R[i], R[j], t), z: lerp(Z[i], Z[j], t), th: lerp(TH[i], TH[j], t) };
    };

    // A thin sheet cups very slightly across its width.
    const cup = 0.0035;
    const world = (u: number, v: number): Vec3 => {
      const c = at(u);
      const off = cup * v * v;
      const rr = c.r - Math.sin(c.th) * off;
      const zz = c.z + Math.cos(c.th) * off;
      return [d[0] * rr + l[0] * v, d[1] * rr + l[1] * v, zz];
    };
    const screen = (u: number, v: number): Vec2 => {
      const w = world(u, v);
      return project(w[0], w[1], w[2]);
    };
    const toPath = (pts: Vec2[], close: boolean) =>
      pts.map((q, k) => `${k === 0 ? 'M' : 'L'}${f(q[0])} ${f(q[1])}`).join('') + (close ? 'Z' : '');

    const us: number[] = [];
    for (let u = HUB_R; u < p.length; u += 1.25) us.push(u);
    us.push(p.length);
    const left = us.map((u) => screen(u, lookup(p.width, u)));
    const right = us.map((u) => screen(u, -lookup(p.width, u))).reverse();
    const outline = [...left, ...right];

    let fill = toPath(outline, true);
    let windowEdge: string | undefined;
    if (p.window) {
      const w0 = p.window[0][0];
      const w1 = p.window[p.window.length - 1][0];
      const wu: number[] = [];
      for (let u = w0; u < w1; u += 0.75) wu.push(u);
      wu.push(w1);
      const wl = wu.map((u) => screen(u, lookup(p.window!, u)));
      const wr = wu.map((u) => screen(u, -lookup(p.window!, u))).reverse();
      windowEdge = toPath([...wl, ...wr], true);
      fill += windowEdge;
    }

    // Sheen: a narrow band inside one flank of the blade.
    const bladeFrom = p.layer === 'lower' ? 76 : 24;
    const sa: Vec2[] = [];
    const sb: Vec2[] = [];
    for (let u = bladeFrom; u <= p.length - 6; u += 1.5) {
      const w = lookup(p.width, u);
      sa.push(screen(u, w * 0.78));
      sb.push(screen(u, w * 0.42));
    }
    const sheen = sa.length > 2 ? toPath([...sa, ...sb.reverse()], true) : '';

    // Surface normal at a point (the visible side), for shading and inside/outside.
    const normalAt = (u: number): { n: Vec3; inner: boolean } => {
      const th = at(u).th;
      // Upper face normal of the sheet: tilted back toward the flower axis as the petal rises.
      let nv: Vec3 = [-d[0] * Math.sin(th), -d[1] * Math.sin(th), Math.cos(th)];
      const inner = dot(nv, toCamera) > 0;
      if (!inner) nv = [-nv[0], -nv[1], -nv[2]];
      return { n: nv, inner };
    };
    const shadeAt = (u: number) => {
      const { n: nv } = normalAt(u);
      return Math.min(1, Math.max(0, 0.62 + 0.38 * dot(nv, LIGHT)));
    };
    const midU = p.layer === 'lower' ? 66 : 38;
    const facingInner = normalAt(midU).inner;

    let depthSum = 0;
    for (let i = 0; i <= n; i += 4) depthSum += depthOf(d[1] * R[i], Z[i]);
    const depth = depthSum / (Math.floor(n / 4) + 1);

    const c0 = world(HUB_R, 0);
    const cm = world(midU, 0);
    const c1 = world(p.length, 0);

    return {
      id: p.id,
      layer: p.layer,
      fill,
      edge: toPath(outline.slice(1, outline.length - 1), false),
      windowEdge,
      sheen,
      base: project(...c0),
      mid: project(...cm),
      tip: project(...c1),
      shade: [shadeAt(HUB_R + 4), shadeAt(midU), shadeAt(p.length - 4)],
      inner: facingInner ? 1 : 0,
      depth,
    };
  });

  petals.sort((a, b) => a.depth - b.depth);

  const ellipseAt = (radius: number, z: number) => {
    const [cx, cy] = project(0, 0, z);
    return { cx, cy, rx: radius, ry: radius * sinB };
  };

  return { petals, hub: { ...ellipseAt(HUB_R, 0), depth: 0 }, ellipseAt, project };
}
