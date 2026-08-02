import { useEffect, useLayoutEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useDeckStore, ButtonId, DpadDirection } from "../store/deckStore";
import { primeBootAudioFromUserGesture } from "../utils/bootAudio";
import { dpadDirectionFromMeshName, isDpadMeshName } from "./dpadMeshes";
import { MENU_ITEMS } from "../data/menuItems";

export const MESH_NAME_MAP: Record<string, ButtonId> = {
  Btn_A: "A",
  Btn_B: "B",
  Btn_X: "X",
  Btn_Y: "Y",
  Btn_L1: "L1",
  Btn_R1: "R1",
  Btn_L2: "L2",
  Btn_R2: "R2",
  Btn_Power: "Power",
  Btn_Menu: "Menu",
  Btn_QuickAccess: "QuickAccess",
};

const CLICK_THRESHOLD_PX = 10;
const JOYSTICK_TILT = THREE.MathUtils.degToRad(14);
const JOYSTICK_DRAG_SENS = { L: 0.008, R: 0.012 } as const;

type JoystickRest = {
  quaternion: THREE.Quaternion;
  position: THREE.Vector3;
};

const _tiltEuler = new THREE.Euler();
const _tiltQuat = new THREE.Quaternion();
const _localHit = new THREE.Vector3();

export function resolveDpadDirection(
  object: THREE.Object3D,
  worldPoint: THREE.Vector3
): DpadDirection {
  let mesh: THREE.Object3D | null = object;
  while (mesh && mesh.name !== "D_Pad") mesh = mesh.parent;
  if (!mesh) mesh = object;

  _localHit.copy(worldPoint);
  mesh.worldToLocal(_localHit);

  if (Math.abs(_localHit.x) > Math.abs(_localHit.z)) {
    return _localHit.x > 0 ? "right" : "left";
  }
  return _localHit.z > 0 ? "up" : "down";
}

export function resolveDeckMeshName(object: THREE.Object3D): string {
  let current: THREE.Object3D | null = object;
  while (current) {
    if (
      MESH_NAME_MAP[current.name] ||
      current.name.startsWith("Trackpad_") ||
      current.name === "Screen" ||
      current.name === "Joystick_L" ||
      current.name === "Joystick_R" ||
      isDpadMeshName(current.name)
    ) {
      return current.name;
    }
    current = current.parent;
  }
  return object.name;
}

export function isInteractiveMeshName(name: string): boolean {
  return (
    !!MESH_NAME_MAP[name] ||
    name.startsWith("Trackpad_") ||
    name === "Screen" ||
    name === "Joystick_L" ||
    name === "Joystick_R" ||
    isDpadMeshName(name)
  );
}

type GltfNodes = Record<string, THREE.Mesh>;

/**
 * Canvas-level raycasting — reliable for glTF primitives and Playwright clicks.
 * PresentationControls only rotates on drag; taps under CLICK_THRESHOLD_PX hit buttons.
 */
export function useDeckInteractions(scene: THREE.Object3D, nodes: GltfNodes) {
  const { camera, gl } = useThree();
  const pressButton = useDeckStore((s) => s.pressButton);
  const releaseButton = useDeckStore((s) => s.releaseButton);
  const powerOn = useDeckStore((s) => s.powerOn);
  const setTrackpadActive = useDeckStore((s) => s.setTrackpadActive);
  const moveSelection = useDeckStore((s) => s.moveSelection);
  const pressDpad = useDeckStore((s) => s.pressDpad);
  const releaseDpad = useDeckStore((s) => s.releaseDpad);
  const setJoystick = useDeckStore((s) => s.setJoystick);

  const dragJoystick = useRef<"L" | "R" | null>(null);
  const capturedPointerId = useRef<number | null>(null);
  const joystickTilt = useRef({ L: { x: 0, y: 0 }, R: { x: 0, y: 0 } });
  const joystickRest = useRef<{ L?: JoystickRest; R?: JoystickRest }>({});
  const pointerDown = useRef<{ x: number; y: number } | null>(null);
  const activeHit = useRef<THREE.Object3D | null>(null);
  const activeHitPoint = useRef<THREE.Vector3 | null>(null);

  type RayHit = { object: THREE.Object3D; point: THREE.Vector3 };

  useLayoutEffect(() => {
    (["L", "R"] as const).forEach((side) => {
      const node = side === "L" ? nodes.Joystick_L : nodes.Joystick_R;
      if (!node) return;
      joystickRest.current[side] = {
        quaternion: node.quaternion.clone(),
        position: node.position.clone(),
      };
    });
  }, [nodes.Joystick_L, nodes.Joystick_R]);

  useEffect(() => {
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.raycast = THREE.Mesh.prototype.raycast;
      }
    });
  }, [scene]);

  useFrame(() => {
    (["L", "R"] as const).forEach((side) => {
      const node = side === "L" ? nodes.Joystick_L : nodes.Joystick_R;
      const rest = joystickRest.current[side];
      if (!node || !rest) return;

      const tilt = joystickTilt.current[side];
      if (dragJoystick.current !== side) {
        tilt.x = THREE.MathUtils.lerp(tilt.x, 0, 0.2);
        tilt.y = THREE.MathUtils.lerp(tilt.y, 0, 0.2);
      }

      // Cap mesh extends along local +Z with pivot at z=0 (stick base).
      // Vertical drag → pitch (X), horizontal drag → yaw (Y). Z would only spin the cap.
      _tiltEuler.set(tilt.y * JOYSTICK_TILT, tilt.x * JOYSTICK_TILT, 0, "XYZ");
      _tiltQuat.setFromEuler(_tiltEuler);
      node.quaternion.copy(rest.quaternion).multiply(_tiltQuat);
      node.position.copy(rest.position);
      setJoystick(side, tilt.x, tilt.y);
    });
  });

  useEffect(() => {
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const canvas = gl.domElement;

    const hitTest = (clientX: number, clientY: number): RayHit | null => {
      const rect = gl.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObject(scene, true);

      for (const hit of hits) {
        const name = resolveDeckMeshName(hit.object);
        if (isInteractiveMeshName(name)) {
          return { object: hit.object, point: hit.point.clone() };
        }
      }
      const first = hits[0];
      return first ? { object: first.object, point: first.point.clone() } : null;
    };

    const handlePress = (object: THREE.Object3D, point: THREE.Vector3) => {
      const name = resolveDeckMeshName(object);
      const buttonId = MESH_NAME_MAP[name];
      const poweredOn = useDeckStore.getState().poweredOn;

      if (!poweredOn && (name === "Screen" || buttonId === "Power")) {
        primeBootAudioFromUserGesture();
      }

      if (buttonId) pressButton(buttonId);
      if (name === "Screen" && !poweredOn) powerOn();
      if (name === "Trackpad_L") setTrackpadActive("L", true);
      if (name === "Trackpad_R") setTrackpadActive("R", true);
      if (name === "Joystick_L") dragJoystick.current = "L";
      if (name === "Joystick_R") dragJoystick.current = "R";
      const dpadDirection = dpadDirectionFromMeshName(name);
      if (dpadDirection) pressDpad(dpadDirection);
      else if (name === "D_Pad") pressDpad(resolveDpadDirection(object, point));
    };

    const handleRelease = (object: THREE.Object3D) => {
      const name = resolveDeckMeshName(object);
      const buttonId = MESH_NAME_MAP[name];
      if (buttonId) releaseButton(buttonId);
      if (name === "Trackpad_L") setTrackpadActive("L", false);
      if (name === "Trackpad_R") setTrackpadActive("R", false);
      if (isDpadMeshName(name)) releaseDpad();
      dragJoystick.current = null;
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerDown.current = { x: e.clientX, y: e.clientY };
      const hit = hitTest(e.clientX, e.clientY);
      activeHit.current = hit?.object ?? null;
      activeHitPoint.current = hit?.point ?? null;
      if (hit) handlePress(hit.object, hit.point);
      if (dragJoystick.current !== null) {
        canvas.setPointerCapture(e.pointerId);
        capturedPointerId.current = e.pointerId;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (dragJoystick.current) {
        const side = dragJoystick.current;
        const tilt = joystickTilt.current[side];
        const sens = JOYSTICK_DRAG_SENS[side];
        tilt.x = THREE.MathUtils.clamp(tilt.x + e.movementX * sens, -1, 1);
        tilt.y = THREE.MathUtils.clamp(tilt.y + e.movementY * sens, -1, 1);
      }

      if (e.buttons && activeHit.current) {
        const name = resolveDeckMeshName(activeHit.current);
        if (name === "Trackpad_L" || name === "Trackpad_R") {
          const onMenu = useDeckStore.getState().currentApp === "menu";
          if (onMenu) moveSelection(e.movementY > 0 ? 1 : -1, MENU_ITEMS.length);
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      const start = pointerDown.current;
      const moved =
        start !== null &&
        Math.hypot(e.clientX - start.x, e.clientY - start.y) > CLICK_THRESHOLD_PX;

      const hit = moved
        ? hitTest(e.clientX, e.clientY)
        : activeHit.current && activeHitPoint.current
          ? { object: activeHit.current, point: activeHitPoint.current }
          : hitTest(e.clientX, e.clientY);

      if (hit && !moved) handleRelease(hit.object);
      else dragJoystick.current = null;

      releaseDpad();

      pointerDown.current = null;
      activeHit.current = null;
      activeHitPoint.current = null;

      if (capturedPointerId.current !== null) {
        try {
          canvas.releasePointerCapture(capturedPointerId.current);
        } catch {
          /* already released */
        }
        capturedPointerId.current = null;
      }
    };

    const opts = { capture: true };
    canvas.addEventListener("pointerdown", onPointerDown, opts);
    canvas.addEventListener("pointermove", onPointerMove, opts);
    canvas.addEventListener("pointerup", onPointerUp, opts);
    canvas.addEventListener("pointercancel", onPointerUp, opts);

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown, opts);
      canvas.removeEventListener("pointermove", onPointerMove, opts);
      canvas.removeEventListener("pointerup", onPointerUp, opts);
      canvas.removeEventListener("pointercancel", onPointerUp, opts);
    };
  }, [
    scene,
    camera,
    gl,
    pressButton,
    releaseButton,
    powerOn,
    setTrackpadActive,
    moveSelection,
    pressDpad,
    releaseDpad,
  ]);
}

/** Screen coords where a ray from the camera hits the named mesh. */
export function meshToClientCoords(
  scene: THREE.Object3D,
  camera: THREE.Camera,
  canvas: HTMLCanvasElement,
  meshName: string
): { x: number; y: number } | null {
  let target: THREE.Object3D | null = null;
  scene.traverse((obj) => {
    if (obj.name === meshName) target = obj;
  });
  if (!target) return null;

  const camPos = new THREE.Vector3();
  camera.getWorldPosition(camPos);
  const targetPos = new THREE.Vector3();
  (target as THREE.Object3D).getWorldPosition(targetPos);

  const raycaster = new THREE.Raycaster();
  raycaster.set(camPos, targetPos.clone().sub(camPos).normalize());
  const hits = raycaster.intersectObject(scene, true);

  const hit = hits.find((h) => resolveDeckMeshName(h.object) === meshName);
  const point = hit?.point ?? targetPos;
  const projected = point.clone().project(camera as THREE.PerspectiveCamera);

  const rect = canvas.getBoundingClientRect();
  return {
    x: rect.left + ((projected.x + 1) / 2) * rect.width,
    y: rect.top + ((-projected.y + 1) / 2) * rect.height,
  };
}
