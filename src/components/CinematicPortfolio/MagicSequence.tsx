import { useEffect, useRef, useState } from "react";
import { contact } from "../../data/contact";
import { MAGIC_COUNT, MAGIC_CV_FROM, magicFrame } from "../../data/assets";
import { useScrollProgress } from "../../hooks/useScrollProgress";

export function MagicSequence() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { progress } = useScrollProgress(trackRef);
  const index = Math.min(MAGIC_COUNT - 1, Math.round(progress * (MAGIC_COUNT - 1)));
  const src = magicFrame(index);
  const [shown, setShown] = useState(src);
  const showCv = index >= MAGIC_CV_FROM;

  useEffect(() => {
    if (shown === src) return;
    const img = new Image();
    img.onload = () => setShown(src);
    img.src = src;
  }, [shown, src]);

  useEffect(() => {
    // Only preload surrounding window around current index
    const start = Math.max(0, index - 2);
    const end = Math.min(MAGIC_COUNT - 1, index + 12);
    for (let i = start; i <= end; i++) {
      const img = new Image();
      img.src = magicFrame(i);
    }
  }, [index]);

  return (
    <section
      ref={trackRef}
      id="cv-chest"
      data-testid="magic-sequence"
      className="relative"
      style={{ height: "480vh" }}
    >
      <div className="sticky top-0 h-dvh overflow-hidden bg-black">
        <img src={shown} alt="Opening the chest in a crystal cave" className="h-full w-full object-cover" />
        {showCv ? (
          <a
            href={contact.cv}
            target="_blank"
            rel="noreferrer"
            data-testid="cv-paper"
            className="absolute left-[31.8%] top-[0%] z-10 block h-[100%] w-[40%] overflow-hidden bg-white"
            aria-label="Open CV"
          >
            <img
              src={contact.cvPreview}
              alt="John Philip Garcia CV"
              className="h-full w-full object-cover"
            />
          </a>
        ) : null}
      </div>
    </section>
  );
}
