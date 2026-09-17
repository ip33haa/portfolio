import { Globe, Mouse, Volume2, VolumeX } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { cameraAt, cinematicLengthVh, sceneScrollAt } from "../../data/camera";
import { contact } from "../../data/contact";
import { journey } from "../../data/journey";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useScrollProgress, useScrollVelocity } from "../../hooks/useScrollProgress";
import { Button } from "../UI/Button";
import { Icon } from "../UI/Icon";
import { CameraScene } from "./CameraScene";
import { CrystalNavigation } from "./CrystalNavigation";
import { CrystalScene } from "./CrystalScene";
import { ParticleLayer } from "./ParticleLayer";
import { Scene } from "./Scene";
import { SceneText } from "./SceneText";
import { ScrollProgress } from "./ScrollProgress";
import { TreeScene } from "./TreeScene";

type Props = {
  entered: boolean;
  soundOn: boolean;
  onToggleSound: () => void;
};

export function CinematicExperience({ entered, soundOn, onToggleSound }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const simplify = reduced || isMobile;
  const { progress, scrollYProgress } = useScrollProgress(trackRef);
  const velocity = useScrollVelocity(scrollYProgress);

  const camera = useMemo(() => cameraAt(simplify ? 0 : progress), [progress, simplify]);
  const scene = journey[camera.sceneIndex] ?? journey[0];

  useEffect(() => {
    if (!entered || simplify) return;
    const img = new Image();
    img.src = cameraAt(Math.min(1, sceneScrollAt[Math.min(camera.sceneIndex + 1, sceneScrollAt.length - 1)])).plate;
  }, [camera.sceneIndex, entered, simplify]);

  const jumpToCrystal = (crystal: number) => {
    const index = journey.findIndex((item) => item.crystal === crystal);
    if (index < 0) return;
    if (simplify) {
      document.getElementById(`scene-${journey[index].id}`)?.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
      });
      return;
    }
    const top = trackRef.current?.offsetTop ?? 0;
    const height = trackRef.current?.offsetHeight ?? 1;
    window.scrollTo({
      top: top + sceneScrollAt[index] * (height - window.innerHeight),
      behavior: reduced ? "auto" : "smooth",
    });
  };

  if (simplify) {
    return (
      <CinematicPanels
        onSelectCrystal={jumpToCrystal}
        soundOn={soundOn}
        onToggleSound={onToggleSound}
        particleColor={scene.accent}
        particlesEnabled={!reduced}
      />
    );
  }

  return (
    <div ref={trackRef} className="relative" style={{ height: `${cinematicLengthVh}vh` }}>
      <div className="sticky top-0 h-dvh overflow-hidden">
        <CameraScene camera={camera} reduced={reduced} />
        <TreeScene intensity={camera.sceneIndex <= 1 ? 1 : 0.35} />
        <CrystalScene crystal={scene.crystal} glow={Math.min(1, camera.glow + velocity * 0.25)} />
        <ParticleLayer color={scene.accent} density={isMobile ? 50 : 90} enabled={!reduced} />
        <Hud soundOn={soundOn} onToggleSound={onToggleSound} />
        <CrystalNavigation activeCrystal={scene.crystal} onSelect={jumpToCrystal} />
        <ScrollProgress progress={progress} />
        <div className="absolute inset-0 z-20 flex items-end p-8 pb-16 md:p-16">
          <SceneText scene={scene} visible />
        </div>
        {camera.sceneIndex === 0 ? (
          <p className="absolute bottom-8 left-8 z-30 flex items-center gap-3 text-[10px] tracking-[0.32em] text-white/55">
            <Icon icon={Mouse} label="Scroll" />
            SCROLL TO BEGIN
          </p>
        ) : null}
        {camera.sceneIndex === 8 ? (
          <p className="absolute right-16 bottom-16 z-30 text-[10px] tracking-[0.28em] text-white/50">
            01 → 02 → 03 → 04 → 05 → 06
          </p>
        ) : null}
        {camera.sceneIndex === 9 ? (
          <div className="absolute right-8 bottom-16 z-30 md:right-16">
            <ClosingActions />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Hud({ soundOn, onToggleSound }: { soundOn: boolean; onToggleSound: () => void }) {
  return (
    <>
      <Link to="/" className="fixed top-6 left-6 z-40 text-xs tracking-[0.4em] text-white/80">
        {contact.shortName}
      </Link>
      <button
        type="button"
        onClick={onToggleSound}
        className="fixed top-6 right-16 z-40 inline-flex items-center text-white/70 hover:text-white md:right-6"
        aria-pressed={soundOn}
        aria-label={soundOn ? "Sound on" : "Sound off"}
      >
        <span className="mr-2 hidden text-[10px] tracking-[0.22em] md:inline">
          {soundOn ? "SOUND ON" : "SOUND OFF"}
        </span>
        <Icon icon={soundOn ? Volume2 : VolumeX} label={soundOn ? "Sound on" : "Sound off"} />
      </button>
    </>
  );
}

function ClosingActions() {
  return (
    <div className="relative z-30 flex flex-col items-start gap-4 md:items-end">
      <Button href="#work">EXPLORE MY WORK</Button>
      <Button href={`mailto:${contact.email}`} variant="ghost">
        LET'S CONNECT
      </Button>
      <div className="mt-2 flex gap-4 text-white/70">
        <a href={contact.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="h-4 w-4">
          <GitHubMark />
        </a>
        <a href={contact.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="h-4 w-4">
          <LinkedInMark />
        </a>
        <a href={contact.website} target="_blank" rel="noreferrer" aria-label="Website">
          <Icon icon={Globe} label="Website" />
        </a>
      </div>
      <p className="text-[10px] tracking-[0.28em] text-white/45">SCROLL TO EXPLORE MY WORK</p>
    </div>
  );
}

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
      <path d="M12 .5C5.73.5.5 5.73.5 12.02c0 5.1 3.29 9.43 7.86 10.96.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.73.08-.72.08-.72 1.17.08 1.79 1.21 1.79 1.21 1.04 1.79 2.73 1.27 3.4.97.1-.76.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.75.81 1.2 1.84 1.2 3.1 0 4.43-2.69 5.4-5.25 5.69.42.37.8 1.1.8 2.22 0 1.6-.01 2.89-.01 3.28 0 .31.21.67.8.55A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

function LinkedInMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.43v6.31ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.8 0 0 .77 0 1.73v20.54C0 23.22.8 24 1.77 24h20.46c.97 0 1.77-.78 1.77-1.73V1.73C24 .77 23.2 0 22.23 0Z" />
    </svg>
  );
}

function CinematicPanels({
  onSelectCrystal,
  soundOn,
  onToggleSound,
  particleColor,
  particlesEnabled,
}: {
  onSelectCrystal: (crystal: number) => void;
  soundOn: boolean;
  onToggleSound: () => void;
  particleColor: string;
  particlesEnabled: boolean;
}) {
  return (
    <div>
      <Hud soundOn={soundOn} onToggleSound={onToggleSound} />
      <div className="pointer-events-none fixed inset-0 z-[12]">
        <ParticleLayer color={particleColor} density={50} enabled={particlesEnabled} />
      </div>
      <CrystalNavigation mobile onSelect={onSelectCrystal} />
      {journey.map((scene, index) => {
        const cam = cameraAt(sceneScrollAt[index] ?? 0);
        return (
          <Scene key={scene.id} className="overflow-hidden">
            <div id={`scene-${scene.id}`} className="absolute top-0" />
            <img
              src={cam.plate}
              alt="Dome garden with the Tree of Growth and crystals"
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                transformOrigin: `${cam.origin.x * 100}% ${cam.origin.y * 100}%`,
                transform: `scale(${1.12 + (scene.crystal ? 0.28 : 0)})`,
              }}
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="relative z-10 flex min-h-dvh flex-col justify-end gap-8 p-6 pb-24">
              <SceneText scene={scene} visible compact />
              {scene.id === "growing" ? <ClosingActions /> : null}
            </div>
            {scene.id === "welcome" ? (
              <p className="absolute bottom-8 left-6 z-10 text-[10px] tracking-[0.28em] text-white/50">
                SCROLL TO BEGIN
              </p>
            ) : null}
          </Scene>
        );
      })}
    </div>
  );
}
