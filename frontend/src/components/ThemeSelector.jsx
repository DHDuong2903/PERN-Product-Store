import { PaletteIcon } from "lucide-react";
import { THEMES } from "../constants/index";
import { useThemeStore } from "../stores/useThemeStore";

function ThemeSelector() {
  const { theme, setTheme } = useThemeStore();
  console.log(theme);
  return (
    <div className="dropdown dropdown-end">
      {/* Dropdown trigger */}
      <button tabIndex={0} className="btn btn-ghost btn-circle">
        <PaletteIcon className="size-5" />
      </button>

      <div
        tabIndex={0}
        className="dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl w-56 border border-base-content/10"
      >
        {THEMES.map((themeOption) => (
          <button
            key={themeOption.name}
            className={`w-full py-3 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
              theme === themeOption.name ? "bg-primary/10 text-primary" : "hover:bg-base-content/5"
            }`}
            onClick={() => setTheme(themeOption.name)}
          >
            <PaletteIcon className="size-4" />
            <span className="text-sm font-medium">{themeOption.label}</span>

            {/* Theme preview colors */}
            <div className="ml-auto flex gap-1">
              {themeOption.colors.map((color, index) => (
                <span key={index} className="size-2 rounded-full" style={{ backgroundColor: color }}></span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ThemeSelector;
