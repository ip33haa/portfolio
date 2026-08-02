type DeckButtonHintProps = {
  face?: "A" | "B" | "X" | "Y" | "steam";
  label: string;
  icon?: React.ReactNode;
};

export function DeckButtonHint({ face, label, icon }: DeckButtonHintProps) {
  return (
    <div className="flex items-center gap-2 text-[13px] text-white/90 tracking-wide">
      {face === "steam" ? (
        <span className="w-[26px] h-[26px] rounded-full border-2 border-white/90 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white" aria-hidden>
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 14.5c0 .8.7 1.5 1.5 1.5h1v-1.5H9.5c-.3 0-.5-.2-.5-.5s.2-.5.5-.5H11v-1H9.5c-.8 0-1.5.7-1.5 1.5zm5-1.5h1.5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5H13v-3zm0 2h1.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5H13V15z" />
          </svg>
        </span>
      ) : face ? (
        <span className="w-[26px] h-[26px] rounded-full border-2 border-white/90 flex items-center justify-center text-[11px] font-bold shrink-0">
          {face}
        </span>
      ) : (
        icon
      )}
      <span className="uppercase">{label}</span>
    </div>
  );
}
