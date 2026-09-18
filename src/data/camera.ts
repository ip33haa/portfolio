import {
  focus,
  plates,
  sequenceFrame,
  SEQUENCE_BEGINNING_FROM,
  SEQUENCE_BEGINNING_UNTIL,
  SEQUENCE_COUNT,
  SEQUENCE_CRYSTAL1_FROM,
  SEQUENCE_CRYSTAL1_UNTIL,
  SEQUENCE_UNTIL,
  SEQUENCE_WELCOME_UNTIL,
} from "./assets";
import type { FocusPoint } from "./assets";

export type CameraState = {
  plate: string;
  origin: FocusPoint;
  scale: number;
  x: number;
  y: number;
  rotate: number;
  blur: number;
  flash: number;
  glow: number;
  sceneIndex: number;
  sequenced: boolean;
  textVisible: boolean;
};

type Keyframe = {
  at: number;
  plate: string;
  origin: FocusPoint;
  scale: number;
  x: number;
  y: number;
  rotate: number;
  blur: number;
  flash: number;
  glow: number;
  sceneIndex: number;
};

const frames: Keyframe[] = [
  { at: SEQUENCE_UNTIL, plate: sequenceFrame(SEQUENCE_COUNT - 1), origin: focus.c1, scale: 1, x: 0, y: 0, rotate: 0, blur: 0, flash: 0, glow: 0.85, sceneIndex: 2 },
  { at: 0.36, plate: plates.crystals[2], origin: focus.c2, scale: 2.45, x: 4, y: 3, rotate: 0.6, blur: 1.5, flash: 0, glow: 0.9, sceneIndex: 3 },
  { at: 0.46, plate: plates.crystals[3], origin: focus.c3, scale: 2.4, x: -5, y: 3, rotate: -0.8, blur: 1.4, flash: 0, glow: 0.9, sceneIndex: 4 },
  { at: 0.56, plate: plates.crystals[4], origin: focus.c4, scale: 2.55, x: 3, y: 6, rotate: 0.5, blur: 1.3, flash: 0, glow: 1, sceneIndex: 5 },
  { at: 0.66, plate: plates.crystals[5], origin: focus.c5, scale: 2.5, x: -3, y: 2, rotate: 0.2, blur: 1.5, flash: 0, glow: 1, sceneIndex: 6 },
  { at: 0.72, plate: plates.crystals[6], origin: focus.c6, scale: 3.2, x: 6, y: 2, rotate: 0.4, blur: 0.6, flash: 0.15, glow: 1, sceneIndex: 7 },
  { at: 0.78, plate: plates.crystals[6], origin: focus.c6, scale: 3.8, x: 8, y: 1, rotate: 0.2, blur: 0, flash: 1, glow: 1, sceneIndex: 7 },
  { at: 0.84, plate: plates.top, origin: focus.overhead, scale: 1.12, x: 0, y: 0, rotate: 4, blur: 0.3, flash: 0, glow: 0.7, sceneIndex: 8 },
  { at: 0.92, plate: plates.final, origin: focus.wide, scale: 1.08, x: 0, y: 0, rotate: 1.5, blur: 0, flash: 0, glow: 0.55, sceneIndex: 9 },
  { at: 1, plate: plates.final, origin: focus.wide, scale: 1.04, x: 0, y: 0, rotate: 0, blur: 0, flash: 0, glow: 0.4, sceneIndex: 9 },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpPoint(a: FocusPoint, b: FocusPoint, t: number): FocusPoint {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function cameraAt(progress: number): CameraState {
  const p = Math.min(1, Math.max(0, progress));

  if (p <= SEQUENCE_UNTIL) {
    const t = p / SEQUENCE_UNTIL;
    const idx = Math.min(SEQUENCE_COUNT - 1, Math.round(t * (SEQUENCE_COUNT - 1)));
    const frame = idx + 1;
    const caption =
      frame <= SEQUENCE_WELCOME_UNTIL
        ? 0
        : frame >= SEQUENCE_BEGINNING_FROM && frame <= SEQUENCE_BEGINNING_UNTIL
          ? 1
          : frame >= SEQUENCE_CRYSTAL1_FROM && frame <= SEQUENCE_CRYSTAL1_UNTIL
            ? 2
            : null;
    const sceneIndex =
      caption ??
      (frame < SEQUENCE_BEGINNING_FROM ? 0 : frame < SEQUENCE_CRYSTAL1_FROM ? 1 : 2);
    return {
      plate: sequenceFrame(idx),
      origin: { x: 0.5, y: 0.5 },
      scale: 1,
      x: 0,
      y: 0,
      rotate: 0,
      blur: 0,
      flash: 0,
      glow: frame >= SEQUENCE_CRYSTAL1_FROM ? 0.85 : 0.22 + t * 0.18,
      sceneIndex,
      sequenced: true,
      textVisible: caption !== null,
    };
  }

  let i = 0;
  while (i < frames.length - 1 && frames[i + 1].at < p) i += 1;
  const a = frames[i];
  const b = frames[Math.min(i + 1, frames.length - 1)];
  const span = b.at - a.at || 1;
  const t = easeInOut((p - a.at) / span);

  return {
    plate: t < 0.5 ? a.plate : b.plate,
    origin: lerpPoint(a.origin, b.origin, t),
    scale: lerp(a.scale, b.scale, t),
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    rotate: lerp(a.rotate, b.rotate, t),
    blur: lerp(a.blur, b.blur, t),
    flash: lerp(a.flash, b.flash, t),
    glow: lerp(a.glow, b.glow, t),
    sceneIndex: t < 0.45 ? a.sceneIndex : b.sceneIndex,
    sequenced: false,
    textVisible: true,
  };
}

export const cinematicLengthVh = 1100;

function progressAtFrame(frame: number) {
  return ((frame - 1) / (SEQUENCE_COUNT - 1)) * SEQUENCE_UNTIL;
}

export const sceneScrollAt = [
  0,
  progressAtFrame(SEQUENCE_BEGINNING_FROM),
  progressAtFrame(SEQUENCE_CRYSTAL1_FROM),
  0.32,
  0.42,
  0.52,
  0.62,
  0.7,
  0.84,
  0.92,
];
