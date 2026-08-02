import { useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ButtonId, useDeckStore } from "../store/deckStore";
import { MESH_NAME_MAP } from "./useDeckInteractions";

const MESH_BY_BUTTON = Object.fromEntries(
  Object.entries(MESH_NAME_MAP).map(([mesh, id]) => [id, mesh])
) as Record<ButtonId, string>;

/** L/R bumpers and triggers — no press animation */
const SKIP_BUTTONS = new Set<ButtonId>(["L1", "R1", "L2", "R2"]);

const PRESS_LERP = 0.35;

type MeshRest = {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  pressDepth: number;
};

const _offset = new THREE.Vector3();

function captureMeshRest(mesh: THREE.Mesh): MeshRest {
  mesh.geometry.computeBoundingBox();
  const bb = mesh.geometry.boundingBox!;
  const depth = Math.max(bb.max.z - bb.min.z, 0.001);

  return {
    position: mesh.position.clone(),
    quaternion: mesh.quaternion.clone(),
    pressDepth: depth * 0.1,
  };
}

function applyInwardPress(mesh: THREE.Mesh, rest: MeshRest, amount: number) {
  mesh.quaternion.copy(rest.quaternion);
  _offset.set(0, 0, -rest.pressDepth * amount);
  _offset.applyQuaternion(rest.quaternion);
  mesh.position.copy(rest.position).add(_offset);
}

type GltfNodes = Record<string, THREE.Mesh>;

/**
 * Physical button feedback driven by deckStore.pressedButtons.
 * Face/menu buttons: inward press. Power: emissive glow. L1/R1/L2/R2 and D-pad skipped.
 */
export function useDeckButtonVisuals(nodes: GltfNodes) {
  const restByButton = useRef<Partial<Record<ButtonId, MeshRest>>>({});
  const restByTrackpad = useRef<Partial<Record<"L" | "R", MeshRest>>>({});
  const pressAmount = useRef<Partial<Record<ButtonId, number>>>({});
  const trackpadPress = useRef({ L: 0, R: 0 });
  const powerMaterial = useRef<THREE.MeshStandardMaterial | null>(null);

  useLayoutEffect(() => {
    (Object.keys(MESH_BY_BUTTON) as ButtonId[]).forEach((id) => {
      if (SKIP_BUTTONS.has(id)) return;
      const mesh = nodes[MESH_BY_BUTTON[id]];
      if (!mesh) return;
      restByButton.current[id] = captureMeshRest(mesh);
      pressAmount.current[id] = 0;
    });

    (["L", "R"] as const).forEach((side) => {
      const mesh = nodes[`Trackpad_${side}`];
      if (!mesh) return;
      restByTrackpad.current[side] = captureMeshRest(mesh);
    });

    const powerMesh = nodes.Btn_Power;
    if (powerMesh?.material && !Array.isArray(powerMesh.material)) {
      const cloned = (powerMesh.material as THREE.MeshStandardMaterial).clone();
      powerMesh.material = cloned;
      powerMaterial.current = cloned;
    }
  }, [nodes]);

  useFrame(() => {
    const { pressedButtons, poweredOn, trackpadLActive, trackpadRActive } = useDeckStore.getState();

    (Object.keys(MESH_BY_BUTTON) as ButtonId[]).forEach((id) => {
      if (SKIP_BUTTONS.has(id)) return;

      const mesh = nodes[MESH_BY_BUTTON[id]];
      const rest = restByButton.current[id];
      if (!mesh || !rest) return;

      const target = pressedButtons.has(id) ? 1 : 0;
      const cur = pressAmount.current[id] ?? 0;
      const next = THREE.MathUtils.lerp(cur, target, PRESS_LERP);
      pressAmount.current[id] = next;
      applyInwardPress(mesh, rest, next);
    });

    (["L", "R"] as const).forEach((side) => {
      const mesh = nodes[`Trackpad_${side}`];
      const rest = restByTrackpad.current[side];
      if (!mesh || !rest) return;

      const active = side === "L" ? trackpadLActive : trackpadRActive;
      const target = active ? 1 : 0;
      const cur = trackpadPress.current[side];
      const next = THREE.MathUtils.lerp(cur, target, PRESS_LERP);
      trackpadPress.current[side] = next;
      applyInwardPress(mesh, rest, next * 0.6);
    });

    const mat = powerMaterial.current;
    if (mat) {
      const powerPressed = pressedButtons.has("Power");
      if (poweredOn) {
        mat.emissive.setRGB(0.08, 0.85, 0.18);
        mat.emissiveIntensity = powerPressed ? 0.7 : 0.38;
      } else {
        mat.emissive.setRGB(powerPressed ? 0.35 : 0, powerPressed ? 0.12 : 0, 0);
        mat.emissiveIntensity = powerPressed ? 0.22 : 0;
      }
    }
  });
}
