import { useMotionValueEvent, useScroll, type MotionValue } from "framer-motion";
import { useEffect, useState, type RefObject } from "react";

export function useScrollProgress(target: RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end end"],
  });
  const [progress, setProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setProgress(value);
  });

  return { progress, scrollYProgress };
}

export function useScrollVelocity(scrollYProgress: MotionValue<number>) {
  const [velocity, setVelocity] = useState(0);

  useEffect(() => {
    let last = scrollYProgress.get();
    let lastTime = performance.now();
    return scrollYProgress.on("change", (value) => {
      const now = performance.now();
      const dt = Math.max(now - lastTime, 16);
      setVelocity(Math.min(1, Math.abs(value - last) / (dt / 1000) / 2));
      last = value;
      lastTime = now;
    });
  }, [scrollYProgress]);

  return velocity;
}
