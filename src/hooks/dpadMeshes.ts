import { DpadDirection } from "../store/deckStore";

export const DPAD_MESH_BY_DIRECTION: Record<DpadDirection, string> = {
  up: "D_Pad_Up",
  down: "D_Pad_Down",
  left: "D_Pad_Left",
  right: "D_Pad_Right",
};

export const DPAD_DIRECTION_BY_MESH: Record<string, DpadDirection> = {
  D_Pad_Up: "up",
  D_Pad_Down: "down",
  D_Pad_Left: "left",
  D_Pad_Right: "right",
};

export const DPAD_MESH_NAMES = Object.values(DPAD_MESH_BY_DIRECTION);

export function isDpadMeshName(name: string): boolean {
  return name === "D_Pad" || name in DPAD_DIRECTION_BY_MESH;
}

export function dpadDirectionFromMeshName(name: string): DpadDirection | null {
  return DPAD_DIRECTION_BY_MESH[name] ?? null;
}
