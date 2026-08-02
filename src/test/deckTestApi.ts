import * as THREE from "three";
import { useDeckStore, ButtonId, DeckApp } from "../store/deckStore";
import {
  meshToClientCoords,
  resolveDeckMeshName,
  MESH_NAME_MAP,
  isInteractiveMeshName,
  resolveDpadDirection,
} from "../hooks/useDeckInteractions";
import { dpadDirectionFromMeshName } from "../hooks/dpadMeshes";

export interface DeckTestApi {
  getState: () => ReturnType<typeof useDeckStore.getState>;
  pressButton: (id: ButtonId) => void;
  powerOn: () => void;
  skipBoot: () => void;
  navigateTo: (app: DeckApp) => void;
  clickMenuItem: (app: DeckApp) => void;
  getMeshClickPoint: (meshName: string) => { x: number; y: number } | null;
  simulateMeshPress: (meshName: string) => boolean;
}

declare global {
  interface Window {
    __deckTest?: DeckTestApi;
  }
}

export function installDeckTestApi(
  scene: THREE.Object3D,
  getCamera: () => THREE.Camera,
  getCanvas: () => HTMLCanvasElement
) {
  if (!import.meta.env.DEV && import.meta.env.VITE_E2E !== "true") return;

  window.__deckTest = {
    getState: () => useDeckStore.getState(),
    pressButton: (id) => useDeckStore.getState().pressButton(id),
    powerOn: () => useDeckStore.getState().powerOn(),
    skipBoot: () => useDeckStore.getState().navigateTo("menu"),
    navigateTo: (app) => useDeckStore.getState().navigateTo(app),
    clickMenuItem: (app) => {
      const el = document.querySelector(`[data-testid="menu-${app}"]`) as HTMLButtonElement | null;
      el?.click();
      if (!el) useDeckStore.getState().navigateTo(app);
    },
    getMeshClickPoint: (meshName) =>
      meshToClientCoords(scene, getCamera(), getCanvas(), meshName),
    simulateMeshPress: (meshName) => {
      let target: THREE.Object3D | null = null;
      scene.traverse((obj) => {
        if (obj.name === meshName) target = obj;
      });
      if (!target) return false;

      const name = resolveDeckMeshName(target);
      if (!isInteractiveMeshName(name)) return false;

      const buttonId = MESH_NAME_MAP[name];
      const store = useDeckStore.getState();

      if (buttonId) store.pressButton(buttonId);
      if (name === "Screen" && !store.poweredOn) store.powerOn();
      const dpadDirection = dpadDirectionFromMeshName(name);
      if (dpadDirection) {
        store.pressDpad(dpadDirection);
        store.releaseDpad();
      } else if (name === "D_Pad") {
        const point = new THREE.Vector3();
        (target as THREE.Object3D).getWorldPosition(point);
        store.pressDpad(resolveDpadDirection(target as THREE.Object3D, point));
        store.releaseDpad();
      } else if (buttonId) {
        store.releaseButton(buttonId);
      }
      return true;
    },
  };
}
