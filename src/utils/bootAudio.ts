const BOOT_VIDEO_SRC = "/videos/rift_of_the_necrodancer.webm";

/** Call synchronously inside a click/pointer handler before powerOn(). */
export function primeBootAudioFromUserGesture() {
  const video = document.createElement("video");
  video.src = BOOT_VIDEO_SRC;
  video.preload = "auto";
  video.muted = false;
  video.volume = 1;
  video.playsInline = true;

  const cleanup = () => {
    video.pause();
    video.removeAttribute("src");
    video.load();
  };

  video
    .play()
    .then(() => {
      video.pause();
      video.currentTime = 0;
      cleanup();
    })
    .catch(cleanup);
}

export async function playBootVideo(video: HTMLVideoElement): Promise<void> {
  video.volume = 1;
  video.muted = false;

  try {
    await video.play();
    return;
  } catch {
    video.muted = true;
    await video.play();
  }
}

export { BOOT_VIDEO_SRC };
