import { useEffect } from "react";
import { useDeckStore } from "../../store/deckStore";
import { useLeftJoystickNav } from "../../hooks/useLeftJoystickNav";
import { MENU_ITEMS } from "../../data/menuItems";
import { JzlPortfolioEmbed } from "./JzlPortfolioEmbed";

export function MainMenu() {
  const navigateTo = useDeckStore((s) => s.navigateTo);
  const selectedIndex = useDeckStore((s) => s.selectedIndex);
  const setSelectedIndex = useDeckStore((s) => s.setSelectedIndex);
  const pressedButtons = useDeckStore((s) => s.pressedButtons);
  const selected = MENU_ITEMS[selectedIndex] ?? MENU_ITEMS[0];

  useLeftJoystickNav(MENU_ITEMS.length);

  useEffect(() => {
    if (pressedButtons.has("A")) {
      navigateTo(MENU_ITEMS[selectedIndex].app);
    }
  }, [pressedButtons, selectedIndex, navigateTo]);

  return (
    <div className="w-full h-full flex bg-neutral-900 min-h-0">
      <div className="w-64 shrink-0 border-r border-neutral-800 py-6">
        {MENU_ITEMS.map((item, i) => (
          <button
            key={item.app}
            type="button"
            data-testid={`menu-${item.app}`}
            onClick={() => navigateTo(item.app)}
            onMouseEnter={() => setSelectedIndex(i)}
            className={`w-full text-left px-6 py-3 flex items-center gap-3 text-lg transition-colors ${
              selectedIndex === i
                ? "bg-blue-600 text-white"
                : "text-neutral-300 hover:bg-neutral-800"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {selected.app === "about" ? (
          <>
            <div className="flex-1 min-h-0 relative">
              <JzlPortfolioEmbed scrollEnabled />
            </div>
            <p className="shrink-0 text-center text-xs text-neutral-500 py-2 border-t border-neutral-800">
              Right stick to scroll · A for full screen · B back from About
            </p>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-neutral-500">
            <div className="text-center px-8">
              <div className="text-5xl mb-4">🎮</div>
              <div className="text-lg mb-2">Left joystick or D-pad to move, A to open</div>
              <p className="text-sm text-neutral-600">Pick Games to browse the library</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
