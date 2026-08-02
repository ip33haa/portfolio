import { useDeckStore } from "../store/deckStore";
import { primeBootAudioFromUserGesture } from "../utils/bootAudio";

export function PowerToggle() {
  const poweredOn = useDeckStore((s) => s.poweredOn);
  const powerOn = useDeckStore((s) => s.powerOn);
  const powerOff = useDeckStore((s) => s.powerOff);

  const handleToggle = () => {
    if (poweredOn) {
      powerOff();
      return;
    }
    primeBootAudioFromUserGesture();
    powerOn();
  };

  return (
    <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2 z-20 pointer-events-none">
      {!poweredOn && (
        <p className="text-neutral-400 text-sm text-center px-4">
          Or use the deck power button / screen
        </p>
      )}
      <button
        type="button"
        data-testid="power-on-fallback"
        aria-pressed={poweredOn}
        aria-label={poweredOn ? "Turn off Steam Deck" : "Turn on Steam Deck"}
        onClick={handleToggle}
        className={`pointer-events-auto flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-300 ${
          poweredOn
            ? "bg-emerald-600 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.45)] hover:bg-emerald-500"
            : "bg-neutral-800/90 border-neutral-600 text-neutral-300 hover:bg-neutral-700 hover:border-neutral-500"
        }`}
      >
        <span
          className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
            poweredOn ? "bg-white shadow-[0_0_8px_#fff]" : "bg-neutral-500"
          }`}
        />
        {poweredOn ? "On" : "Off"}
      </button>
    </div>
  );
}
