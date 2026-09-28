import { SEQUENCE_COUNT, sequenceFrame } from "./assets";

class SequenceLoader {
  private cache = new Map<number, HTMLImageElement>();
  private loading = new Set<number>();
  private lastDrawnIndex = 0;

  constructor() {
    if (typeof window !== "undefined") {
      // Preload initial frames for instant startup
      this.preloadRange(0, 25);
      // Preload key crystal frames
      [39, 99, 134, 184, 239, 304, 354, 404].forEach((idx) => this.preload(idx));
    }
  }

  public preload(index: number) {
    const idx = Math.min(SEQUENCE_COUNT - 1, Math.max(0, index));
    if (this.cache.has(idx) || this.loading.has(idx)) return;
    this.loading.add(idx);

    const img = new Image();
    img.src = sequenceFrame(idx);
    if (typeof img.decode === "function") {
      img
        .decode()
        .then(() => {
          this.cache.set(idx, img);
          this.loading.delete(idx);
        })
        .catch(() => {
          this.cache.set(idx, img);
          this.loading.delete(idx);
        });
    } else {
      img.onload = () => {
        this.cache.set(idx, img);
        this.loading.delete(idx);
      };
    }
  }

  public preloadRange(start: number, end: number) {
    const s = Math.max(0, start);
    const e = Math.min(SEQUENCE_COUNT - 1, end);
    for (let i = s; i <= e; i++) {
      this.preload(i);
    }
  }

  public getFrame(index: number): HTMLImageElement | null {
    const idx = Math.min(SEQUENCE_COUNT - 1, Math.max(0, index));
    // Proactively preload surrounding window ahead of scroll
    this.preloadRange(idx - 4, idx + 20);

    const exact = this.cache.get(idx);
    if (exact && exact.complete && exact.naturalWidth > 0) {
      this.lastDrawnIndex = idx;
      return exact;
    }

    // If exact not yet decoded, return closest loaded frame to avoid stutter
    if (this.cache.has(this.lastDrawnIndex)) {
      return this.cache.get(this.lastDrawnIndex)!;
    }

    // Search nearest
    for (let offset = 1; offset <= 20; offset++) {
      const prev = idx - offset;
      if (prev >= 0 && this.cache.has(prev)) {
        this.lastDrawnIndex = prev;
        return this.cache.get(prev)!;
      }
      const next = idx + offset;
      if (next < SEQUENCE_COUNT && this.cache.has(next)) {
        this.lastDrawnIndex = next;
        return this.cache.get(next)!;
      }
    }

    return null;
  }
}

export const sequenceLoader = new SequenceLoader();
