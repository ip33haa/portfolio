import { Canvas, useLoader } from "@react-three/fiber";
import { Center, useAnimations, useGLTF } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import {
  FrontSide,
  LoopRepeat,
  MeshBasicMaterial,
  SRGBColorSpace,
  TextureLoader,
  type Mesh,
} from "three";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const MODEL = "/models/magic_ring_-_red/scene.gltf";
const DIFFUSE = "/models/magic_ring_-_red/textures/Material.001_diffuse.png";

type Props = {
  progress: number;
  ready: boolean;
};

function Ring({ reduced }: { reduced: boolean }) {
  const { scene, animations } = useGLTF(MODEL);
  const { actions, names } = useAnimations(animations, scene);
  const diffuse = useLoader(TextureLoader, DIFFUSE);

  useEffect(() => {
    diffuse.colorSpace = SRGBColorSpace;
    diffuse.anisotropy = 8;
    diffuse.needsUpdate = true;

    const material = new MeshBasicMaterial({
      map: diffuse,
      transparent: true,
      alphaTest: 0.2,
      side: FrontSide,
      toneMapped: false,
      depthWrite: false,
    });

    scene.traverse((child) => {
      const mesh = child as Mesh;
      if (!mesh.isMesh) return;
      mesh.material = material;
    });

    return () => {
      material.dispose();
    };
  }, [diffuse, scene]);

  useEffect(() => {
    const keys = names.length ? names : Object.keys(actions);
    for (const name of keys) {
      const action = actions[name];
      if (!action) continue;
      action.reset();
      action.setLoop(LoopRepeat, Infinity);
      action.play();
      action.paused = reduced;
      action.timeScale = reduced ? 0 : 0.85;
    }
    return () => {
      for (const name of keys) actions[name]?.stop();
    };
  }, [actions, names, reduced]);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} scale={0.78}>
      <primitive object={scene} />
    </group>
  );
}

export function MagicCircle({ progress, ready }: Props) {
  const reduced = useReducedMotion();
  void progress;
  void ready;

  return (
    <div className="relative h-[min(70vw,380px)] w-[min(70vw,380px)] overflow-hidden rounded-full">
      <Canvas
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, 28], fov: 24, near: 0.1, far: 80 }}
        dpr={[1, 2]}
        className="h-full w-full"
      >
        <Suspense fallback={null}>
          <Center>
            <Ring reduced={reduced} />
          </Center>
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL);
