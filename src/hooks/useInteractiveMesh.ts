import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Generic hook for clickable mesh parts. Prefer useDeckButtonVisuals for
 * store-driven Steam Deck buttons; this remains useful for one-off meshes.
 */
export function useInteractiveMesh(onActivate?: () => void, pressDepth = 0.0015) {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const restZ = useRef<number | null>(null);

  useFrame(() => {
    if (!ref.current) return;
    if (restZ.current === null) restZ.current = ref.current.position.z;

    const targetZ = pressed ? restZ.current - pressDepth : restZ.current;
    ref.current.position.z = THREE.MathUtils.lerp(
      ref.current.position.z,
      targetZ,
      0.35
    );

    const targetScale = hovered ? 1.03 : 1;
    ref.current.scale.setScalar(
      THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.2)
    );
  });

  const handlers = {
    ref,
    onPointerOver: (e: any) => {
      e.stopPropagation();
      setHovered(true);
      document.body.style.cursor = "pointer";
    },
    onPointerOut: (e: any) => {
      e.stopPropagation();
      setHovered(false);
      document.body.style.cursor = "default";
    },
    onPointerDown: (e: any) => {
      e.stopPropagation();
      setPressed(true);
    },
    onPointerUp: (e: any) => {
      e.stopPropagation();
      setPressed(false);
      onActivate?.();
    },
  };

  return { handlers, hovered, pressed };
}
