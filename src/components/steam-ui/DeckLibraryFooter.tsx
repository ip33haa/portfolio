import { DeckButtonHint } from "./DeckButtonHint";

export function DeckLibraryFooter() {
  return (
    <footer className="relative z-10 shrink-0 flex items-center justify-between px-5 py-3 bg-[#0e1216]/95 border-t border-white/[0.06]">
      <DeckButtonHint face="steam" label="Menu" />

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <DeckButtonHint face="X" label="Filtered" />
          <span className="flex items-center gap-1.5 -ml-1">
            <span className="w-4 h-4 rounded-full bg-[#59bf40] flex items-center justify-center text-[8px] font-bold text-black">
              ✓
            </span>
            <span className="w-4 h-4 rounded-full bg-[#ffc107] flex items-center justify-center text-[9px] font-bold text-black">
              i
            </span>
            <span className="w-4 h-4 rounded-full bg-[#888] flex items-center justify-center text-[8px] text-black">
              ∅
            </span>
          </span>
        </div>
        <DeckButtonHint face="Y" label="Sort by" />
        <DeckButtonHint
          label="Options"
          icon={
            <span className="w-[26px] h-[26px] flex items-center justify-center shrink-0 text-white/90 text-lg leading-none">
              ≡
            </span>
          }
        />
        <DeckButtonHint face="A" label="Select" />
        <DeckButtonHint face="B" label="Back" />
      </div>
    </footer>
  );
}
