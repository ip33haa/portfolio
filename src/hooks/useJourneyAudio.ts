import { useEffect, useRef } from "react";

export const JOURNEY_MUSIC = encodeURI(
  "/audio/Fantasy Fairy Tale Music Magical  Ethereal Fantasy Music  528 hz  No copyright.mp3",
);

export function useJourneyAudio(enabled: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(JOURNEY_MUSIC);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.38;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (enabled) {
      void audio.play().catch(() => undefined);
      return;
    }
    audio.pause();
  }, [enabled]);

  const play = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = audio.currentTime || 0;
    void audio.play().catch(() => undefined);
  };

  return play;
}
