import { useDeckStore } from "../../store/deckStore";

export function ScreenHeader({ title }: { title: string }) {
  const navigateTo = useDeckStore((s) => s.navigateTo);
  return (
    <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-800 bg-neutral-900">
      <button
        onClick={() => navigateTo("menu")}
        className="text-sm px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700"
      >
        ← B: Back
      </button>
      <h1 className="text-xl font-semibold">{title}</h1>
    </div>
  );
}
