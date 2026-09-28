export type FocusPoint = {
  x: number;
  y: number;
};

export const SEQUENCE_COUNT = 420;
export const SEQUENCE_UNTIL = 0.82;
export const SEQUENCE_WELCOME_UNTIL = 45;
export const SEQUENCE_BEGINNING_FROM = 86;
export const SEQUENCE_BEGINNING_UNTIL = 105;
export const SEQUENCE_CRYSTAL1_FROM = 126;
export const SEQUENCE_CRYSTAL1_UNTIL = 149;
export const SEQUENCE_CRYSTAL2_FROM = 172;
export const SEQUENCE_CRYSTAL2_UNTIL = 195;
export const SEQUENCE_CRYSTAL3_FROM = 220;
export const SEQUENCE_CRYSTAL3_UNTIL = 265;
export const SEQUENCE_CRYSTAL4_FROM = 291;
export const SEQUENCE_CRYSTAL4_UNTIL = 316;
export const SEQUENCE_CRYSTAL5_FROM = 344;
export const SEQUENCE_CRYSTAL5_UNTIL = 369;
export const SEQUENCE_CRYSTAL6_FROM = 397;
export const SEQUENCE_CRYSTAL6_UNTIL = 420;

export function sequenceFrame(index: number) {
  const n = String(Math.min(SEQUENCE_COUNT, Math.max(1, index + 1))).padStart(4, "0");
  return `/images/journey/frame_${n}.webp`;
}

export const MAGIC_COUNT = 220;
export const MAGIC_CV_FROM = 205;

export function magicFrame(index: number) {
  const n = String(Math.min(MAGIC_COUNT, Math.max(1, index + 1))).padStart(4, "0");
  return `/images/magic/frame_${n}.png`;
}

export const plates = {
  wide: "/images/dome-wide.webp",
  close: "/images/tree-close.webp",
  top: "/images/dome-top.webp",
  final: "/images/dome-final.webp",
  crystals: {
    1: "/images/crystal-01.webp",
    2: "/images/crystal-02.webp",
    3: "/images/crystal-03.webp",
    4: "/images/crystal-04.webp",
    5: "/images/crystal-05-tipon.webp",
    6: "/images/crystal-06.webp",
  },
} as const;

export const focus = {
  wide: { x: 0.5, y: 0.46 },
  tree: { x: 0.5, y: 0.4 },
  c1: { x: 0.77, y: 0.46 },
  c2: { x: 0.77, y: 0.46 },
  c3: { x: 0.77, y: 0.46 },
  c4: { x: 0.77, y: 0.46 },
  c5: { x: 0.77, y: 0.46 },
  c6: { x: 0.77, y: 0.46 },
  overhead: { x: 0.5, y: 0.42 },
} satisfies Record<string, FocusPoint>;

export const preloadImages = [
  sequenceFrame(0),
  sequenceFrame(39),
  sequenceFrame(99),
  sequenceFrame(134),
  sequenceFrame(184),
  sequenceFrame(239),
  sequenceFrame(304),
  sequenceFrame(354),
  sequenceFrame(404),
  sequenceFrame(SEQUENCE_COUNT - 1),
  plates.wide,
  plates.close,
  plates.top,
  plates.final,
  plates.crystals[1],
  plates.crystals[2],
  plates.crystals[3],
  plates.crystals[4],
  plates.crystals[5],
  plates.crystals[6],
  magicFrame(0),
  magicFrame(MAGIC_COUNT - 1),
];

export const sequenceImages = Array.from({ length: SEQUENCE_COUNT }, (_, i) => sequenceFrame(i));
export const magicImages = Array.from({ length: MAGIC_COUNT }, (_, i) => magicFrame(i));
