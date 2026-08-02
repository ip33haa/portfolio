import * as THREE from "three";

/** Steam Deck display aspect (16:10) — matches ScreenOverlay inner div */
export const SCREEN_HTML_SIZE = { width: 1280, height: 800 } as const;

export type ScreenHtmlConfig = {
  distanceFactor: number;
  position: [number, number, number];
  rotation: [number, number, number];
};

/**
 * Fit drei's Html (transform mode) to the Screen mesh face.
 * World width ≈ htmlPx * (distanceFactor / 400).
 */
export function getScreenHtmlConfig(screen: THREE.Mesh): ScreenHtmlConfig {
  screen.geometry.computeBoundingBox();
  const bb = screen.geometry.boundingBox!;
  const meshWidth = bb.max.x - bb.min.x;
  const meshDepth = bb.max.z - bb.min.z;

  const distanceFactor = (meshWidth * 400) / SCREEN_HTML_SIZE.width;
  const zPad = Math.max(meshDepth * 0.12, 0.02);

  return {
    distanceFactor,
    position: [0, 0, bb.max.z + zPad],
    rotation: [0, 0, 0],
  };
}
