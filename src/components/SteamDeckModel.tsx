import { useLayoutEffect, useEffect, useMemo } from "react";
import { createPortal, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useDeckStore } from "../store/deckStore";
import { useDeckInteractions } from "../hooks/useDeckInteractions";
import { useDeckButtonVisuals } from "../hooks/useDeckButtonVisuals";
import { installDeckTestApi } from "../test/deckTestApi";
import { ScreenOverlay } from "./ScreenOverlay";
import { getScreenHtmlConfig } from "../utils/screenHtmlConfig";

/** Blender glTF export — Draco meshes + textures in /public/models/SteamDeck/ */
export const STEAMDECK_MODEL_PATH = "/models/SteamDeck/Steam.gltf";

/** Margin multiplier — lower = closer / larger; keep ~0.72–0.82 so buttons stay in frame */
const FIT_MARGIN = 0.97;
/** Extra room for bumpers/triggers that sit outside the main body silhouette */
const FIT_PADDING = 1.06;

type GltfNodes = Record<string, THREE.Mesh>;

function fitCameraToObject(
  camera: THREE.PerspectiveCamera,
  object: THREE.Object3D,
  margin = FIT_MARGIN
) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  // Fit to front-face width/height only — ignore depth so the deck fills the screen.
  const vFov = (camera.fov * Math.PI) / 360;
  const fitHeightDistance = (size.y * FIT_PADDING) / (2 * Math.tan(vFov));
  const fitWidthDistance = (size.x * FIT_PADDING) / (2 * Math.tan(vFov) * camera.aspect);
  const distance = Math.max(fitHeightDistance, fitWidthDistance) * margin;

  camera.position.set(center.x, center.y, center.z + distance);
  camera.lookAt(center);
  camera.near = distance / 100;
  camera.far = distance * 100;
  camera.updateProjectionMatrix();

  return distance;
}

export function SteamDeckModel(props: JSX.IntrinsicElements["group"]) {
  const { scene, nodes } = useGLTF(STEAMDECK_MODEL_PATH, true) as unknown as {
    scene: THREE.Group;
    nodes: GltfNodes;
  };

  const poweredOn = useDeckStore((s) => s.poweredOn);
  const { camera, gl, controls } = useThree();

  useDeckInteractions(scene, nodes);
  useDeckButtonVisuals(nodes);

  useLayoutEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);
    scene.updateMatrixWorld(true);

    if (camera instanceof THREE.PerspectiveCamera) {
      const distance = fitCameraToObject(camera, scene);

      if (controls && "minDistance" in controls && "maxDistance" in controls) {
        const orbit = controls as unknown as THREE.EventDispatcher & {
          minDistance: number;
          maxDistance: number;
          target: THREE.Vector3;
          update: () => void;
        };
        orbit.minDistance = distance;
        orbit.maxDistance = distance;
        orbit.target.set(0, 0, 0);
        orbit.update();
      }
    }
  }, [scene, camera, controls]);

  useEffect(() => {
    installDeckTestApi(scene, () => camera, () => gl.domElement);
  }, [scene, camera, gl]);

  const screenHtml = useMemo(
    () => (nodes.Screen ? getScreenHtmlConfig(nodes.Screen) : null),
    [nodes.Screen]
  );

  useEffect(() => {
    const screen = nodes.Screen;
    if (!screen?.material || Array.isArray(screen.material)) return;

    const mat = screen.material as THREE.MeshStandardMaterial;
    if (!mat.userData.portfolioCloned) {
      const cloned = mat.clone();
      cloned.userData.portfolioCloned = true;
      screen.material = cloned;
    }

    const material = screen.material as THREE.MeshStandardMaterial;
    if (poweredOn) {
      material.emissive.setRGB(0.04, 0.06, 0.1);
      material.emissiveIntensity = 0.35;
    } else {
      material.emissive.setRGB(0, 0, 0);
      material.emissiveIntensity = 0;
    }
  }, [poweredOn, nodes.Screen]);

  return (
    <group {...props} dispose={null}>
      <primitive object={scene} />

      {poweredOn &&
        nodes.Screen &&
        screenHtml &&
        createPortal(
          <ScreenOverlay
            position={screenHtml.position}
            rotation={screenHtml.rotation}
            distanceFactor={screenHtml.distanceFactor}
          />,
          nodes.Screen
        )}
    </group>
  );
}

useGLTF.preload(STEAMDECK_MODEL_PATH, true);
