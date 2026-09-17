export type FocusPoint = {
  x: number;
  y: number;
};

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
  c1: { x: 0.435, y: 0.505 },
  c2: { x: 0.645, y: 0.5 },
  c3: { x: 0.385, y: 0.515 },
  c4: { x: 0.575, y: 0.5 },
  c5: { x: 0.45, y: 0.5 },
  c6: { x: 0.655, y: 0.495 },
  overhead: { x: 0.5, y: 0.42 },
} satisfies Record<string, FocusPoint>;

export const preloadImages = [
  plates.wide,
  plates.close,
  plates.top,
  plates.final,
];
