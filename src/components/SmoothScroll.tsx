import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import "lenis/dist/lenis.css";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ autoRaf: true });
    return () => lenis.destroy();
  }, [reduced]);

  return children;
}
