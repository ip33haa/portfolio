import { AnimatePresence, motion } from "framer-motion";
import type { JourneyScene } from "../../data/journey";

type Props = {
  scene: JourneyScene;
  visible: boolean;
  compact?: boolean;
};

const ease = [0.16, 1, 0.3, 1] as const;

export function SceneText({ scene, visible, compact = false }: Props) {
  const [lead, rest] = scene.title.split(" — ");
  const words = lead.split(" ");

  if (compact) {
    return (
      <div
        className={`scene-copy max-w-xl transition duration-700 ${
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <p className="text-[10px] tracking-[0.42em] text-white/45">{scene.number}</p>
        <h2 className="hall-title mt-3 text-3xl font-light tracking-[0.06em] text-white sm:text-4xl md:text-5xl">
          {scene.title}
        </h2>
        <p className="mt-4 max-w-md whitespace-pre-line text-xs leading-6 text-white/70 sm:text-sm">
          {scene.body}
        </p>
      </div>
    );
  }

  return (
    <div className="scene-copy relative mx-auto flex w-full max-w-5xl flex-col items-center text-center">
      <AnimatePresence mode="wait">
        {visible ? (
          <motion.div
            key={scene.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -24, filter: "blur(10px)" }}
            transition={{ duration: 0.55, ease }}
            className="flex flex-col items-center"
          >
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.6em" }}
              animate={{ opacity: 1, letterSpacing: "0.42em" }}
              transition={{ duration: 1.1, ease }}
              className="text-[10px] text-white/50 uppercase sm:text-[11px]"
            >
              {scene.number}
              {scene.subtitle ? `  ·  ${scene.subtitle}` : ""}
            </motion.p>
            <h2 className="hall-title mt-5 max-w-[16ch] text-[12vw] leading-[0.9] font-light tracking-[0.04em] text-white sm:mt-6 sm:text-[7.4vw] md:text-[6.2vw] lg:text-[5.4vw]">
              {words.map((word, i) => (
                <motion.span
                  key={`${scene.id}-${word}-${i}`}
                  className="mr-[0.18em] inline-block"
                  initial={{ opacity: 0, y: 48, filter: "blur(16px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.95, delay: 0.08 + i * 0.09, ease }}
                >
                  {word}
                </motion.span>
              ))}
            </h2>
            {rest ? (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.28, ease }}
                className="mt-4 text-[11px] tracking-[0.34em] text-white/55 uppercase sm:text-xs"
              >
                {rest}
              </motion.p>
            ) : null}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.42, ease }}
              className="mt-7 max-w-lg whitespace-pre-line text-[13px] leading-7 text-white/68 sm:mt-8 sm:text-[15px] sm:leading-8"
            >
              {scene.body}
            </motion.p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
