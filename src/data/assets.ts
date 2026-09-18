export type FocusPoint = {
  x: number;
  y: number;
};

export const SEQUENCE_COUNT = 149;
export const SEQUENCE_UNTIL = 0.26;
export const SEQUENCE_WELCOME_UNTIL = 50;
export const SEQUENCE_BEGINNING_FROM = 80;
export const SEQUENCE_BEGINNING_UNTIL = 105;
export const SEQUENCE_CRYSTAL1_FROM = 120;
export const SEQUENCE_CRYSTAL1_UNTIL = 133;

export function sequenceFrame(index: number) {
  const n = String(Math.min(SEQUENCE_COUNT, Math.max(1, index + 1))).padStart(4, "0");
  return `/images/journey/frame_${n}.png`;
}

export const MAGIC_COUNT = 220;
export const MAGIC_CV_FROM = 205;

export function magicFrame(index: number) {
  const n = String(Math.min(MAGIC_COUNT, Math.max(1, index + 1))).padStart(4, "0");
  return `/images/magic/frame_${n}.png`;
}

export const plates = {
  wide: sequenceFrame(0),
  close: sequenceFrame(SEQUENCE_BEGINNING_UNTIL - 1),
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
  c1: { x: 0.435, y: 0.505 },
  c2: { x: 0.645, y: 0.5 },
  c3: { x: 0.385, y: 0.515 },
  c4: { x: 0.575, y: 0.5 },
  c5: { x: 0.45, y: 0.5 },
  c6: { x: 0.655, y: 0.495 },
  overhead: { x: 0.5, y: 0.42 },
} satisfies Record<string, FocusPoint>;

export const preloadImages = [
  sequenceFrame(0),
  sequenceFrame(12),
  sequenceFrame(26),
  sequenceFrame(40),
  sequenceFrame(SEQUENCE_BEGINNING_FROM - 1),
  sequenceFrame(SEQUENCE_CRYSTAL1_FROM - 1),
  sequenceFrame(SEQUENCE_COUNT - 1),
  plates.top,
  plates.final,
  magicFrame(0),
  magicFrame(MAGIC_COUNT - 1),
];

export const sequenceImages = Array.from({ length: SEQUENCE_COUNT }, (_, i) => sequenceFrame(i));
export const magicImages = Array.from({ length: MAGIC_COUNT }, (_, i) => magicFrame(i));
