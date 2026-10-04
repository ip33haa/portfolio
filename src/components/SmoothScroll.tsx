import Lenis from "lenis";
import { useEffect, useRef, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useReducedMotion } from "../hooks/useReducedMotion";
import "lenis/dist/lenis.css";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const location = useLocation();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.55,
      lerp: 0.055,
      wheelMultiplier: 0.78,
      touchMultiplier: 1.05,
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname]);

  return children;
}
