// Rubik's cube model shared by the build (initial scrambled render) and the browser (solve animation).

export type Axis = 'x' | 'y' | 'z';
export type Vec = [number, number, number];
export type Mat = number[]; // 3x3, row-major

export interface CubieState {
  pos: Vec;
  rot: Mat;
}

// Face turns in CSS space (y points down). `dir` is the sign of a clockwise quarter turn.
export const FACES = {
  R: { axis: 'x', layer: 1, dir: 1 },
  L: { axis: 'x', layer: -1, dir: -1 },
  U: { axis: 'y', layer: -1, dir: -1 },
  D: { axis: 'y', layer: 1, dir: 1 },
  F: { axis: 'z', layer: 1, dir: 1 },
  B: { axis: 'z', layer: -1, dir: -1 },
} as const;
export type Face = keyof typeof FACES;

export interface Move {
  face: Face;
  prime: boolean;
}

export const CUBIE_SIZE = 44;

export const STICKERS = [
  { transform: 'rotateY(90deg)', axis: 0, side: 1, color: '#ef4444' },
  { transform: 'rotateY(-90deg)', axis: 0, side: -1, color: '#f97316' },
  { transform: 'rotateX(90deg)', axis: 1, side: -1, color: '#f5f5f5' },
  { transform: 'rotateX(-90deg)', axis: 1, side: 1, color: '#facc15' },
  { transform: '', axis: 2, side: 1, color: '#22c55e' },
  { transform: 'rotateY(180deg)', axis: 2, side: -1, color: '#4f46e5' },
];

const AXIS_INDEX: Record<Axis, number> = { x: 0, y: 1, z: 2 };
const IDENTITY: Mat = [1, 0, 0, 0, 1, 0, 0, 0, 1];

export const HOME: Vec[] = [];
for (const x of [-1, 0, 1])
  for (const y of [-1, 0, 1])
    for (const z of [-1, 0, 1])
      if (x || y || z) HOME.push([x, y, z]);

// Same conventions as CSS rotateX/Y/Z, so a baked turn matches the animated one exactly.
const rotation = (axis: Axis, deg: number): Mat => {
  const c = Math.round(Math.cos((deg * Math.PI) / 180));
  const s = Math.round(Math.sin((deg * Math.PI) / 180));
  if (axis === 'x') return [1, 0, 0, 0, c, -s, 0, s, c];
  if (axis === 'y') return [c, 0, s, 0, 1, 0, -s, 0, c];
  return [c, -s, 0, s, c, 0, 0, 0, 1];
};

const multiply = (a: Mat, b: Mat): Mat =>
  [0, 1, 2].flatMap(r => [0, 1, 2].map(c => a[r * 3] * b[c] + a[r * 3 + 1] * b[3 + c] + a[r * 3 + 2] * b[6 + c]));

const apply = (m: Mat, v: Vec): Vec =>
  [0, 1, 2].map(r => m[r * 3] * v[0] + m[r * 3 + 1] * v[1] + m[r * 3 + 2] * v[2]) as Vec;

export const toCss = ({ pos, rot: m }: CubieState) =>
  `matrix3d(${m[0]},${m[3]},${m[6]},0,${m[1]},${m[4]},${m[7]},0,${m[2]},${m[5]},${m[8]},0,${pos[0] * CUBIE_SIZE},${pos[1] * CUBIE_SIZE},${pos[2] * CUBIE_SIZE},1)`;

export const turnAngle = (move: Move) => 90 * (move.prime ? -FACES[move.face].dir : FACES[move.face].dir);

export const inLayer = (cubie: CubieState, move: Move) =>
  cubie.pos[AXIS_INDEX[FACES[move.face].axis]] === FACES[move.face].layer;

export const bake = (cubies: CubieState[], move: Move) => {
  const m = rotation(FACES[move.face].axis, turnAngle(move));
  cubies.forEach(c => {
    if (!inLayer(c, move)) return;
    c.pos = apply(m, c.pos);
    c.rot = multiply(m, c.rot);
  });
};

export const scrambled = (scramble: Move[]): CubieState[] => {
  const cubies = HOME.map(pos => ({ pos, rot: IDENTITY }));
  scramble.forEach(m => bake(cubies, m));
  return cubies;
};

export const randomScramble = (length: number): Move[] => {
  const faces = Object.keys(FACES) as Face[];
  const moves: Move[] = [];
  while (moves.length < length) {
    const face = faces[Math.floor(Math.random() * faces.length)];
    const prev = moves[moves.length - 1];
    if (prev && FACES[prev.face].axis === FACES[face].axis) continue;
    moves.push({ face, prime: Math.random() < 0.5 });
  }
  return moves;
};

export const solve = (scramble: Move[]): Move[] =>
  [...scramble].reverse().map(m => ({ face: m.face, prime: !m.prime }));

export const notation = (move: Move) => `${move.face}${move.prime ? "'" : ''}`;
