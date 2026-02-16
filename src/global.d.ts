// Module declarations for asset imports that TypeScript doesn't know about by default.
declare module '*.glb';
declare module '/card.glb' {
  const src: string;
  export default src;
}
declare module '*.png';

declare module 'meshline' {
  export const MeshLineGeometry: any;
  export const MeshLineMaterial: any;
}


declare module '*.gltf' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '/lanyard.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

export {};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: any;
      meshLineMaterial: any;
    }
  }
}

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: any;
    meshLineMaterial: any;
  }
}
