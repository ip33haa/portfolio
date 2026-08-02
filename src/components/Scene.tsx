import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { SteamDeckModel } from "./SteamDeckModel";

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 4, 2]} intensity={1.4} castShadow />
      <hemisphereLight intensity={0.35} groundColor="#111111" color="#ffffff" />

      <SteamDeckModel />

      <OrbitControls
        makeDefault
        enableRotate={false}
        enablePan={false}
        enableZoom={false}
        mouseButtons={{
          LEFT: null as unknown as THREE.MOUSE,
          MIDDLE: null as unknown as THREE.MOUSE,
          RIGHT: null as unknown as THREE.MOUSE,
        }}
      />

      <ContactShadows position={[0, -0.12, 0]} opacity={0.35} blur={2.5} scale={8} />
      <Environment preset="city" />
    </>
  );
}

export function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 1], fov: 36, near: 0.01, far: 50 }}
      className="w-full h-full touch-none bg-transparent"
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      data-testid="deck-canvas"
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}
