import { useEffect, useState } from "react";
import type { LibraryTab } from "../../data/libraryItems";

function formatClock(date: Date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

type DeckLibraryHeaderProps = {
  tabs: LibraryTab[];
  activeTabIndex: number;
  itemCounts: Record<string, number>;
};

export function DeckLibraryHeader({ tabs, activeTabIndex, itemCounts }: DeckLibraryHeaderProps) {
  const [time, setTime] = useState(() => formatClock(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(formatClock(new Date())), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="relative z-10 shrink-0 px-4 pt-3 pb-2">
      <div className="flex items-center justify-end gap-4 mb-3 text-white/85">
        <SearchIcon />
        <WifiIcon />
        <BatteryIcon />
        <span className="text-sm tabular-nums">{time}</span>
        <span className="w-8 h-8 rounded-md bg-gradient-to-br from-violet-600 to-indigo-900 flex items-center justify-center text-lg shadow-inner">
          🛸
        </span>
      </div>

      <div className="flex items-center gap-3">
        <ShoulderHint label="L1" />
        <nav className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-none min-w-0">
          {tabs.map((tab, i) => {
            const count = itemCounts[tab.id] ?? 0;
            const active = i === activeTabIndex;
            return (
              <div
                key={tab.id}
                className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-semibold tracking-wide uppercase transition-colors ${
                  active
                    ? "bg-[#5c6670] text-white"
                    : "text-white/55"
                }`}
              >
                {tab.label} {count}
              </div>
            );
          })}
        </nav>
        <ShoulderHint label="R1" />
      </div>
    </header>
  );
}

function ShoulderHint({ label }: { label: string }) {
  return (
    <span className="shrink-0 w-9 h-7 rounded-md bg-[#3d4450] border border-white/10 flex items-center justify-center text-[11px] font-bold text-white/90">
      {label}
    </span>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-white/80 fill-none" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white/80">
      <path d="M12 18c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-4-3c2.2 0 4.2.9 5.7 2.3l1.4-1.4C13.5 13.4 10.9 12.3 8 12.3s-5.5 1.1-7.1 2.6l1.4 1.4C3.8 15.9 5.8 15 8 15zm8 0c2.2 0 4.2.9 5.7 2.3l1.4-1.4c-2-1.8-4.6-2.9-7.1-2.9s-5.5 1.1-7.1 2.6l1.4 1.4C11.8 15.9 13.8 15 16 15zM8 9c3.3 0 6.3 1.3 8.5 3.5l1.4-1.4C15.4 8.6 11.9 7.2 8 7.2S.6 8.6-1.9 11.1l1.4 1.4C1.7 10.3 4.7 9 8 9z" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg viewBox="0 0 28 14" className="w-7 h-3.5">
      <rect x="1" y="2" width="22" height="10" rx="2" fill="none" stroke="#59bf40" strokeWidth="1.5" />
      <rect x="3" y="4" width="17" height="6" rx="1" fill="#59bf40" />
      <rect x="24" y="5" width="2" height="4" rx="0.5" fill="#59bf40" />
    </svg>
  );
}
