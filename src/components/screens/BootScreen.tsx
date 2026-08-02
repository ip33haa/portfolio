import { useCallback, useLayoutEffect, useRef } from "react";
import { useDeckStore } from "../../store/deckStore";
import { BOOT_VIDEO_SRC, playBootVideo } from "../../utils/bootAudio";

export function BootScreen() {
  const navigateTo = useDeckStore((s) => s.navigateTo);
  const videoRef = useRef<HTMLVideoElement>(null);
  const finishedRef = useRef(false);

  const finishBoot = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    navigateTo("menu");
  }, [navigateTo]);

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    finishedRef.current = false;
    video.currentTime = 0;

    playBootVideo(video).catch(() => finishBoot());

    return () => {
      video.pause();
    };
  }, [finishBoot]);

  return (
    <div className="w-full h-full bg-black" data-testid="boot-screen">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={BOOT_VIDEO_SRC}
        autoPlay
        playsInline
        preload="auto"
        onEnded={finishBoot}
        onError={finishBoot}
      />
    </div>
  );
}
