import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

function getInitialTheme() {
  if (typeof window === "undefined") return "light";

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme && ["light", "dark", "auto"].includes(savedTheme)) {
    return savedTheme;
  }

  try {
    const profileCache = localStorage.getItem("profile_cache");
    if (profileCache) {
      const parsed = JSON.parse(profileCache);
      if (parsed?.theme && ["light", "dark", "auto"].includes(parsed.theme)) {
        return parsed.theme;
      }
    }
  } catch {
    // ignore json parse error
  }

  return "light";
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);
  const [resolvedTheme, setResolvedTheme] = useState("light");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      let activeTheme = theme;
      if (theme === "auto") {
        activeTheme = mediaQuery.matches ? "dark" : "light";
      }

      setResolvedTheme(activeTheme);

      if (activeTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    applyTheme();

    const listener = () => {
      if (theme === "auto") {
        applyTheme();
      }
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [theme]);

  const setTheme = (newTheme) => {
    if (!["light", "dark", "auto"].includes(newTheme)) return;
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);

    // Sync with profile_cache if present
    try {
      const profileCache = localStorage.getItem("profile_cache");
      if (profileCache) {
        const parsed = JSON.parse(profileCache);
        parsed.theme = newTheme;
        localStorage.setItem("profile_cache", JSON.stringify(parsed));
      }
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const isDark = resolvedTheme === "dark";

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        isDark,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
