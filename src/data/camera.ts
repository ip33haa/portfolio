import {
  focus,
  plates,
  sequenceFrame,
  SEQUENCE_BEGINNING_FROM,
  SEQUENCE_BEGINNING_UNTIL,
  SEQUENCE_COUNT,
  SEQUENCE_CRYSTAL1_FROM,
  SEQUENCE_CRYSTAL1_UNTIL,
  SEQUENCE_CRYSTAL2_FROM,
  SEQUENCE_CRYSTAL2_UNTIL,
  SEQUENCE_CRYSTAL3_FROM,
  SEQUENCE_CRYSTAL3_UNTIL,
  SEQUENCE_CRYSTAL4_FROM,
  SEQUENCE_CRYSTAL4_UNTIL,
  SEQUENCE_CRYSTAL5_FROM,
  SEQUENCE_CRYSTAL5_UNTIL,
  SEQUENCE_CRYSTAL6_FROM,
  SEQUENCE_CRYSTAL6_UNTIL,
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
  { at: SEQUENCE_UNTIL, plate: sequenceFrame(SEQUENCE_COUNT - 1), origin: focus.c6, scale: 1, x: 0, y: 0, rotate: 0, blur: 0, flash: 0, glow: 1, sceneIndex: 7 },
  { at: 0.88, plate: plates.top, origin: focus.overhead, scale: 1.12, x: 0, y: 0, rotate: 2, blur: 0.3, flash: 0, glow: 0.7, sceneIndex: 8 },
  { at: 0.94, plate: plates.final, origin: focus.wide, scale: 1.08, x: 0, y: 0, rotate: 1, blur: 0, flash: 0, glow: 0.55, sceneIndex: 9 },
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

    let sceneIndex = 0;
    let textVisible = false;

    if (frame <= SEQUENCE_WELCOME_UNTIL) {
      sceneIndex = 0;
      textVisible = frame <= SEQUENCE_WELCOME_UNTIL;
    } else if (frame < SEQUENCE_CRYSTAL1_FROM) {
      sceneIndex = 1;
      textVisible = frame >= SEQUENCE_BEGINNING_FROM && frame <= SEQUENCE_BEGINNING_UNTIL;
    } else if (frame < SEQUENCE_CRYSTAL2_FROM) {
      sceneIndex = 2;
      textVisible = frame >= SEQUENCE_CRYSTAL1_FROM && frame <= SEQUENCE_CRYSTAL1_UNTIL;
    } else if (frame < SEQUENCE_CRYSTAL3_FROM) {
      sceneIndex = 3;
      textVisible = frame >= SEQUENCE_CRYSTAL2_FROM && frame <= SEQUENCE_CRYSTAL2_UNTIL;
    } else if (frame < SEQUENCE_CRYSTAL4_FROM) {
      sceneIndex = 4;
      textVisible = frame >= SEQUENCE_CRYSTAL3_FROM && frame <= SEQUENCE_CRYSTAL3_UNTIL;
    } else if (frame < SEQUENCE_CRYSTAL5_FROM) {
      sceneIndex = 5;
      textVisible = frame >= SEQUENCE_CRYSTAL4_FROM && frame <= SEQUENCE_CRYSTAL4_UNTIL;
    } else if (frame < SEQUENCE_CRYSTAL6_FROM) {
      sceneIndex = 6;
      textVisible = frame >= SEQUENCE_CRYSTAL5_FROM && frame <= SEQUENCE_CRYSTAL5_UNTIL;
    } else {
      sceneIndex = 7;
      textVisible = frame >= SEQUENCE_CRYSTAL6_FROM && frame <= SEQUENCE_CRYSTAL6_UNTIL;
    }

    return {
      plate: sequenceFrame(idx),
      origin: { x: 0.5, y: 0.5 },
      scale: 1,
      x: 0,
      y: 0,
      rotate: 0,
      blur: 0,
      flash: 0,
      glow: sceneIndex >= 2 ? 0.85 : 0.22 + t * 0.18,
      sceneIndex,
      sequenced: true,
      textVisible,
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

export const cinematicLengthVh = 2200;

function progressAtFrame(frame: number) {
  return ((frame - 1) / (SEQUENCE_COUNT - 1)) * SEQUENCE_UNTIL;
}

export const sceneScrollAt = [
  0,
  progressAtFrame(SEQUENCE_BEGINNING_FROM + 5),
  progressAtFrame(SEQUENCE_CRYSTAL1_FROM + 9),
  progressAtFrame(SEQUENCE_CRYSTAL2_FROM + 13),
  progressAtFrame(SEQUENCE_CRYSTAL3_FROM + 20),
  progressAtFrame(SEQUENCE_CRYSTAL4_FROM + 14),
  progressAtFrame(SEQUENCE_CRYSTAL5_FROM + 11),
  progressAtFrame(SEQUENCE_CRYSTAL6_FROM + 8),
  0.88,
  0.95,
];
