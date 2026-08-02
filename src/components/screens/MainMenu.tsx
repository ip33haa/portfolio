import { useEffect, useMemo, useRef, useState } from "react";
import { useDeckStore } from "../../store/deckStore";
import { useDeckGridNav } from "../../hooks/useDeckGridNav";
import { useButtonEdge } from "../../hooks/useButtonEdge";
import {
  LIBRARY_ITEMS,
  LIBRARY_TABS,
  itemsForTab,
  type LibraryTabId,
} from "../../data/libraryItems";
import { DeckLibraryHeader } from "../steam-ui/DeckLibraryHeader";
import { DeckLibraryFooter } from "../steam-ui/DeckLibraryFooter";
import { DeckPosterTile } from "../steam-ui/DeckPosterTile";

const GRID_COLUMNS = 5;

export function MainMenu() {
  const navigateTo = useDeckStore((s) => s.navigateTo);
  const selectedIndex = useDeckStore((s) => s.selectedIndex);
  const setSelectedIndex = useDeckStore((s) => s.setSelectedIndex);
  const pressedButtons = useDeckStore((s) => s.pressedButtons);

  const [tabIndex, setTabIndex] = useState(0);
  const activeTab = LIBRARY_TABS[tabIndex] ?? LIBRARY_TABS[0];
  const visibleItems = useMemo(() => itemsForTab(activeTab.id), [activeTab.id]);
  const selected = visibleItems[selectedIndex] ?? visibleItems[0];

  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const tabCounts = useMemo(() => {
    const counts: Record<LibraryTabId, number> = {} as Record<LibraryTabId, number>;
    for (const tab of LIBRARY_TABS) {
      counts[tab.id] = LIBRARY_ITEMS.filter(tab.filter).length;
    }
    return counts;
  }, []);

  useDeckGridNav(visibleItems.length, GRID_COLUMNS, selectedIndex, setSelectedIndex);

  useButtonEdge("L1", () => setTabIndex((i) => Math.max(0, i - 1)));
  useButtonEdge("R1", () => setTabIndex((i) => Math.min(LIBRARY_TABS.length - 1, i + 1)));

  useEffect(() => {
    setSelectedIndex(0);
  }, [tabIndex, setSelectedIndex]);

  useEffect(() => {
    if (selectedIndex >= visibleItems.length) {
      setSelectedIndex(Math.max(0, visibleItems.length - 1));
    }
  }, [selectedIndex, visibleItems.length, setSelectedIndex]);

  useEffect(() => {
    tileRefs.current[selectedIndex]?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "smooth",
    });
  }, [selectedIndex, tabIndex]);

  useEffect(() => {
    if (pressedButtons.has("A") && selected) {
      navigateTo(selected.app);
    }
  }, [pressedButtons, selected, navigateTo]);

  return (
    <div className="w-full h-full flex flex-col deck-library-bg text-white min-h-0">
      <DeckLibraryHeader
        tabs={LIBRARY_TABS}
        activeTabIndex={tabIndex}
        itemCounts={tabCounts}
      />

      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto px-5 pb-4">
        <div className="grid grid-cols-5 gap-3.5">
          {visibleItems.map((item, index) => (
            <DeckPosterTile
              key={item.id}
              item={item}
              selected={index === selectedIndex}
              onSelect={() => setSelectedIndex(index)}
              onActivate={() => navigateTo(item.app)}
              tileRef={(el) => {
                tileRefs.current[index] = el;
              }}
            />
          ))}
        </div>
      </div>

      <DeckLibraryFooter />
    </div>
  );
}
