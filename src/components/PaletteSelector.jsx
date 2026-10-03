import React from "react";
import { THEME_PALETTES } from "../utils/themePresets";
import { Palette } from "lucide-react";

const PaletteSelector = ({ currentPalette, onSelectPalette, darkMode }) => {
  return (
    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
      <div className="px-2 hidden md:flex items-center gap-1 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
        <Palette className="w-3 h-3" />
        <span>Theme:</span>
      </div>
      <div className="flex items-center gap-1">
        {THEME_PALETTES.map((p) => {
          const isSelected = currentPalette.id === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectPalette(p)}
              title={`${p.name} theme`}
              className={`group relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                isSelected
                  ? darkMode
                    ? "bg-zinc-800 text-zinc-100 shadow-xs border border-zinc-700/80"
                    : "bg-white text-zinc-900 shadow-xs border border-zinc-200"
                  : darkMode
                  ? "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                  : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/50"
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full ring-1 ring-black/10 dark:ring-white/10"
                style={{ backgroundColor: p.primaryHex }}
              />
              <span className="hidden sm:inline text-[11px]">{p.name.split(" ")[1] || p.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PaletteSelector;
