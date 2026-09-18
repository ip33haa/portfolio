import { useEffect, useState } from "react";
import { CinematicExperience } from "../components/CinematicPortfolio/CinematicExperience";
import { ProjectGrid } from "../components/Portfolio/ProjectGrid";
import { LoadingScreen } from "../components/UI/LoadingScreen";
import { preloadImages, sequenceImages, magicImages } from "../data/assets";
import { useJourneyAudio } from "../hooks/useJourneyAudio";

const ENTERED_KEY = "tree-of-growth:entered";

function hasEnteredJourney() {
  try {
    return sessionStorage.getItem(ENTERED_KEY) === "1";
  } catch {
    return false;
  }
}

function markJourneyEntered() {
  try {
    sessionStorage.setItem(ENTERED_KEY, "1");
  } catch {
    /* private mode */
  }
}

export function HomePage() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [entered, setEntered] = useState(hasEnteredJourney);
  const [soundOn, setSoundOn] = useState(true);
  const playMusic = useJourneyAudio(entered && soundOn);

  useEffect(() => {
    let loaded = 0;
    const total = preloadImages.length;
    preloadImages.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        loaded += 1;
        setProgress(loaded / total);
        if (loaded >= total) setReady(true);
      };
      img.onerror = () => {
        loaded += 1;
        setProgress(loaded / total);
        if (loaded >= total) setReady(true);
      };
      img.src = src;
    });
  }, []);

  useEffect(() => {
    document.body.style.overflow = entered ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [entered]);

  useEffect(() => {
    if (!entered) return;
    [...sequenceImages, ...magicImages].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [entered]);

  return (
    <>
      {!entered ? (
        <LoadingScreen
          progress={progress}
          ready={ready}
          onEnter={() => {
            markJourneyEntered();
            playMusic();
            setEntered(true);
          }}
        />
      ) : null}
      <CinematicExperience
        entered={entered}
        soundOn={soundOn}
        onToggleSound={() => {
          if (soundOn) {
            setSoundOn(false);
            return;
          }
          setSoundOn(true);
          playMusic();
        }}
      />
      <ProjectGrid />
    </>
  );
}
